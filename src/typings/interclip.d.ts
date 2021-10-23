interface Clip {
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
  expiresAt: string;
}
