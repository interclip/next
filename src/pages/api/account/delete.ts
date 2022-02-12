// Delete the signed in user's account

import { needsAdmin, needsAuth } from '@utils/api/ensureAuth';
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

  // The user is trying to change the settings of another user
  if (address !== signedInUserAddress) {
    needsAdmin(req, res);
  }

  // Must be a POST request
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await db.user.delete({ where: { email: address } });
  return res.status(204).send(null);
}
