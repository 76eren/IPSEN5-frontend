/** @type {import('tailwindcss').Config} */

const plugin = require('tailwindcss/plugin')

module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      boxShadow: {
        'custom-inset': 'inset 0px -2px 0px 1px #5236AA',
      },
      colors: {
        "primary-dark-purple": "#5236AA",
        "primary-red": "#E21938",
        "secondary-purple-light": "#ECE9F6",
        "secondary-dark-pink": "#A92565",
        "secondary-purple": "#802D85",
      }
    },
  },
  plugins: [
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.scrollbar-hide': {
          /* IE and Edge */
          '-ms-overflow-style': 'none',

          /* Firefox */
          'scrollbar-width': 'none',

          /* Safari and Chrome */
          '&::-webkit-scrollbar': {
            display: 'none'
          }
        }
      }
      )
    }),
    require('tailwindcss-animated')
  ],
}

