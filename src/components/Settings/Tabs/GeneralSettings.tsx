import { Input } from '@components/Input';
import React from 'react';

import SettingsCard from '../SettingsCard';

const GeneralSettings = ({
  username,
  name,
  email,
}: {
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
          <Input defaultValue={username} maxLength={48} />
        </div>
      </SettingsCard>
      <SettingsCard
        title="Your Name"
        description="Please enter your full name, or a display name you are comfortable
              with."
        footerDescription="Please use 32 characters at maximum."
      >
        <div className="max-w-[50%]">
          <Input defaultValue={name} maxLength={32} />
        </div>
      </SettingsCard>{' '}
      <SettingsCard
        title="Your Email"
        description="Your email address cannot be changed."
      >
        <div className="max-w-[50%]">
          <Input disabled value={email} />
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
