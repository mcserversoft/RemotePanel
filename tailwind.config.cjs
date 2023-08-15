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
        'mcss-gray': '#212529'
      },
      backgroundImage: {
        'login-background': "url('/bg.jpg')",
        'hero-pattern': "url('/bg.jpg')",
      }
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
}
