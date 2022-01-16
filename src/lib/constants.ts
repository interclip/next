export const IS_PROD = process.env.NODE_ENV === 'production';
export const web3StorageToken = process.env.WEB3_TOKEN;

export const maxNameAllowedLength = 64;
export const maxUsernameAllowedLength = 48;

export const minimumCodeLength = 5;

export enum StorageProvider {
  S3 = 'S3',
  IPFS = 'IPFS',
}
