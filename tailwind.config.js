/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./admin/index.html",
    "./src/admin/**/*.{js,ts,jsx,tsx}",
    "./src/public/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
