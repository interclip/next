import DavatarOriginal from '@davatar/react';
import { User } from '@prisma/client';
import { proxied } from '@utils/image';
import Image from 'next/image';
import React from 'react';
import isEthereumAddress from 'validator/lib/isEthereumAddress';

// Cast needed: @davatar/react types not updated for React 19
const Davatar = DavatarOriginal as unknown as React.FC<{
  address: string;
  generatedAvatarType: string;
  size: number;
}>;

const Avatar = ({ user, size }: { user: User; size: number }) => {
  return isEthereumAddress(user.email) && !user.image ? (
    <Davatar
      address={user.email}
      generatedAvatarType="blockies"
      size={size - size / 15}
    />
  ) : (
    <Image
      alt={`${user.name || '@' + user.username}'s avatar'`}
      className="h-16 w-16 rounded-full"
      height={size}
      src={
        user.image
          ? proxied(user.image, size, size)
          : `https://avatar.tobi.sh/name.svg?text=${user.name?.at(0)}`
      }
      width={size}
    />
  );
};

export default Avatar;
