import { Input } from '@nextui-org/react';
import React from 'react';
import SettingsCard from '../SettingsCard';

const GeneralSettings = (props: {
  username?: string;
  name?: string;
  email?: string;
}) => {
  return (
    <>
      <SettingsCard
        title="Your Username"
        footerDescription="Please use 48 characters at maximum."
      >
        <div className="max-w-[50%]">
          <Input
            bordered
            shadow={false}
            animated={false}
            defaultValue={props.username}
            fullWidth
          />
        </div>
      </SettingsCard>
      <SettingsCard
        title="Your Name"
        description="Please enter your full name, or a display name you are comfortable
              with."
        footerDescription="Please use 32 characters at maximum."
      >
        <div className="max-w-[50%]">
          <Input
            bordered
            shadow={false}
            animated={false}
            defaultValue={props.name}
            fullWidth
          />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        title="Your Email"
        description="Please enter the email address you want to use to log in to Interclip."
        footerDescription="We will email you to verify the change."
      >
        <div className="max-w-[50%]">
          <Input
            bordered
            shadow={false}
            animated={false}
            defaultValue={props.email}
            fullWidth
          />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        title="Delete Personal Account"
        warning
        buttonText="Delete Personal Account"
      >
        Permanently remove your account and all of its contents from Interclip.
        This action is not reversible, so please continue with caution.
      </SettingsCard>
    </>
  );
};

export default GeneralSettings;
