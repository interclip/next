import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

const Avatar = ({ user, size }: { user: User; size: number }) => {
  return (
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
