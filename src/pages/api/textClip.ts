import formatBytes from '@utils/formatBytes';
import { createStorageClient } from '@utils/helpers';
import { nanoid } from 'nanoid';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { name: fileName = 'clip', content } = req.body;

  if (!content) {
    return res.status(400).json({
      status: 'error',
      result: 'Missing query params `content`',
    });
  }

  if (typeof fileName === 'object' || typeof content === 'object') {
    return res.status(400).json({
      status: 'error',
      result:
        'Too many file query params provided. You can only upload one file per request.',
    });
  }

  const key = `${nanoid(10)}/${fileName}.txt`;
  const file = Buffer.from(content, 'utf-8');

  if (
    !(
      process.env.ACCESS_KEY &&
      process.env.SECRET_KEY &&
      process.env.REGION &&
      process.env.BUCKET_NAME
    )
  ) {
    return res.status(503).json({
      status: 'error',
      result: 'Server is misconfigured (missing S3 credentials)',
    });
  }

  const s3 = createStorageClient();

  const fileSizeLimit = 1e5; // 100 KB

  if (file.length > fileSizeLimit) {
    return res.status(413).json({
      status: 'error',
      result: `File is too large (max ${formatBytes(
        fileSizeLimit,
      )}). Your file is ${formatBytes(file.length)}`,
    });
  }

  const params = {
    Bucket: process.env.BUCKET_NAME!,
    Key: key,
    Body: file,
  };

  const uploadResult = await s3.upload(params).promise();

  return res.status(200).json({
    status: 'success',
    result: {
      url: uploadResult.Key,
    },
  });
}
