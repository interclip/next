import React, { useEffect } from 'react';
import SettingsCard from '../SettingsCard';
import useLocalStorage from 'react-use-localstorage';
import Select from 'react-select';

const useSSRLocalStorage = (
  key: string,
  initial: string,
): [string, React.Dispatch<string>] => {
  return typeof window === 'undefined'
    ? [initial, () => undefined]
    : useLocalStorage(key, initial);
};

const AppearanceSettings = () => {
  const [theme, setTheme] = useSSRLocalStorage('theme', 'system');

  useEffect(() => {
    setTheme(localStorage.getItem('theme') ?? 'system');
  }, []);

  const themeOptions = [
    { value: 'light', label: 'Light ☀' },
    { value: 'dark', label: 'Dark 🌑' },
    { value: 'system', label: 'System 💻' },
  ];

  return (
    <>
      <SettingsCard
        title="Color Scheme"
        onSave={() => {
          setTheme(theme);
        }}
      >
        <Select
          options={themeOptions}
          onChange={(e) => setTheme(e?.value || 'system')}
        />
      </SettingsCard>
    </>
  );
};

export default AppearanceSettings;
