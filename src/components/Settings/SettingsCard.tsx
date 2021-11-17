import { Button } from '@nextui-org/react';
import React from 'react';

const SettingsCard = ({
  children,
  title,
  description,
  onSave,
  footerDescription,
  warning,
  buttonText,
}: {
  children: JSX.Element | string;
  title: string;
  description?: string;
  footerDescription?: string;
  onSave?: () => any;
  warning?: boolean;
  buttonText?: string;
}) => {
  return (
    <div className="w-full mb-8 border border-gray-300 rounded-xl dark:border-gray-700">
      <h2 className="p-4 text-2xl font-semibold">{title}</h2>
      <p className="px-4">{description}</p>
      <div className="p-4">{children}</div>
      <div className="flex w-full p-2 border-t border-gray-300 space-between bg-[#FAFBFB] dark:bg-[#2f2f2f] h-14 rounded-b-xl dark:border-gray-700">
        <p className="w-full px-4 my-auto">{footerDescription}</p>
        <Button color={warning ? 'error' : 'primary'} auto onClick={onSave}>
          {buttonText ?? 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsCard;
