/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './page/**/*.{js,ts,jsx,tsx}',
    './ui/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        currentColor: 'currentColor',
      },
      backgroundColor: ({theme}) => ({
        primary: theme('colors.slate.900'),
      }),
      rotate: {
        270: '270deg',
      },
    },
  },
};
