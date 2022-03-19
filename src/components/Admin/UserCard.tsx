import Avatar from '@components/shared/Avatar';
import { User } from '@prisma/client';
import React, { useState } from 'react';

import SettingsMenu from './UserOptions';

const UserCard = ({ user: serverProvidedUser }: { user: User }) => {
  const [user, setUser] = useState<User | null>(serverProvidedUser);

  return (
    user && (
      <div className="my-4 flex w-full items-center rounded-xl border bg-white p-2 shadow dark:border-none dark:bg-dark-secondary dark:text-dark-text">
        <div className="flex items-center space-x-4">
          <Avatar size={60} user={user} />
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

        <SettingsMenu setUser={setUser} user={user} />
      </div>
    )
  );
};

export default UserCard;
