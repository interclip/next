import { classNames } from '@components/Navbar/Navbar';
import { H1, H2 } from '@components/Text/headings';
import Link from '@components/Text/link';
import { Tab } from '@headlessui/react';
import { User } from '@prisma/client';
import { db } from '@utils/prisma';
import { NextApiRequest } from 'next';
import React, { useState } from 'react';

import { Layout } from '../components/Layout';
import { getUserDetails } from './api/account/getDetails';

interface UserResponce extends APIResponse {
  result: User[];
}

const fetchUsers = async (): Promise<User[]> => {
  const response = await fetch('/api/admin/getUsers');
  if (!response.ok) {
    throw new Error('Not ok');
  }
  const data: UserResponce = await response.json();
  return data.result;
};

const TabHeader = ({ title }: { title: string }) => {
  return (
    <Tab
      className={({ selected }) =>
        classNames(
          'w-full py-2.5 text-sm leading-5 font-medium text-blue-700 rounded-lg',
          'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
          selected
            ? 'bg-white shadow'
            : 'text-blue-100 hover:bg-white/[0.12] hover:text-white',
        )
      }
    >
      {title}
    </Tab>
  );
};

const UserCard = ({ user }: { user: User }) => {
  return (
    <div className="bg-white w-full flex items-center p-2 rounded-xl shadow border">
      <div className="flex items-center space-x-4">
        <img
          src={
            user.image ||
            `https://avatar.tobi.sh/name.svg?text=${user.name?.at(0)}`
          }
          alt={`${user.name || '@' + user.username}'s avatar'`}
          className="w-16 h-16 rounded-full"
        />
      </div>
      <div className="flex-grow p-3">
        <div className="font-semibold text-gray-700">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
      <span className="p-2">{user.isStaff && 'Staff'}</span>
    </div>
  );
};

const About = ({
  clipCount,
  version,
  user,
}: {
  clipCount: number;
  version: string;
  allUsers: any[];
  user: {
    name: string;
    username: string;
    isStaff: boolean;
  };
}): JSX.Element => {
  const panelClassNames = classNames(
    'bg-white rounded-xl p-3',
    'focus:outline-none focus:ring-2 text-black ring-offset-2 ring-offset-blue-400 ring-white ring-opacity-60',
  );

  const [users, setUsers] = useState<User[]>([]);

  return (
    <Layout titlePrefix="About">
      <section className="w-full flex flex-col items-center">
        <div className="w-[30em] max-w-[93vw]">
          <H1>Interclip Admin</H1>
          <H2>Hi {user.name || user.username} </H2>

          <div className="w-full max-w-md px-2 py-16 sm:px-0">
            <Tab.Group
              defaultIndex={0}
              onChange={(index) => {
                switch (index) {
                  case 2:
                    fetchUsers().then((users) => setUsers(users));
                    break;
                  default:
                }
              }}
            >
              <Tab.List className="flex p-1 space-x-1 bg-blue-900/20 rounded-xl">
                <TabHeader title="Statistics"></TabHeader>
                <TabHeader title="Controls"></TabHeader>
                <TabHeader title="Users"></TabHeader>
                <TabHeader title="Clips"></TabHeader>
              </Tab.List>
              <Tab.Panels className="mt-2">
                <Tab.Panel className={panelClassNames}>hello, gaming</Tab.Panel>
                <Tab.Panel className={panelClassNames}>Hello, facts</Tab.Panel>
                <Tab.Panel className={panelClassNames}>
                  {users.map((user) => (
                    <UserCard key={user.id} user={user} />
                  ))}
                </Tab.Panel>
              </Tab.Panels>
            </Tab.Group>
          </div>
          <ul className="facts">
            <li>
              Release: {version}{' '}
              <Link
                href={`https://github.com/interclip/interclip/releases/tag/v${version}`}
              >
                (changelog)
              </Link>
            </li>
            <li>Total clips made: {clipCount}</li>
          </ul>
        </div>
      </section>
    </Layout>
  );
};

export async function getServerSideProps(context: { req: NextApiRequest }) {
  try {
    // @ts-ignore
    const userData: {isStaff: boolean, name: string, username: string} | null = await getUserDetails(['isStaff', 'name'], context.req);
    const clipCount = await db.clip.count();
    const packageJSON = require('../../package.json');
    const { version } = packageJSON;

    // Return 404 if user is not an admin
    if (!userData || !userData.isStaff) {
      return { notFound: true} ;
    }

    return { props: { clipCount, version, user: userData } };
  } catch (e) {
    console.error(e);
    return {
      notFound: true,
    };
  }
}

export default About;
