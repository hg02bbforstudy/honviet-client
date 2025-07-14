/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        honvietRed: '#8b322f',
        honvietGold: '#eea741',
      },
      
    },
  },
  plugins: [
      require('tailwind-scrollbar-hide'),
  ],
};
