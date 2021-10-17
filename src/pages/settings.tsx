import { Layout } from '@components/Layout';
import {
  AppearanceSettings,
  GeneralSettings,
  StorageSettings,
} from '@components/Settings/Tabs';
import LeftColumn from '@components/Settings/LeftColumn';
import { NextPage } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';

const Settings: NextPage = () => {
  const [settings, setSettigns] = useState('General');

  return (
    <Layout>
      <div className="bg-white text-black max-w-6xl w-full m-auto">
        <div className="flex gap-4 mt-10 ml-8">
          <div className="relative rounded-full w-32 h-32 border-8 border-white">
            <Image
              src="https://avatar.tobi.sh/username"
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-full"
              alt="Profile picture"
            />
          </div>
          <div className="mt-2">
            <a className="font-semibold text-lg">First name & Last name </a>
            <br />
            @username
          </div>
        </div>
        <section className="flex gap-8 mt-[-4rem] pt-24 border-t border-gray-300">
          <LeftColumn settings={settings} setSettings={setSettigns} />

          <div className="flex flex-col w-full p-8">
            {settings === 'General' ? (
              <GeneralSettings />
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

export default Settings;
