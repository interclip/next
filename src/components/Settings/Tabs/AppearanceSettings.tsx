import React from 'react';
import SettingsCard from '../SettingsCard';
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
        <div className="max-w-[50%]">
          <select
            className="border-2 border-[#EAEAEA] rounded-xl px-2.5 py-1.5 text-[#333333] bg-white dark:text-dark-text dark:bg-dark-secondary w-full"
            onChange={(e) => setTheme(e?.target.value || 'system')}
            defaultValue={theme}
          >
            {themeOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </SettingsCard>
    </>
  );
};

export default AppearanceSettings;
