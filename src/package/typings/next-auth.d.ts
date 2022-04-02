export interface DiscordProfile {
  /**
   * Not returned by Discord, but added by us
   */
  image_url: string;
  id: string;
  username: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: any;
  banner_color: string;
  accent_color: number;
  locale: string;
  mfa_enabled: boolean;
  email: string;
  verified: boolean;
}
