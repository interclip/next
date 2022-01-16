import { Clip } from '@prisma/client';
import { needsAdmin } from '@utils/api/ensureAuth';
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

type ClipsResponse = SuccessResponse<Clip[]> | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ClipsResponse>,
) {
  try {
    await limiter.check(res, 169, 'CACHE_TOKEN');
  } catch {
    res.status(429).json({
      status: 'error',
      result: 'Rate limit exceeded',
    });
  }

  // Make sure the user is logged in and is an admin
  needsAdmin(req, res);

  const { limit = '50', from = 0 } = req.query;

  if (typeof limit === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many limit query params provided. Please only query one code per request.',
    });
    return;
  }

  if (typeof from === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many from query params provided. Please only query one code per request.',
    });
    return;
  }

  if (isNaN(Number(limit))) {
    res.status(400).json({
      status: 'error',
      result: 'The provided limit has an invalid format.',
    });
  }

  try {
    const queriedClips = await db.clip.findMany({
      take: Number(limit),
      skip: Number(from) || 0,
      where: {},
    });

    if (queriedClips.length === 0) {
      res.status(204).json({
        status: 'error',
        result: '',
      });
      return;
    }

    if (queriedClips) {
      res.status(200).json({ status: 'success', result: queriedClips });
    } else {
      res.status(404).json({
        status: 'error',
        result: 'Clips not found.',
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
