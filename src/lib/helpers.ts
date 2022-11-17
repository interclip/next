import aws from 'aws-sdk';

export const createStorageClient = () => {
  aws.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
    region: process.env.REGION,
    signatureVersion: 'v4',
  });

  const endpoint = new aws.Endpoint(`s3.${process.env.REGION}.wasabisys.com`);
  return new aws.S3({ endpoint });
};
