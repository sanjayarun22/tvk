/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        primary: '#B22234', // Red from flag
        secondary: '#FFD700', // Yellow from flag
        accent: '#808080', // Gray from elephants
      },
    },
  },
  plugins: [],
}