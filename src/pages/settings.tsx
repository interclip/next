import { Layout } from '@components/Layout';
import LeftColumn from '@components/Settings/LeftColumn';
import {
  AppearanceSettings,
  GeneralSettings,
  StorageSettings,
} from '@components/Settings/Tabs';
import Avatar from '@components/shared/Avatar';
import { User } from '@prisma/client';
import { APIError } from '@utils/api/client/requestClip';
import { setSettings, UserResponse } from '@utils/api/setSetting';
import { useENS } from '@utils/hooks/useENS';
import { NextApiRequest } from 'next';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { getUserDetails } from './api/account/getDetails';

export const handleSettingsErrors = async (
  data: { [key: string]: any },
  user?: string,
): Promise<UserResponse | null> => {
  try {
    const response = await setSettings(data, user);
    toast.success('Setting updated!');
    return response || null;
  } catch (e) {
    if (e instanceof APIError) {
      toast.error(e.message);
    } else {
      // @ts-ignore
      toast.error(e);
    }
    return null;
  }
};

const Settings = (props: { user: User }): JSX.Element => {
  const [settings, setSettings] = useState('General');
  const [user, setUser] = useState<User>(props.user);
  const resolvedEthName = useENS(props.user.email);
  return (
    <Layout>
      <div className="mx-auto h-full w-full max-w-6xl bg-white text-black dark:bg-dark-bg dark:text-dark-text">
        <div className="mt-10 ml-8 flex gap-4">
          <div className="relative h-32 w-32 rounded-full border-8 border-white">
            <Avatar user={user} size={120} />
          </div>
          <div className="mt-2">
            <a className="text-lg font-semibold">
              {user.name || resolvedEthName.ensName}
            </a>
            <br />@{user.username}
          </div>
        </div>
        <section className="mt-[-4rem] flex flex-wrap gap-8 border-t border-gray-300 pt-24 md:flex-nowrap">
          <LeftColumn settings={settings} setSettings={setSettings} />

          <div className="flex w-full flex-col p-8 md:w-[65%]">
            {settings === 'General' ? (
              <GeneralSettings user={user} setUser={setUser} />
            ) : settings === 'Appearance' ? (
              <AppearanceSettings />
            ) : (
              <StorageSettings user={user} setUser={setUser} />
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
      [
        'username',
        'name',
        'image',
        'email',
        'clipSign',
        'storageProvider',
        'clipExpirationPreference',
      ],
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
