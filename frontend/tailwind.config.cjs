/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}',
  ],
  theme: {
    extend: {
        backgroundImage: {
            "poker": "url('./src/images/poker.jpg')"
        },
        fontFamily: {
            "noto-serif": "'Noto Serif Malayalam', serif;",
            "dancing": "'Dancing Script', cursive;"
        },
    },
  },
  plugins: [],
};
