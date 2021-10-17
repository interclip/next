import { Layout } from '@components/Layout';
import { Button, Input } from '@nextui-org/react';
import { NextPage } from 'next';
import Image from 'next/image';
import React from 'react';

const Settings: NextPage = () => {
  return (
    <Layout>
      <div className="bg-white text-black max-w-6xl w-full m-auto">
        <div className="flex gap-4 mt-10">
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
          <div className="flex flex-col px-12">
            <div className="font-semibold text-xl">General</div>
            <div>col2</div>
          </div>

          <div className="flex flex-col w-full p-8">
            <SettingsCard
              title="Your Username"
              footerDescription="Please use 48 characters at maximum."
            >
              <div className="max-w-[50%]">
                <Input bordered shadow={false} animated={false} fullWidth />
              </div>
            </SettingsCard>
            <SettingsCard
              title="Your Name"
              description="Please enter your full name, or a display name you are comfortable
              with."
              footerDescription="Please use 32 characters at maximum."
            >
              <div className="max-w-[50%]">
                <Input bordered shadow={false} animated={false} fullWidth />
              </div>
            </SettingsCard>{' '}
            <SettingsCard
              title="Your Email"
              description="Please enter the email address you want to use to log in to Interclip."
              footerDescription="We will email you to verify the change."
            >
              <div className="max-w-[50%]">
                <Input bordered shadow={false} animated={false} fullWidth />
              </div>
            </SettingsCard>
          </div>
        </section>
      </div>
    </Layout>
  );
};

const SettingsCard = ({
  children,
  title,
  description,
  onSave,
  footerDescription,
}: {
  children: any;
  title: string;
  description?: string;
  footerDescription?: string;
  onSave?: any;
}) => {
  return (
    <div className="rounded-xl border border-gray-300 w-full mb-8">
      <h2 className="font-semibold text-2xl p-4">{title}</h2>
      <p className="px-4">{description}</p>
      <div className="p-4">{children}</div>
      <div className="flex space-between p-2 bg-[#FAFBFB] w-full h-14 rounded-b-xl border-t border-gray-300">
        <p className="w-full my-auto px-4">{footerDescription}</p>
        <Button color="primary" auto>
          Save
        </Button>
      </div>
    </div>
  );
};

export default Settings;
