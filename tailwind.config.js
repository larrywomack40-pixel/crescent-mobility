/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0B1A2F',
          light: '#12263F',
          dark: '#060F1C'
        },
        gold: {
          DEFAULT: '#E0B04A',
          light: '#F0C86B',
          dark: '#B88A2E'
        },
        cream: '#F7F3EA'
      },
      fontFamily: {
        display: ['Oswald', 'Arial Narrow', 'sans-serif'],
        body: ['Inter', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};
