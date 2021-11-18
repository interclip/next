import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

const needsAuth = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session) {
    res.status(401).json({
      status: 'error',
      result: 'Unauthenticated.',
    });
  }
};

// Function for checking admin status
const needsAdmin = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getSession({ req });
  if (!session || !session.user) {
    res.status(401).json({
      status: 'error',
      result: 'Unauthenticated.',
    });
  } else {
    const isAdmin = db.user.findUnique({
      where: {
        email: session.user.email || undefined,
      },
      select: {
        isStaff: true,
      },
    });
    if (!isAdmin) {
      res.status(403).json({
        status: 'error',
        result: 'Forbidden.',
      });
    }
    return true;
  }
};

export { needsAdmin, needsAuth };
