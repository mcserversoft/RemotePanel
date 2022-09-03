/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}', './node_modules/tw-elements/dist/js/**/*.js'],
  theme: {
    extend: {
      colors: {
        'mcss-green': '#7ca740',
        'mcss-dark-green': '#59772e',
        'mcss-gray': '#212529',
      },
      backgroundImage: {
        'login-background': "url('/bg.jpg')",
        'hero-pattern': "url('/bg.jpg')",
      }
    }
  },
  plugins: [require('tw-elements/dist/plugin')],
}
