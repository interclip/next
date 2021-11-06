import { Layout } from '@components/Layout';
import LeftColumn from '@components/Settings/LeftColumn';
import {
  AppearanceSettings,
  GeneralSettings,
  StorageSettings,
} from '@components/Settings/Tabs';
import Avatar from '@components/shared/Avatar';
import { User } from '@prisma/client';
import { NextApiRequest } from 'next';
import React, { useState } from 'react';

import { getUserDetails } from './api/account/getDetails';

const Settings = (props: { user: User }): JSX.Element => {
  const [settings, setSettings] = useState('General');

  return (
    <Layout>
      <div className="bg-white dark:bg-dark-bg h-full text-black dark:text-dark-text w-full max-w-6xl mx-auto">
        <div className="flex gap-4 mt-10 ml-8 ">
          <div className="relative rounded-full w-32 h-32 border-8 border-white">
            <Avatar user={props.user} size={120} />
          </div>
          <div className="mt-2">
            <a className="font-semibold text-lg">{props.user.name} </a>
            <br />@{props.user.username}
          </div>
        </div>
        <section className="flex flex-wrap md:flex-nowrap gap-8 mt-[-4rem] pt-24 border-t border-gray-300">
          <LeftColumn settings={settings} setSettings={setSettings} />

          <div className="flex flex-col w-full md:w-[65%] p-8">
            {settings === 'General' ? (
              <GeneralSettings
                email={props.user.email}
                name={props.user.name || undefined}
                username={props.user.username}
              />
            ) : settings === 'Appearance' ? (
              <AppearanceSettings />
            ) : (
              <StorageSettings />
            )}
          </div>
        </section>
      </div>
    </Layout>
  );
};

export async function getServerSideProps(context: { req: NextApiRequest }) {
  try {
    const userData = await getUserDetails(
      ['username', 'name', 'image', 'email'],
      context.req,
    );
    return { props: { user: userData } };
  } catch (e) {
    return {
      notFound: true,
    };
  }
}

export default Settings;
