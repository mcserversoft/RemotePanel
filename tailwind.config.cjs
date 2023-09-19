/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'mcss-green': '#7ca740',
        'mcss-gray': '#212529',
        'gray-150': '#ECEEF1'
      },
      backgroundImage: {
        'login-background': "url('/bg.jpg')",
        'hero-pattern': "url('/bg.jpg')",
      }
    },
    fontFamily: {
      'consolas': ['"Consolas"']
    },
  },
  plugins: [
    require('postcss-nested'),
    require('flowbite/plugin')
  ],
}
