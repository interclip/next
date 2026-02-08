import { Menu, Transition } from '@headlessui/react';
import {
  PencilIcon as PencilIconOutline,
  TrashIcon as TrashIconOutline,
  UserIcon as UserIconOutline,
} from '@heroicons/react/24/outline';
import {
  ChevronDownIcon,
  PencilIcon,
  TrashIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import { User } from '@prisma/client';
import { deleteAccount } from '@utils/api/client/deleteUser';
import React, { Fragment } from 'react';
import toast from 'react-hot-toast';
import { handleSettingsErrors } from 'src/pages/settings';

export default function SettingsMenu({
  user,
  setUser,
}: {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}) {
  return (
    <div className="top-16 w-56 text-right">
      <Menu as="div" className="relative inline-block text-left">
        <div>
          <Menu.Button className="inline-flex w-full justify-center rounded-md bg-black px-4 py-2 text-sm font-medium text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
            Options
            <ChevronDownIcon
              aria-hidden="true"
              className="ml-2 -mr-1 h-5 w-5 text-violet-200 hover:text-violet-100"
            />
          </Menu.Button>
        </div>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-50 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="px-1 py-1 ">
              <Menu.Item disabled>
                {({ active, disabled }) => (
                  <button
                    className={`${
                      active ? 'bg-light-bg text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm ${
                      disabled ? 'cursor-not-allowed' : ''
                    }`}
                  >
                    {active ? (
                      <PencilIcon
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-light-text"
                      />
                    ) : (
                      <PencilIconOutline
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-light-bg"
                      />
                    )}
                    Edit
                  </button>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-light-bg text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={async () => {
                      await handleSettingsErrors(
                        { isStaff: !user.isStaff },
                        user.email,
                      );
                      setUser({
                        ...user,
                        isStaff: !user.isStaff,
                      });
                    }}
                  >
                    {active ? (
                      <UserIcon
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-white"
                      />
                    ) : (
                      <UserIconOutline
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-light-bg"
                      />
                    )}
                    {user.isStaff ? 'Remove admin' : 'Make admin'}
                  </button>
                )}
              </Menu.Item>
            </div>
            <div className="px-1 py-1">
              <Menu.Item>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-light-bg text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={async () => {
                      await toast.promise(deleteAccount(user.email), {
                        loading: `Deleting ${user.name || user.username}`,
                        success: `Deleted ${user.name || user.username}`,
                        error: `Deleted ${user.name || user.username}`,
                      });
                      setUser(null);
                    }}
                  >
                    {active ? (
                      <TrashIcon
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-white"
                      />
                    ) : (
                      <TrashIconOutline
                        aria-hidden="true"
                        className="mr-2 h-5 w-5 text-light-bg"
                      />
                    )}
                    Delete
                  </button>
                )}
              </Menu.Item>
            </div>
          </Menu.Items>
        </Transition>
      </Menu>
    </div>
  );
}
