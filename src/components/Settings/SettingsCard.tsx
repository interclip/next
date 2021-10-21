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
    <div className="rounded-xl border border-gray-300 dark:border-gray-700 w-full mb-8">
      <h2 className="font-semibold text-2xl p-4">{title}</h2>
      <p className="px-4">{description}</p>
      <div className="p-4">{children}</div>
      <div className="flex space-between p-2 bg-[#FAFBFB] dark:bg-[#2f2f2f] w-full h-14 rounded-b-xl border-t border-gray-300 dark:border-gray-700">
        <p className="w-full my-auto px-4">{footerDescription}</p>
        <Button color={warning ? 'error' : 'primary'} auto onClick={onSave}>
          {buttonText ?? 'Save'}
        </Button>
      </div>
    </div>
  );
};

export default SettingsCard;
