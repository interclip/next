import { Input, Select } from '@components/Input';
import { setSettings } from '@utils/api/setSetting';
import React, { useState } from 'react';

import SettingsCard from '../SettingsCard';

const StorageSettings = () => {
  const uploadOptions = [
    { value: 's3', label: 'Interclip S3' },
    { value: 'ipfs', label: 'IPFS' },
  ];

  const [storageProvider, setStorageProvider] = useState('s3');

  return (
    <>
      <SettingsCard
        title="File Upload"
        description="Select if files should be uploaded to Interclip S3 or IPFS"
        onSave={() => {
          setSettings({ storageProvider });
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
