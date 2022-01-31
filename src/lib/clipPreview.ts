import Redis from 'ioredis';
import { getLinkPreview } from 'link-preview-js';
import { OEmbed } from 'src/typings/interclip';

export const defaultRedisClient = () =>
  new Redis(
    parseInt(process.env.REDIS_PORT || '6379', 10),
    process.env.REDIS_HOST || 'localhost',
    { password: process.env.REDIS_PASSWORD || undefined },
  );

export const testRedis = async (): Promise<boolean> => {
  const redis = defaultRedisClient();
  try {
    console.log(await redis.ping());
    // List all keys
    console.log('All keys:', await redis.keys('*'));
    return true;
  } catch {
    return false;
  }
};

export const storeLinkPreviewInCache = async (
  url: string,
  client?: Redis.Redis,
  force?: boolean,
): Promise<OEmbed> => {
  const oembedDetails = (await getLinkPreview(url)) as OEmbed;
  const redisTransformedClient = client || defaultRedisClient();
  const existingDetails = await redisTransformedClient.get(url);
  if (!existingDetails || force) {
    redisTransformedClient.setex(
      url,
      86_400 * 7,
      JSON.stringify(oembedDetails),
    );
  }
  if (!client) {
    redisTransformedClient.disconnect();
  }
  return oembedDetails;
};
