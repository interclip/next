import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

export const setUserDetails = async (fields: string[], req: NextApiRequest) => {
  const session = await getSession({ req });

  const setProperties: { [key: string]: boolean } = {};
  fields.forEach((key) => {
    setProperties[key] = true;
  });

  if (!session?.user?.email) {
    // eslint-disable-next-line prettier/prettier
    throw new Error('Couldn\'t get email from session');
  }

  const selectedDetails = await db.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      ...setProperties,
    },
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
  const keyValuePairs: { [key: string]: string } = {};
  selectedFields.forEach((field) => {
    const [key, value] = field.split(':');
    keyValuePairs[key] = value;
  });

  try {
    res.json(await setUserDetails(selectedFields, req));
  } catch (e) {
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
  }
}
