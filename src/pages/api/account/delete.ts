// Delete the signed in user's account

import { needsAdmin, needsAuth } from '@utils/api/ensureAuth';
import { getUserIDFromEmail } from '@utils/dbHelpers';
import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function deleteAccount(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  needsAuth(req, res);

  if (typeof req.query.address === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many address query params provided. Please only one address per request.',
    });
    return;
  }

  const signedInUserAddress = (await getSession({ req }))?.user?.email!;
  const { address = signedInUserAddress } = req.query;

  // The user is trying to delete another user
  if (address !== signedInUserAddress) {
    needsAdmin(req, res);
  }

  // Must be a POST request
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  // De-associate all clips from the account
  await db.clip.updateMany({
    where: {
      ownerID: await getUserIDFromEmail(address),
    },
    data: {
      ownerID: null,
    },
  });

  await db.user.delete({ where: { email: address } });
  return res.status(204);
}
