import { Select } from '@components/Input';
import { useTheme } from 'next-themes';
import React from 'react';

import SettingsCard from '../SettingsCard';

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light ☀' },
    { value: 'dark', label: 'Dark 🌑' },
    { value: 'system', label: 'System 💻' },
  ];

  return (
    <>
      <SettingsCard title="Color Scheme">
        <div className="max-w-[50%]">
          <Select
            defaultValue={theme}
            onChange={(e) => {
              setTheme(e?.target.value || 'system');
            }}
            options={themeOptions}
          />
        </div>
      </SettingsCard>
    </>
  );
};

export default AppearanceSettings;
