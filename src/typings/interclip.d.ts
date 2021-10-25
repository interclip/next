interface ClipWithPreview {
  /**
   * A random 5 character long alpha-numeric code identifying the code
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

interface APIResponse {
  status: 'error' | 'success';
  result: any;
}
