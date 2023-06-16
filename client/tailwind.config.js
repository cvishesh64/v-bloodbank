/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      colors:{
        'primary':"#B73E3E",
      }
    },
  },
  plugins: [],

  corePlugins: {
    preflight: false,
    
    // Add other core plugins as needed
  },
}