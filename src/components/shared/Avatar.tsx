import Davatar from '@davatar/react';
import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react';
import isEthereumAddress from 'validator/lib/isEthereumAddress';

const Avatar = ({ user, size }: { user: User; size: number }) => {
  return isEthereumAddress(user.email) ? (
    <Davatar
      size={size - size / 10}
      address={user.email}
      generatedAvatarType="blockies"
    />
  ) : (
    <Image
      src={
        user.image || `https://avatar.tobi.sh/name.svg?text=${user.name?.at(0)}`
      }
      width={size}
      height={size}
      alt={`${user.name || '@' + user.username}'s avatar'`}
      className="w-16 h-16 rounded-full"
    />
  );
};

export default Avatar;
