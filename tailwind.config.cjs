/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors')
module.exports = {
  content: [
    './src/**/*.{jsx, js}'
  ],
  theme: {
    extend: {
      colors: {
        currentColor: "currentColor"
      },
      backgroundColor: {
        'primary': colors.slate[900]
      },
      rotate: {
        '270': '270deg'
      }
    },
  },
  plugins: [],
}
