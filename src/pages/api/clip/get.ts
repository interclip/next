import getCacheToken from '@utils/determineCacheToken';
import { isValidClipCode } from '@utils/isClip';
import { db } from '@utils/prisma';
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

type ClipResponse = SuccessResponse<any> | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClipResponse>,
) {
  await limiter.check(res, 30, getCacheToken(req));

  if (!req.method || !['POST', 'GET'].includes(req.method)) {
    res.status(405).json({
      status: 'error',
      result: 'Method not allowed. Use GET or POST',
    });
    return;
  }

  const { code: clipCode } =
    Object.entries(req.body).length !== 0 ? req.body : req.query;

  if (!clipCode) {
    res.status(400).json({
      status: 'error',
      result: 'No code provided.',
    });
    return;
  }

  if (typeof clipCode === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many code query params provided. Please only query one code per request.',
    });
    return;
  }

  if (!isValidClipCode) {
    res.status(400).json({
      status: 'error',
      result: 'The provided code has an invalid format.',
    });
  }

  const queriedClip = db.clip.findFirst({
    where: {
      code: {
        startsWith: clipCode,
      },
    },
    select: {
      code: true,
      url: true,
      ownerID: true,
      createdAt: true,
      expiresAt: true,
    },
    orderBy: {
      createdAt: 'asc',
    },
  });

  try {
    const clipResult = await queriedClip;
    const expired = clipResult?.expiresAt
      ? new Date().getTime() - clipResult.expiresAt.getTime() > 0
      : false;
    if (clipResult && !expired) {
      res.setHeader(
        'Cache-Control',
        's-maxage=86400, stale-while-revalidate=3600',
      );
      res.status(200).json({ status: 'success', result: clipResult });
    } else {
      res.status(404).json({
        status: 'error',
        result: 'Clip not found.',
      });
      if (clipResult && expired) {
        await db.clip.delete({ where: { code: clipResult.code } });
      }
    }
  } catch (e) {
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
