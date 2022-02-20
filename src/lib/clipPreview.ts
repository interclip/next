import Redis from 'ioredis';
import { getLinkPreview } from 'link-preview-js';
import { OEmbed } from 'src/typings/interclip';

export const defaultRedisClient = (
  customSettings?: Redis.RedisOptions,
): Redis.Redis => {
  const settings = {
    ...customSettings,
    connectTimeout: 2,
    maxRetriesPerRequest: 7,
    password: process.env.REDIS_PASSWORD || undefined,
  };
  return new Redis(
    parseInt(process.env.REDIS_PORT || '6379', 10),
    process.env.REDIS_HOST || 'localhost',
    settings,
  );
};

export const testRedis = async (): Promise<boolean> => {
  const redis = defaultRedisClient({
    maxRetriesPerRequest: 3,
    connectTimeout: 1,
  });
  try {
    await redis.ping();
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
