import React from 'react';
import SettingsCard from '../SettingsCard';
import { Input, Select } from '@components/Input';

const StorageSettings = () => {
  const uploadOptions = [
    { value: 'Interclip S3', label: 'Interclip S3' },
    { value: 'IPFS', label: 'IPFS' },
  ];

  return (
    <>
      <SettingsCard
        title="File Upload"
        description="Select if files should be uploaded to Interclip S3 or IPFS"
      >
        <div className="max-w-[50%]">
          <Select options={uploadOptions} />
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
