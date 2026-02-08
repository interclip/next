import getCacheToken from '@utils/determineCacheToken';
import formatBytes from '@utils/formatBytes';
import { createStorageClient } from '@utils/helpers';
import limiter from '@utils/rateLimit';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const cacheToken = getCacheToken(req);

  if (req.method === 'HEAD') {
    await limiter.check(res, 10, cacheToken);
    return res.status(200).end();
  }

  await limiter.check(res, 3, cacheToken);
  const auth = await getSession({ req });
  const { name: fileName, type, token, size: fileSize } = req.query;

  if (!fileName) {
    return res.status(400).json({
      status: 'error',
      result: 'Missing query params `name`',
    });
  }

  if (
    typeof fileName === 'object' ||
    typeof type === 'object' ||
    typeof token === 'object' ||
    typeof fileSize === 'object'
  ) {
    return res.status(400).json({
      status: 'error',
      result:
        'Too many file query params provided. You can only upload one file per request.',
    });
  }

  if (
    !(process.env.ACCESS_KEY && process.env.SECRET_KEY && process.env.REGION)
  ) {
    return res.status(503).json({
      status: 'error',
      result: 'Server is misconfigured (missing S3 credentials)',
    });
  }

  const GIGABYTE = 1024 * 1_048_576;

  let fileSizeLimit = GIGABYTE;

  if (auth) {
    fileSizeLimit = GIGABYTE * 2;
  }

  if (token) {
    if (!process.env.FILES_TOKEN) {
      return res.status(503).json({
        status: 'error',
        result: 'Server is misconfigured (missing FILES_TOKEN)',
      });
    }

    if (token !== process.env.FILES_TOKEN) {
      return res.status(403).json({
        status: 'error',
        result: 'Bad credentials (token)',
      });
    }

    fileSizeLimit = GIGABYTE * 100;
  }

  if (fileSize) {
    const parsedSize = parseInt(fileSize, 10);

    if (isNaN(parsedSize)) {
      return res.status(400).json({
        status: 'error',
        result: 'The provided file size value is invalid',
      });
    }

    if (parsedSize > fileSizeLimit) {
      return res.status(413).json({
        status: 'error',
        result: `Your file is ${formatBytes(
          parsedSize,
        )}, which is over the limit of ${formatBytes(fileSizeLimit)}`,
      });
    }
  }

  const s3 = createStorageClient();

  const key = `fn${nanoid(10)}/${fileName}`;

  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key,
      'Content-Type': type,
    },
    Expires: 60,
    Conditions: [['content-length-range', 0, fileSizeLimit]],
  });

  res.status(200).json(post);
}
