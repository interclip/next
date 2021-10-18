import { db } from '@utils/prisma';
import { NextApiRequest } from 'next';
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
