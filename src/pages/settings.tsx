import { Layout } from '@components/Layout';
import {
  AppearanceSettings,
  GeneralSettings,
  StorageSettings,
} from '@components/Settings/Tabs';
import LeftColumn from '@components/Settings/LeftColumn';
import { NextApiRequest } from 'next';
import Image from 'next/image';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { getUserDetails } from './api/account/getDetails';

const Settings = (props: {
  user: {
    image: string;
    id: string;
    email: string;
    name: string;
    username: string;
  };
}): JSX.Element => {
  const [settings, setSettings] = useState('General');
  const { data: session } = useSession();

  return (
    <Layout>
      <div className="bg-white dark:bg-dark-bg h-full text-black dark:text-dark-text w-full max-w-6xl m-auto">
        <div className="flex gap-4 mt-10 ml-8 ">
          <div className="relative rounded-full w-32 h-32 border-8 border-white">
            <Image
              src={
                props.user.image ||
                `https://avatar.tobi.sh/name.svg?text=${session?.user?.name}'`
              }
              layout="fill"
              objectFit="contain"
              objectPosition="center"
              className="rounded-full"
              alt="Profile picture"
            />
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
                name={props.user.name}
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
