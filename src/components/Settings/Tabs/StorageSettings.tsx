import { Input, Select } from '@components/Input';
import { User } from '@prisma/client';
import { maxExpirationLength, StorageProvider } from '@utils/constants';
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
    { value: StorageProvider.S3, label: 'Interclip S3' },
    { value: StorageProvider.IPFS, label: 'IPFS' },
  ];

  const [storageProvider, setStorageProvider] = useState(user.storageProvider);
  const [expiration, setExpiration] = useState<number>(
    user.clipExpirationPreference,
  );

  return (
    <>
      <SettingsCard
        description="Select if files should be uploaded to Interclip S3 or IPFS"
        isDisabled={user.storageProvider === storageProvider}
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
        title="File Upload"
      >
        <div className="max-w-[50%]">
          <Select
            defaultValue={storageProvider}
            onChange={(e) => {
              setStorageProvider(e.target.value);
            }}
            options={uploadOptions}
          />
        </div>
      </SettingsCard>
      <SettingsCard
        buttonText={expiration === 0 ? 'Disable' : 'Save'}
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
        title="Clip Expiration"
      >
        <div className="max-w-[200px]">
          <Input
            max={maxExpirationLength}
            min={0}
            onChange={(e) => setExpiration(parseInt(e.target.value))}
            step={1}
            type="number"
            value={expiration}
          />
        </div>
      </SettingsCard>
    </>
  );
};
export default StorageSettings;
