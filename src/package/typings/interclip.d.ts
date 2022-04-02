import { StorageProvider } from '../lib/constants';
import { Clip } from '.prisma/client';

type OEmbed = {
  url: string;
  title?: string;
  siteName?: string;
  description?: string;
  mediaType: string;
  contentType?: string;
  images?: string[];
  videos?: {
    url: string | undefined;
    secureUrl: string | null | undefined;
    type: string | null | undefined;
    width: string | undefined;
    height: string | undefined;
  }[];
  favicons: string[];
} | null;

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

interface ErrorResponse {
  status: 'error';
  /**
   * The error message to be displayed
   */
  result: string;
}

interface SuccessResponse<T> {
  status: 'success';
  result: T;
}

interface APIResponse {
  status: 'success' | 'error';
  result: any;
}

interface DropEvent {
  dataTransfer?: DataTransfer;
  target?: { files: File[] };
}

export interface CreatUsereArgs {
  email: string;
  name?: string;
  isStaff?: boolean;
  image?: string;
  username?: string;
  storageProvider?: StorageProvider;
}
