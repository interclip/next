const { nextui } = require('@nextui-org/react');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        light: {
          bg: '#157EFB',
          text: '#ffffff',
        },
        dark: {
          bg: '#151515',
          secondary: '#262626',
          text: '#e4e4e4',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [nextui()],
};
