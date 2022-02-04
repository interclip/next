import LRU from 'lru-cache';
import type { NextApiResponse } from 'next';

const rateLimit = (options: {
  uniqueTokenPerInterval: number;
  interval: number;
}) => {
  const tokenCache = new LRU({
    max: options.uniqueTokenPerInterval || 500,
    maxAge: options.interval || 60000,
  });

  return {
    /**
     *
     * @param res the response object to act upon
     * @param limit the limit of requests within a certain time frame
     * @param token the token for checking the client's remaining requests
     */
    check: (res: NextApiResponse, limit: number, token: string) =>
      new Promise<void>((resolve, reject) => {
        const tokenCount: any = tokenCache.get(token) || [0];
        if (tokenCount[0] === 0) {
          tokenCache.set(token, tokenCount);
        }
        tokenCount[0] += 1;

        const currentUsage = tokenCount[0];
        const isRateLimited = currentUsage >= limit;
        res.setHeader('X-RateLimit-Limit', limit);
        res.setHeader(
          'X-RateLimit-Remaining',
          isRateLimited ? 0 : limit - currentUsage,
        );

        if (isRateLimited) {
          res.status(429).json({
            status: 'error',
            result: 'Rate limit exceeded',
          });
          return reject();
        }

        return resolve();
      }),
  };
};

/**
 * Creates a rate limiter, which resets every 60 seconds for every token (client) with a max cache size of 500
 */
const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 reqs per second
});

export default limiter;
