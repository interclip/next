import React from 'react';
import SettingsCard from '../SettingsCard';
import Select from 'react-select';
import { useTheme } from 'next-themes';

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
        <Select
          options={themeOptions}
          onChange={(e) => setTheme(e?.value || 'system')}
        />
      </SettingsCard>
    </>
  );
};

export default AppearanceSettings;
