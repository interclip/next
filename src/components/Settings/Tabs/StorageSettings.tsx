import { Input, Select } from '@components/Input';
import React, { useState } from 'react';
import { handleSettingsErrors } from 'src/pages/settings';

import SettingsCard from '../SettingsCard';

const StorageSettings = () => {
  const uploadOptions = [
    { value: 'S3', label: 'Interclip S3' },
    { value: 'IPFS', label: 'IPFS' },
  ];

  const [storageProvider, setStorageProvider] = useState('s3');

  return (
    <>
      <SettingsCard
        title="File Upload"
        description="Select if files should be uploaded to Interclip S3 or IPFS"
        onSave={async () => {
          await handleSettingsErrors({ storageProvider });
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
        description="Select time after which will clips be deleted"
      >
        <div className="max-w-[200px]">
          <Input type="number" />
        </div>
      </SettingsCard>
    </>
  );
};
export default StorageSettings;
