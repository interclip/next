import { createStorageClient } from '@utils/helpers';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { name: fileName, type } = req.query;

  if (!fileName) {
    return res.status(400).json({
      status: 'error',
      result: 'Missing query params `name`',
    });
  }

  if (typeof fileName === 'object' || typeof type === 'object') {
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

  const s3 = createStorageClient();

  const fileSizeLimit = session ? 1e10 : 1e9; // up to 10 GB if authenticated, otherwise just 1
  const key = `${nanoid(10)}/${fileName}`;

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
