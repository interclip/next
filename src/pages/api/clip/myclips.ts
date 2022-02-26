import { needsAuth } from '@utils/api/ensureAuth';
import {
  defaultRedisClient,
  storeLinkPreviewInCache,
} from '@utils/clipPreview';
import { getUserIDFromEmail } from '@utils/dbHelpers';
import getCacheToken from '@utils/determineCacheToken';
import { db } from '@utils/prisma';
import limiter from '@utils/rateLimit';
import type { NextApiRequest, NextApiResponse } from 'next';
import { APIResponse } from 'src/typings/interclip';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  await limiter.check(res, 30, getCacheToken(req));

  const session = await needsAuth(req, res);

  try {
    const clips = await db.clip.findMany({
      where: {
        ownerID: await getUserIDFromEmail(session!.user?.email),
      },
      select: {
        code: true,
        hashLength: true,
        ipfsHash: true,
        url: true,
        createdAt: true,
        expiresAt: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const newClips = [];

    const redisClient = defaultRedisClient();
    for (const clip of clips) {
      const urlObject = new URL(clip.url);
      const additionalDetails =
        ['http', 'https'].includes(urlObject.protocol) &&
        (await storeLinkPreviewInCache(clip.url, redisClient));

      if (additionalDetails) {
        newClips.push({
          ...clip,
          oembed: {
            ...additionalDetails,
          },
        });
      } else {
        newClips.push(clip);
      }
    }
    redisClient.disconnect();
    res.setHeader(
      'Cache-Control',
      's-maxage=60, stale-while-revalidate=600, private',
    );
    res.status(200).json({ status: 'success', result: newClips });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
