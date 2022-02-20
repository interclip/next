import {
  RedisFlushResponse,
  RedisTestResponse,
} from 'src/pages/api/admin/redis';

export const flushRedis = async (): Promise<RedisFlushResponse> => {
  const redisResponse = await fetch('/api/admin/redis?action=flush');
  if (!redisResponse.ok && redisResponse.status >= 500)
    return {
      status: 'error',
      result: 'The server could not handle the request.',
    };

  if (redisResponse.status === 429) {
    return {
      status: 'error',
      result: 'Too many requests, please try in a couple of seconds.',
    };
  }
  return await redisResponse.json();
};

export const generatePreviews = async (
  code: string,
): Promise<RedisFlushResponse> => {
  const redisResponse = await fetch(
    `/api/admin/redis?action=generatePreview&code=${code}`,
  );
  if (!redisResponse.ok && redisResponse.status >= 500)
    return {
      status: 'error',
      result: 'The server could not handle the request.',
    };

  if (redisResponse.status === 429) {
    return {
      status: 'error',
      result: 'Too many requests, please try in a couple of seconds.',
    };
  }
  return await redisResponse.json();
};

export const testRedis = async (): Promise<RedisTestResponse> => {
  const redisResponse = await fetch('/api/admin/redis?action=test');
  if (!redisResponse.ok && redisResponse.status >= 500)
    return {
      status: 'error',
      result: 'The server could not handle the request.',
    };

  if (redisResponse.status === 429) {
    return {
      status: 'error',
      result: 'Too many requests, please try in a couple of seconds.',
    };
  }
  return await redisResponse.json();
};
