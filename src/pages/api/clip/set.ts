import type { NextApiRequest, NextApiResponse } from 'next';
import isURL from 'validator/lib/isURL';
import { APIResponse } from '../../../lib/types';
import { db } from '../../../lib/prisma';
import { getLinkPreview } from 'link-preview-js';
import { dateAddDays } from '../../../lib/dates';
import { getRandomID } from '../../../lib/generateID';
import { getSession } from 'next-auth/react';
import { getUserIDFromEmail } from '../../../lib/dbHelpers';
import rateLimit from '../../../lib/rateLimit';

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 500, // Max 500 reqs per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  try {
    await limiter.check(res, 60, 'CACHE_TOKEN');
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

  if (!isURL(clipURL)) {
    res.status(400).json({
      status: 'error',
      result: 'An invalid URL provided.',
    });
  }

  const duplicateClip = await db.clip.findFirst({
    where: {
      url: clipURL,
    },
  });

  if (duplicateClip) {
    res.status(200).json({ status: 'success', result: duplicateClip });
  } else {
    try {
      const linkPreview = (await getLinkPreview(clipURL)) as OEmbed;
      const newClip = await db.clip.create({
        data: {
          code: getRandomID(5),
          url: clipURL,
          expiresAt: dateAddDays(new Date(), 30),
          createdAt: new Date(),
          ownerID: await getUserIDFromEmail(session?.user?.email),
        },
      });
      await db.clipPreview.create({
        data: {
          id: newClip.id,
          title: linkPreview.title || linkPreview.siteName,
          description: linkPreview.description,
          favicons: linkPreview.favicons,
          images: linkPreview.images,
        },
      });
      res.status(200).json({ status: 'success', result: newClip });
    } catch (e) {
      res.status(500).json({
        status: 'error',
        result: 'An error with the database has occured.',
      });
    }
  }
}
