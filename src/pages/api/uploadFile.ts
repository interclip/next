import aws from 'aws-sdk';
import cuid from 'cuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { name, type } = req.query;

  if (!name) {
    return res.status(400).json({
      status: 'error',
      result: 'Missing query params `name`',
    });
  }

  if (typeof name === 'object' || typeof type === 'object') {
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

  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const ep = new aws.Endpoint(`s3.${process.env.REGION}.wasabisys.com`);
  const s3 = new aws.S3({ endpoint: ep });
  const fileExt = name.slice(((name.lastIndexOf('.') - 1) >>> 0) + 2);

  const fileSizeLimit = session ? 1e10 : 1e9; // up to 10 GB if authenthicated

  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: fileExt ? `${cuid()}.${fileExt}` : cuid(),
      'Content-Type': type,
      // Todo(ft): preserve filenames
      //'Content-Disposition': `attachment; filename="${name}"`,
    },
    Expires: 60,
    Conditions: [['content-length-range', 0, fileSizeLimit]],
  });

  res.status(200).json(post);
}
