import { Input, Select } from '@components/Input';
import { User } from '@prisma/client';
import { maxExpirationLength } from '@utils/constants';
import React, { useState } from 'react';
import { handleSettingsErrors } from 'src/pages/settings';

import SettingsCard from '../SettingsCard';

const StorageSettings = ({
  user,
  setUser,
}: {
  user: User;
  setUser: React.Dispatch<React.SetStateAction<User>>;
}) => {
  const uploadOptions = [
    { value: 'S3', label: 'Interclip S3' },
    { value: 'IPFS', label: 'IPFS' },
  ];

  const [storageProvider, setStorageProvider] = useState(user.storageProvider);
  const [expiration, setExpiration] = useState<number>(
    user.clipExpirationPreference,
  );

  return (
    <>
      <SettingsCard
        title="File Upload"
        description="Select if files should be uploaded to Interclip S3 or IPFS"
        onSave={async () => {
          const updatedDetails = await handleSettingsErrors({
            storageProvider,
          });
          if (updatedDetails) {
            setUser({
              ...user,
              ...updatedDetails,
            });
          }
        }}
      >
        <div className="max-w-[50%]">
          <Select
            options={uploadOptions}
            onChange={(e) => {
              setStorageProvider(e.target.value);
            }}
          />
        </div>
      </SettingsCard>
      <SettingsCard
        title="Clip Expiration"
        description="Select time after which will clips be deleted. Set to 0 to disable clip expiration"
        isDisabled={expiration === user.clipExpirationPreference}
        onSave={async () => {
          const updatedDetails = await handleSettingsErrors({
            clipExpirationPreference: expiration,
          });
          if (updatedDetails) {
            setUser({
              ...user,
              ...updatedDetails,
            });
          }
        }}
      >
        <div className="max-w-[200px]">
          <Input
            onChange={(e) => setExpiration(parseInt(e.target.value))}
            value={expiration}
            type="number"
            max={maxExpirationLength}
            min={0}
            step={1}
          />
        </div>
      </SettingsCard>
    </>
  );
};
export default StorageSettings;
