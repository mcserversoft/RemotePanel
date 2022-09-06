/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,svelte,ts}'],
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
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#7ca740",
          "primary-content": "#fff",
          
           //"secondary": "#949895",
          // "accent": "#37CDBE",
           "neutral": "#949895",
           "base-100": "#212529",
          // "info": "#3ABFF8",
          // "success": "#36D399",
          // "warning": "#FBBD23",
          // "error": "#F87272",

          "--rounded-btn": "0.375rem",
        },
      },
    ],
  },
  plugins: [
    require('daisyui'),
  ],
}
