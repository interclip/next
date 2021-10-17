import React from 'react';
import SettingsCard from '../SettingsCard';
import Select from 'react-select';
import { Input } from '@nextui-org/react';

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
        <Input bordered shadow={false} animated={false} type="number" />
      </SettingsCard>
    </>
  );
};
export default StorageSettings;
