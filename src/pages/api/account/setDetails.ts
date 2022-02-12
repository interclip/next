import { Prisma } from '@prisma/client';
import { needsAdmin, needsAuth } from '@utils/api/ensureAuth';
import {
  maxNameAllowedLength,
  maxUsernameAllowedLength,
} from '@utils/constants';
import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import isAscii from 'validator/lib/isAscii';

/**
 * Changes user settings
 * @param setProperties an array of key-value pairs of user fields to be updated. Their values need to be strings for now, but maybe in the future we can transfer them via JSON
 * @param req the HTTP request
 * @param user optionally, one can provide an email identifier to make changes to another user account
 */
export const setUserDetails = async (
  setProperties: { [key: string]: string },
  user: string,
) => {
  const selectObject: any = {};
  for (const key of Object.keys(setProperties)) {
    selectObject[key] = true;
  }

  const selectedDetails = await db.user.update({
    where: {
      email: user,
    },
    data: setProperties,
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

  if (typeof req.query.address === 'object') {
    res.status(400).json({
      status: 'error',
      result:
        'Too many address query params provided. Please only one address per request.',
    });
    return;
  }

  needsAuth(req, res);

  const signedInUserAddress = (await getSession({ req }))?.user?.email!;
  const { address = signedInUserAddress } = req.query;

  // The user is trying to change the settings of another user
  if (address !== signedInUserAddress) {
    needsAdmin(req, res);
  }

  const selectedFields = req.query.params.split(',');
  const keyValuePairs: { [key: string]: string } = {};
  selectedFields.forEach((field) => {
    const [key, value] = field.split(':');
    if (!key) {
      res.status(400).json({
        status: 'error',
        result: 'The request data is malformed',
      });
    }

    if (!value) {
      res.status(400).json({
        status: 'error',
        result: `${key} cannot be empty`,
      });
    } else {
      // Input validation
      switch (key) {
        case 'username': {
          if (!isAscii(value)) {
            res.status(400).json({
              status: 'error',
              result: 'A username must only have ASCII characters in it',
            });
          } else if (value.includes(' ')) {
            res.status(400).json({
              status: 'error',
              result: 'A username cannot include spaces',
            });
          } else if (value.length > maxUsernameAllowedLength) {
            res.status(400).json({
              status: 'error',
              result: `Your user name cannot be longer than ${maxNameAllowedLength} characters`,
            });
          }
          break;
        }
        case 'name': {
          if (value.length > maxNameAllowedLength) {
            res.status(400).json({
              status: 'error',
              result: `Your display name cannot be longer than ${maxNameAllowedLength} characters`,
            });
          }
          break;
        }
      }
    }

    keyValuePairs[key] = value;
  });

  try {
    res.json(await setUserDetails(keyValuePairs, address));
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      switch (e.code) {
        case 'P2002': {
          res.status(400).json({
            status: 'error',
            result: 'Username already taken',
          });
          break;
        }
        case 'P2005': {
          res.status(400).json({
            status: 'error',
            result: e.message,
          });
          break;
        }
      }
    }
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
    console.error(e);
  }
}
