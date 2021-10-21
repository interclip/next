import React from 'react';
import SettingsCard from '../SettingsCard';
import Select from 'react-select';
import { Input } from '@components/Input';

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
        <Select options={uploadOptions} />
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
