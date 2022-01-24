import { Button } from '@nextui-org/react';
import React, { useState } from 'react';

const SettingsCard = ({
  children,
  title,
  description,
  onSave,
  footerDescription,
  buttonText,
  dangerous,
  isDisabled: isDisabled,
}: {
  children: JSX.Element | string;
  title: string;
  description?: string;
  footerDescription?: string;
  onSave?: () => Promise<any>;
  warning?: boolean;
  buttonText?: string;
  dangerous?: boolean;
  isDisabled?: boolean;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="mb-8 w-full rounded-xl border border-gray-300 dark:border-gray-700">
      <h2 className="p-4 text-2xl font-semibold">{title}</h2>
      <p className="px-4">{description}</p>
      <div className="p-4">{children}</div>
      <div className="space-between flex h-14 w-full rounded-b-xl border-t border-gray-300 bg-[#FAFBFB] p-2 dark:border-gray-700 dark:bg-[#2f2f2f]">
        <p className="my-auto w-full px-4">{footerDescription}</p>
        {onSave && (
          <Button
            disabled={isDisabled || isLoading}
            color={dangerous ? 'error' : 'primary'}
            auto
            onClick={async () => {
              setIsLoading(true);
              if (onSave) {
                await onSave();
              }
              setIsLoading(false);
            }}
          >
            {buttonText ?? 'Save'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default SettingsCard;
