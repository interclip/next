import { uploadToIPFS } from '@utils/backupIPFS';
import { storeLinkPreviewInCache } from '@utils/clipPreview';
import { defaultExpirationLength } from '@utils/constants';
import { dateAddDays } from '@utils/dates';
import { getUserIDFromEmail } from '@utils/dbHelpers';
import getCacheToken from '@utils/determineCacheToken';
import { getClipHash } from '@utils/generateID';
import { db } from '@utils/prisma';
import limiter from '@utils/rateLimit';
import { recoverPersonalSignature } from 'eth-sig-util';
import { isAddress } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { APIResponse } from 'src/typings/interclip';
import isMagnetURI from 'validator/lib/isMagnetURI';
import isURL from 'validator/lib/isURL';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  await limiter.check(res, 30, getCacheToken(req));

  const session = await getSession({ req });

  const { url: clipURL, sig: signature, addr: address } = req.query;

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

  if (typeof signature === 'object' || typeof address === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many signature query params provided. Please only provide only one per request.',
    });
    return;
  }

  const clipHash = getClipHash(clipURL);

  if (signature && address) {
    if (!isAddress(address)) {
      res.status(400).json({
        status: 'error',
        result: 'Invalid address, cannot sign',
      });
      return;
    } else {
      try {
        const recoveredAddress = recoverPersonalSignature({
          data: clipHash,
          sig: signature,
        });
        if (recoveredAddress !== address) {
          res.status(400).json({
            status: 'error',
            result:
              'Signature author differs from provided address, cannot sign',
          });
        }
      } catch (e) {
        res.status(400).json({
          status: 'error',
          result: 'Signature cannot be verified',
        });
      }
    }
  }

  const parsedURL = encodeURI(clipURL);

  if (
    !isURL(parsedURL, {
      require_valid_protocol: true,
      protocols: ['http', 'https', 'ipfs', 'ipns'],
    }) &&
    !isMagnetURI(clipURL)
  ) {
    res.status(400).json({
      status: 'error',
      result: 'An invalid URL/magnet link provided.',
    });
  }

  // If a clip with the same 5-character hash already exists, adjust the hash to be a character longer
  const existingClip = await db.clip.findFirst({
    where: {
      code: {
        startsWith: clipHash.slice(0, 5),
      },
    },
    select: {
      hashLength: true,
      code: true,
      createdAt: true,
      ipfsHash: true,
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

    res.setHeader(
      'Cache-Control',
      's-maxage=86400, stale-while-revalidate=3600',
    );
    res.status(200).json({
      status: 'success',
      result: { ...existingClip, hashLength: equal + 1 },
    });
  } else {
    try {
      const userPrefferedExpiration = session?.user?.email
        ? (await db.user.findUnique({ where: { email: session.user.email } }))
            ?.clipExpirationPreference
        : null;
      const expiration = userPrefferedExpiration ?? defaultExpirationLength;

      const newClip = await db.clip.create({
        data: {
          code: clipHash,
          url: parsedURL,
          expiresAt:
            expiration === 0 ? undefined : dateAddDays(new Date(), expiration),
          createdAt: new Date(),
          ownerID: await getUserIDFromEmail(session?.user?.email),
          signature,
        },
      });
      res.status(200).json({ status: 'success', result: newClip });
      await storeLinkPreviewInCache(parsedURL);
      await uploadToIPFS(newClip.id);
      return;
    } catch (e) {
      console.error(e);
      res.status(500).json({
        status: 'error',
        result: 'An error with the database has occured.',
      });
    }
  }
}
