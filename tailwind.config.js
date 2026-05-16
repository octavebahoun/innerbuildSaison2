/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.html", "./js/**/*.js"],
  theme: {
    extend: {
      colors: {
        rose:          '#C2185B',
        'rose-light':  '#F8BBD0',
        indigo:        '#1A237E',
        'indigo-light':'#5367d7',
        gold:          '#F9A825',
        'green-eco':   '#1B5E20',
        'green-eco-light': '#71e375',
        snow:          '#FAFAFA',
        dark:          '#0D0D0D',
      },
      fontFamily: {
        display:   ['"Cormorant Garamond"', 'serif'],
        body:      ['Outfit', 'sans-serif'],
        signature: ['"Kaushan Script"', 'cursive'],
      },
      fontSize: {
        'hero': 'clamp(3.5rem, 14vw, 9rem)',
      },
    },
  },
  plugins: [],
}
