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
import { setSettings } from '@utils/api/setSetting';
import { useENS } from '@utils/hooks/useENS';
import { NextApiRequest } from 'next';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { getUserDetails } from './api/account/getDetails';

export const handleSettingsErrors = async (data: { [key: string]: string }) => {
  try {
    await setSettings(data);
    toast.success('Setting updated!');
  } catch (e) {
    if (e instanceof APIError) {
      toast.error(e.message);
    } else {
      // @ts-ignore
      toast.error(e);
    }
  }
};

const Settings = (props: { user: User }): JSX.Element => {
  const [settings, setSettings] = useState('General');
  const resolvedEthName = useENS(props.user.email);

  return (
    <Layout>
      <div className="w-full h-full max-w-6xl mx-auto text-black bg-white dark:bg-dark-bg dark:text-dark-text">
        <div className="flex mt-10 ml-8 gap-4">
          <div className="relative w-32 h-32 border-8 border-white rounded-full">
            <Avatar user={props.user} size={120} />
          </div>
          <div className="mt-2">
            <a className="text-lg font-semibold">
              {props.user.name || resolvedEthName.ensName}
            </a>
            <br />@{props.user.username}
          </div>
        </div>
        <section className="flex flex-wrap pt-24 border-t border-gray-300 md:flex-nowrap gap-8 mt-[-4rem]">
          <LeftColumn settings={settings} setSettings={setSettings} />

          <div className="flex flex-col w-full p-8 md:w-[65%]">
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
