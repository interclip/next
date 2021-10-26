import React from 'react';
import SettingsCard from '../SettingsCard';
import { useTheme } from 'next-themes';
import { Select } from '@components/Input';

const AppearanceSettings = () => {
  const { theme, setTheme } = useTheme();

  const themeOptions = [
    { value: 'light', label: 'Light ☀' },
    { value: 'dark', label: 'Dark 🌑' },
    { value: 'system', label: 'System 💻' },
  ];

  return (
    <>
      <SettingsCard title="Color Scheme" onSave={() => {}}>
        <div className="max-w-[50%]">
          <Select
            onChange={(e) => setTheme(e?.target.value || 'system')}
            defaultValue={theme}
            options={themeOptions}
          />
        </div>
      </SettingsCard>
    </>
  );
};

export default AppearanceSettings;
