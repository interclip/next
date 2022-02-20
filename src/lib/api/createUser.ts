import { User } from '@prisma/client';
import { proxied } from '@utils/image';
import { db } from '@utils/prisma';
import crypto from 'node:crypto';
import { CreatUsereArgs } from 'src/typings/interclip';

class DBError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DBError';
  }
}

const getFromAvatar = async (email: string): Promise<string | undefined> => {
  const digest = crypto
    .createHash('md5')
    .update(email)
    .digest('hex')
    .toString();
  const url = `https://www.gravatar.com/avatar/${digest}?d=404`;
  const gravatarResponse = await fetch(url);
  return gravatarResponse.ok ? proxied(url, 80, 80) : undefined;
};

export const createUser = async (
  data: CreatUsereArgs,
): Promise<User | never> => {
  if (!data.image) {
    data['image'] = await getFromAvatar(data.email);
  }

  try {
    return await db.user.create({ data });
  } catch (e) {
    throw new DBError(`A database error has occured: ${e}`);
  }
};
