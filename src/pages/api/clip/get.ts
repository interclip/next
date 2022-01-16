import getCacheToken from '@utils/determineCacheToken';
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
  try {
    await limiter.check(res, 169, getCacheToken(req));
  } catch {
    res.status(429).json({
      status: 'error',
      result: 'Rate limit exceeded',
    });
  }

  const { code: clipCode } = req.query;

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

  if (!clipCode.match(new RegExp(/^[A-Za-z0-9]{5,99}$/))) {
    res.status(400).json({
      status: 'error',
      result: 'The provided code has an invalid format.',
    });
  }

  const queriedClip = db.clip.findMany({
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
  });

  try {
    const clipResult = await queriedClip;
    if (clipResult) {
      res.status(200).json({ status: 'success', result: clipResult });
    } else {
      res.status(404).json({
        status: 'error',
        result: 'Clip not found.',
      });
    }
  } catch (e) {
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
