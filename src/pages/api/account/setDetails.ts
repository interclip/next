import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

/**
 * Changes user settings
 * @param setProperties an array of key-value pairs of user fields to be updated. Their values need to be strings for now, but maybe in the future we can transfer them via JSON
 * @param req the HTTP request
 */
export const setUserDetails = async (
  setProperties: { [key: string]: string },
  req: NextApiRequest,
) => {
  const session = await getSession({ req });

  if (!session?.user?.email) {
    // eslint-disable-next-line prettier/prettier
    throw new Error('Couldn\'t get email from session');
  }

  const selectObject: any = {};
  for (const key of Object.keys(setProperties)) {
    selectObject[key] = true;
  }

  const selectedDetails = await db.user.update({
    where: {
      email: session.user.email,
    },
    data: {
      ...setProperties,
    },
    select: {
      ...selectObject,
    },
  });

  return selectedDetails;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.query.params) {
    res.status(400).json({
      status: 'error',
      result: 'No fields to change',
    });
    return;
  }

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
    res.json(await setUserDetails(keyValuePairs, req));
  } catch (e) {
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
    console.error(e);
  }
}
