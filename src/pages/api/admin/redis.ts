import { needsAdmin } from '@utils/api/ensureAuth';
import { defaultRedisClient, testRedis } from '@utils/clipPreview';
import getCacheToken from '@utils/determineCacheToken';
import limiter from '@utils/rateLimit';
import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  status: 'error';
  result: string;
}

interface SuccessResponse<T> {
  status: 'success';
  result: T;
}

export type RedisTestResponse =
  | SuccessResponse<{ up: boolean }>
  | ErrorResponse;
export type RedisFlushResponse =
  | SuccessResponse<{ flushed: boolean }>
  | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RedisTestResponse | RedisFlushResponse>,
) {
  await limiter.check(res, 42, getCacheToken(req));

  // Make sure the user is logged in and is an admin
  needsAdmin(req, res);

  const { action } = req.query;

  if (typeof action === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many action query params provided. Please only do one per request.',
    });
    return;
  }
  switch (action) {
    case 'test': {
      res.json({
        status: 'success',
        result: { up: await testRedis() },
      });
    }
    case 'flush': {
      const redis = defaultRedisClient({
        connectTimeout: 10,
      });
      try {
        await redis.flushall();
        res.json({
          status: 'success',
          result: { flushed: true },
        });
      } catch (error) {
        res.status(500).json({
          status: 'error',
          result: "Couldn't flush",
        });
      }
    }
    default: {
      res.status(400).json({
        status: 'error',
        result: 'Unknown action',
      });
    }
  }
}
