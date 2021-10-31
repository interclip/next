// Delete the signed in user's account

import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export default async function deleteAccount(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // Ensure the user is logged in
  const session = await getSession({ req });

  if (!session?.user?.email) {
    res
      .status(401)
      .json({ message: 'You must be logged in to delete your account' });
    return;
  }

  // Must be a POST request
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  await db.user.delete({ where: { email: session.user.email } });
  return res.status(204);
}
