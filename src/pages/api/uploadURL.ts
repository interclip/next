import aws from 'aws-sdk';
import cuid from 'cuid';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { file, fileType } = req.query;

  if (typeof file === 'object') {
    return res.status(400).json({
      status: 'error',
      result:
        'Too many file query params provided. You can only upload one file per request.',
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
  const fileExt = file.split('.').pop();

  const fileSizeLimit = session ? 1e10 : 1e8; // up to 10 GB if authenthicated

  const post = s3.createPresignedPost({
    Bucket: process.env.BUCKET_NAME,
    Fields: {
      key: `${cuid()}.${fileExt}`,
      'Content-Type': fileType,
      // Todo(ft): preserve filenames
      //"Content-Disposition": `attachment; filename="${file}"
    },
    Expires: 60,
    Conditions: [['content-length-range', 0, fileSizeLimit]],
  });

  console.log(session ? 'Authed' : 'Unauthed');
  res.status(200).json(post);
}
