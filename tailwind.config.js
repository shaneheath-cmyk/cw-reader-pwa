/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aurum:    '#C9A84C',
        obsidian: '#0D0D0D',
        charcoal: '#1A1A1A',
        deepblack:'#111111',
        ecru:     '#E8E4DC'
      },
      fontFamily: {
        headline: ['"Cormorant Garamond"', 'serif'],
        label:    ['"Bebas Neue"', 'sans-serif']
      }
    }
  },
  plugins: []
}
