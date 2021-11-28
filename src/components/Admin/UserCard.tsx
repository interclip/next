import Avatar from '@components/shared/Avatar';
import { User } from '@prisma/client';
import React from 'react';

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="flex items-center w-full p-2 my-4 bg-white border shadow dark:bg-dark-secondary dark:text-dark-text rounded-xl dark:border-none">
      <div className="flex items-center space-x-4">
        <Avatar user={user} size={60} />
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
