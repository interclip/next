import { Prisma } from '@prisma/client';
import { needsAdmin, needsAuth } from '@utils/api/ensureAuth';
import {
  maxExpirationLength,
  maxNameAllowedLength,
  maxUsernameAllowedLength,
} from '@utils/constants';
import { db } from '@utils/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import isAscii from 'validator/lib/isAscii';

/**
 * Changes user settings
 * @param setProperties an object consisting of key-value pairs of user fields to be updated. Their values need to be strings for now, but maybe in the future we can transfer them via JSON
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

  const session = await needsAuth(req, res);

  if (!session) {
    return;
  }

  const signedInUserAddress = session.user?.email!;
  const { address = signedInUserAddress, params } = req.query;

  // The user is trying to change the settings of another user
  if (address !== signedInUserAddress) {
    needsAdmin(req, res);
  }

  const keyValuePairs: { [key: string]: any } = JSON.parse(params);
  Object.keys(keyValuePairs).forEach((key) => {
    const value = keyValuePairs[key];
    if (!key) {
      res.status(400).json({
        status: 'error',
        result: 'The request data is malformed',
      });
    }

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
        } else if (value.length === 0) {
          res.status(400).json({
            status: 'error',
            result: 'Although it would be cool, your user name cannot be empty',
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
        } else if (value.length === 0) {
          res.status(400).json({
            status: 'error',
            result:
              'Although it would be cool, your display name cannot be empty',
          });
        }

        break;
      }
      case 'clipExpirationPreference': {
        if (value % 1 !== 0) {
          res.status(400).json({
            status: 'error',
            result: 'Must be a whole number',
          });
        } else if (value > maxExpirationLength) {
          res.status(400).json({
            status: 'error',
            result: `The maximum expiration length is ${maxExpirationLength.toLocaleString()}`,
          });
        } else if (value < 0) {
          res.status(400).json({
            status: 'error',
            result: "Expiration can't be a negative number",
          });
        }
        break;
      }
      case 'storageProvider': {
        if (!['IPFS', 'S3'].includes(value)) {
          res.status(400).json({
            status: 'error',
            result: 'Invalid storage provider provided... that was a mouthful.',
          });
        }
        break;
      }
      case 'id':
      case 'isStaff': {
        needsAdmin(req, res);
        break;
      }
    }

    keyValuePairs[key] = value;
  });

  try {
    res.json(await setUserDetails(keyValuePairs, address));
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      switch (error.code) {
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
            result: error.message,
          });
          break;
        }
      }
    }
    res.status(500).json({
      status: 'error',
      result: 'An error with the database has occured.',
    });
    console.error(error);
  }
}
