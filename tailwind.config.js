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
        brand: {
          gitlab: '#fca326',
          discord: '#7289da',
          google: '#4285f4',
          github: '#4078c0',
          apple: '#000000',
        },
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
