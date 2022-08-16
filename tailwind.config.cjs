/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{jsx, js}'
  ],
  theme: {
    extend: {
      backgroundColor: {
        'primary': colors.slate[900]
      }
    },
  },
  plugins: [],
}
