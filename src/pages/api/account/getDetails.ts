import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const getUserDetails = async (fields: string[], req: NextApiRequest) => {
  const session = await getSession({ req });

  const selectObject: any = {};
  fields.forEach((key) => {
    selectObject[key] = true;
  });

  if (!session?.user?.email) {
    throw new Error("Couldn't get email from session");
  }

  const selectedDetails = await db.user.findFirst({
    where: {
      email: session.user.email,
    },
    select: selectObject,
  });
  return selectedDetails;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (typeof req.query.params === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many code query params provided. Please only query one code per request.',
    });
    return;
  }

  const selectedFields = req.query.params.split(',');

  try {
    res.json(await getUserDetails(selectedFields, req));
  } catch (e) {
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
