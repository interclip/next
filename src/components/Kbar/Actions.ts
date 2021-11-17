const actions = ({ setTheme }: { setTheme: (theme: string) => void }) => [
  // CREATE CLIP REDIRECT
  {
    id: 'create',
    name: 'Create clip',
    shortcut: ['c'],
    keywords: 'create clip',
    section: 'Clip',
    perform: () => window.location.replace('/'),
  },
  // RECEIVE CLIP REDIRECT
  {
    id: 'receive',
    name: 'Receive clip',
    shortcut: ['r'],
    keywords: 'receive clip',
    section: 'Clip',
    perform: () => window.location.replace('/receive'),
  },
  // SETTINGS
  {
    id: 'settings',
    name: 'Settings',
    shortcut: ['s'],
    keywords: 'settings',
    section: 'Settings',
    perform: () => window.location.replace('/settings'),
  },
  // THEME MENU
  {
    id: 'theme',
    name: 'Change theme',
    shortcut: ['t'],
    keywords: 'interface color dark light',
    section: 'Settings',
  },
  // THEME OPTIONS
  {
    id: 'darkTheme',
    name: 'Dark',
    keywords: 'dark theme',
    shortcut: ['d'],
    section: '',
    perform: () => setTheme('dark'),
    parent: 'theme',
  },
  {
    id: 'lightTheme',
    name: 'Light',
    keywords: 'light theme',
    shortcut: ['l'],
    section: '',
    perform: () => setTheme('light'),
    parent: 'theme',
  },
  {
    id: 'systemTheme',
    name: 'System',
    keywords: 'system theme',
    section: '',
    perform: () => setTheme('system'),
    parent: 'theme',
  },
];

export default actions;
