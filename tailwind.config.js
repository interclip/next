module.exports = {
  mode: 'jit',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
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
          text: '#e4e4e4',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
