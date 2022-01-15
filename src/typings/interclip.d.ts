import { Clip } from '.prisma/client';

interface OEmbed {
  url: string;
  title: string;
  siteName: string | null;
  description: string | null;
  mediaType: string;
  contentType: string | null;
  images: string[];
  videos: {}[];
  favicons: string[];
}

interface ClipWithPreview extends Clip {
  /**
   * A 5+ character long alpha-numeric code identifying the code. It is immutable and will not change, ever.
   */
  code: string;
  /**
   * The URL value of the clip
   */
  url: string;
  /**
   * A stringified DateTime object of the moment the clip was created
   */
  createdAt: string;
  /**
   * A stringified DateTime object of the moment the clip will expire
   */
  expiresAt: string;
  /**
   * An object which stores all info for the OEmbed preview to work
   */
  oembed?: OEmbed;
}

interface APIResponse {
  status: 'error' | 'success';
  result: any;
}

interface DropEvent {
  dataTransfer?: { files: File[] };
  target?: { files: File[] };
}

export enum StorageProvider {
  S3 = 'S3',
  IPFS = 'IPFS',
}

export interface CreatUsereArgs {
  email: string;
  name?: string;
  isStaff?: boolean;
  image?: string;
  username?: string;
  storageProvider?: StorageProvider;
}
