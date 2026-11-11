/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        'w95-face': '#c0c0c0',
        'w95-title': '#000080',
        'w95-desktop': '#008080',
        'itm-bg': '#0b0b0f',
      },
    },
  },
  plugins: [],
}
