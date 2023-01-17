/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,svelte,ts}',
    "./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: { "50": "#d5e999", "100": "#c1de66", "200": "#c1de66", "300": "#b6d94d", "400": "#acd333", "500": "#a1ce1a", "600": "#97c800", "700": "#88b400", "800": "#6a8c00", "900": "#4c6400" }
      },
    },
  },
  plugins: [
    require('flowbite/plugin')
  ],
  darkMode: 'class',
}
