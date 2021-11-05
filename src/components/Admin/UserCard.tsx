import { User } from '@prisma/client';
import Image from 'next/image';
import React from 'react';

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="bg-white dark:bg-dark-secondary dark:text-dark-text w-full flex items-center p-2 rounded-xl shadow border dark:border-none my-4">
      <div className="flex items-center space-x-4">
        <Image
          src={
            user.image ||
            `https://avatar.tobi.sh/name.svg?text=${user.name?.at(0)}`
          }
          width={60}
          height={60}
          alt={`${user.name || '@' + user.username}'s avatar'`}
          className="w-16 h-16 rounded-full"
        />
      </div>
      <div className="flex-grow p-3">
        <div className="font-semibold text-gray-700 dark:text-dark-text">
          {user.name}
        </div>
        <div className="text-sm text-gray-500 dark:text-gray-200">
          {user.email}
        </div>
      </div>
      <span className="p-2">{user.isStaff && 'Staff'}</span>
    </div>
  );
};

export default UserCard;
