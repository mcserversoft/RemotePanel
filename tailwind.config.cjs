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
        'mcss-dark-green': '#59772e',
        'mcss-gray': '#212529',
        'custom-gray': '#202124',
        'custom-gray-lighter': '#202124',
        'custom-gray-lightest': '#353639',
        'custom-mcss-green': '#7ca740',
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
