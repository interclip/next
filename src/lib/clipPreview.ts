import Redis from 'ioredis';
import { getLinkPreview } from 'link-preview-js';
import { OEmbed } from 'src/typings/interclip';
const redis = new Redis();

export const getLinkPreviewFromCache = async (
  url: string,
): Promise<OEmbed | null> => {
  const info = await redis.get(url);
  return info && JSON.parse(info);
};

export const storeLinkPreviewInCache = async (url: string): Promise<OEmbed> => {
  const oembedDetails = (await getLinkPreview(url)) as OEmbed;
  redis.setex(url, 86_400 * 7, JSON.stringify(oembedDetails));
  return oembedDetails;
};
