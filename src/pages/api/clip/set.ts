import { storeLinkPreviewInCache } from '@utils/clipPreview';
import { dateAddDays } from '@utils/dates';
import { getUserIDFromEmail } from '@utils/dbHelpers';
import getCacheToken from '@utils/determineCacheToken';
import { getClipHash } from '@utils/generateID';
import { db } from '@utils/prisma';
import limiter from '@utils/rateLimit';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isURL from 'validator/lib/isURL';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  try {
    await limiter.check(res, 60, getCacheToken(req));
  } catch {
    res.status(429).json({
      status: 'error',
      result: 'Rate limit exceeded',
    });
  }

  const session = await getSession({ req });

  const { url: clipURL } = req.query;

  if (!clipURL) {
    res.status(400).json({
      status: 'error',
      result: 'No URL provided.',
    });
    return;
  }

  if (typeof clipURL === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many URL query params provided. Please only provide one URL per request.',
    });
    return;
  }
  const parsedURL = encodeURI(clipURL);

  if (
    !isURL(parsedURL, {
      require_valid_protocol: true,
      protocols: ['http', 'https', 'ipfs', 'ipns'],
    })
  ) {
    res.status(400).json({
      status: 'error',
      result: 'An invalid URL provided.',
    });
  }

  // If a clip with the same 5-character hash already exists, adjust the hash to be a character longer
  const clipHash = getClipHash(clipURL);
  const existingClip = await db.clip.findFirst({
    where: {
      code: {
        startsWith: clipHash.slice(0, 5),
      },
    },
    select: {
      hashLength: true,
      code: true,
    },
  });

  if (existingClip && existingClip.code === clipHash) {
    // Duplicate clip
    res.status(200).json({
      status: 'success',
      result: existingClip,
    });
  } else if (existingClip) {
    // Clip with equal starting hash
    let equal = 0;
    // Get number of equal characters between `clipHash` and `existingClip.code`
    for (; equal < clipHash.length - 1; equal++) {
      if (clipHash[equal] !== existingClip.code[equal]) {
        break;
      }
    }

    const newHash = getClipHash(clipURL);
    await db.clip.update({
      where: {
        code: existingClip.code,
      },
      data: {
        hashLength: equal + 1,
        code: newHash,
      },
    });

    res.status(200).json({
      status: 'success',
      result: { ...existingClip, hashLength: equal + 1 },
    });
  } else {
    try {
      const newClip = await db.clip.create({
        data: {
          code: getClipHash(parsedURL),
          url: parsedURL,
          expiresAt: dateAddDays(new Date(), 30),
          createdAt: new Date(),
          ownerID: await getUserIDFromEmail(session?.user?.email),
        },
      });
      await storeLinkPreviewInCache(parsedURL);
      res.status(200).json({ status: 'success', result: newClip });
    } catch (e) {
      res.status(500).json({
        status: 'error',
        result: 'An error with the database has occured.',
      });
    }
  }
}
