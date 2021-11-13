import { PrismaClient } from '@prisma/client';
import { createPrismaRedisCache } from 'prisma-redis-middleware';

import { IS_PROD } from './constants';

/**
 * Ensure that there's only a single Prisma instance in dev. This is detailed here:
 * https://www.prisma.io/docs/support/help-articles/nextjs-prisma-client-dev-practices
 */
declare global {
  var __globalPrisma__: PrismaClient;
}

const cache = {
  model: 'Clip',
  cacheTime: 60 * 1000 * 30,
};

const config = {
  REDIS_HOST: 'localhost',
  REDIS_PORT: '6379',
  REDIS_AUTH: '',
};

export let db: PrismaClient;

if (IS_PROD) {
  db = new PrismaClient({
    log: ['error', 'warn'],
  });
} else {
  if (!global.__globalPrisma__) {
    global.__globalPrisma__ = new PrismaClient({
      log: ['error', 'warn'],
    });
  }

  db = global.__globalPrisma__;
}
db.$use(createPrismaRedisCache(cache, config));
