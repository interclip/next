import Davatar from '@davatar/react';
import { User } from '@prisma/client';
import { proxied } from '@utils/image';
import Image from 'next/image';
import React from 'react';
import isEthereumAddress from 'validator/lib/isEthereumAddress';

const Avatar = ({ user, size }: { user: User; size: number }) => {
  return isEthereumAddress(user.email) && !user.image ? (
    <Davatar
      size={size - size / 15}
      address={user.email}
      generatedAvatarType="blockies"
    />
  ) : (
    <Image
      src={
        user.image
          ? proxied(user.image, size, size)
          : `https://avatar.tobi.sh/name.svg?text=${user.name?.at(0)}`
      }
      width={size}
      height={size}
      alt={`${user.name || '@' + user.username}'s avatar'`}
      className="h-16 w-16 rounded-full"
    />
  );
};

export default Avatar;
