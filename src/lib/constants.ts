export const IS_PROD = process.env.NODE_ENV === 'production';
export const baseUrl = process.env.BASE_URL;
export const web3StorageToken = process.env.WEB3_TOKEN;

export const ipfsGateway = 'https://ipfs.interclip.app';
export const githubRepo = 'https://github.com/interclip/next';

export const maxNameAllowedLength = 64;
export const maxUsernameAllowedLength = 48;
export const maxIPFSUploadSize = 31_000_000_000;
export const maxExpirationLength = 365 * 69;
export const defaultExpirationLength = 30;

export const minimumCodeLength = 5;
export const maximumCodeLength = 99;

export enum StorageProvider {
  S3 = 'S3',
  IPFS = 'IPFS',
}

export const sampleURLs = [
  'https://interclip.app',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.histories.cc/',
  'https://devparty.io/',
  'https://opensea.io/assets/matic/0x2953399124f0cbb46d2cbacd8a89cf0599974963/106565623496713384605063112493700845981575250044632175243042012644862217682945',
  'https://www.npmjs.com/package/bruh-cli',
];
