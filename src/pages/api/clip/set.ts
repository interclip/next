import { uploadToIPFS } from '@utils/backupIPFS';
import { storeLinkPreviewInCache } from '@utils/clipPreview';
import { defaultExpirationLength, minimumCodeLength } from '@utils/constants';
import { dateAddDays } from '@utils/dates';
import { getUserIDFromEmail } from '@utils/dbHelpers';
import getCacheToken from '@utils/determineCacheToken';
import { getClipHash } from '@utils/generateID';
import { db } from '@utils/prisma';
import limiter from '@utils/rateLimit';
import { recoverPersonalSignature } from 'eth-sig-util';
import { isAddress } from 'ethers/lib/utils';
import type { NextApiRequest, NextApiResponse } from 'next';
import { Session } from 'next-auth';
import { getSession } from 'next-auth/react';
import { APIResponse } from 'src/typings/interclip';
import isMagnetURI from 'validator/lib/isMagnetURI';
import isURL from 'validator/lib/isURL';

/**
 * This function creates a clip record in the database, uploads a backup of it to IPFS and stores the oembed details in the Redis cache.
 */
async function createClip(
  session: Session | null,
  clipHashRequested: string,
  parsedURL: string,
  signature: string | null,
  res: NextApiResponse<APIResponse>,
  hashLength?: number,
) {
  const userPrefferedExpiration = session?.user?.email
    ? (await db.user.findUnique({ where: { email: session.user.email } }))
        ?.clipExpirationPreference
    : null;
  const expiration = userPrefferedExpiration ?? defaultExpirationLength;

  const newClip = await db.clip.create({
    data: {
      code: clipHashRequested,
      url: parsedURL,
      expiresAt:
        expiration === 0 ? undefined : dateAddDays(new Date(), expiration),
      createdAt: new Date(),
      ownerID: await getUserIDFromEmail(session?.user?.email),
      signature,
      hashLength: hashLength || minimumCodeLength,
    },
  });
  res.unstable_revalidate('/about');
  res.unstable_revalidate(`/clip/${newClip.code.slice(0, newClip.hashLength)}`);
  res.status(200).json({ status: 'success', result: newClip });
  await storeLinkPreviewInCache(parsedURL);
  await uploadToIPFS(newClip.id);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<APIResponse>,
) {
  await limiter.check(res, 30, getCacheToken(req));

  const session = await getSession({ req });

  if (!req.method || !['POST', 'GET'].includes(req.method)) {
    res.status(405).json({
      status: 'error',
      result: 'Method not allowed. Use GET or POST',
    });
    return;
  }

  const {
    url: requestedClipURL,
    sig: signature,
    addr: address,
  } = Object.entries(req.body).length !== 0 ? req.body : req.query;

  if (!requestedClipURL) {
    res.status(400).json({
      status: 'error',
      result: 'No URL provided.',
    });
    return;
  }

  if (typeof requestedClipURL === 'object') {
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

  const clipHashRequested = getClipHash(requestedClipURL);

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
          data: clipHashRequested,
          sig: signature,
        });
        if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
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

  const parsedURL = encodeURI(requestedClipURL);

  if (
    !isURL(parsedURL, {
      require_valid_protocol: true,
      protocols: ['http', 'https', 'ipfs', 'ipns'],
    }) &&
    !isMagnetURI(requestedClipURL)
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
        startsWith: clipHashRequested.slice(0, 5),
      },
    },
    select: {
      hashLength: true,
      code: true,
      createdAt: true,
      ipfsHash: true,
      expiresAt: true,
    },
  });

  const expired = existingClip?.expiresAt
    ? Date.now() - existingClip.expiresAt.getTime() > 0
    : false;

  if (expired) {
    db.clip.delete({ where: { code: existingClip?.code } });
  }

  if (existingClip && existingClip.code === clipHashRequested && !expired) {
    res.status(200).json({
      status: 'success',
      result: existingClip,
    });
  } else if (existingClip && !expired) {
    // Clip with equal starting hash
    let equal = 0;
    // Get number of equal characters between `clipHash` and `existingClip.code`
    for (; equal < clipHashRequested.length - 1; equal++) {
      if (clipHashRequested[equal] !== existingClip.code[equal]) {
        break;
      }
    }

    await createClip(
      session,
      clipHashRequested,
      parsedURL,
      signature,
      res,
      equal + 1,
    );
    return;
  } else {
    try {
      await createClip(session, clipHashRequested, parsedURL, signature, res);
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
