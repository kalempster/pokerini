/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"
    ],
    theme: {
        extend: {
            backgroundImage: {
                poker: "url('./src/images/poker.webp')"
            },
            fontFamily: {
                "noto-serif": "'Noto Serif Malayalam', serif;",
                siemano: "'Cinzel Decorative', cursive",
                dancing: "'Dancing Script', cursive;",
                gotyk: "'Didact Gothic', sans-serif;",
                epilog: "'Epilogue', sans-serif;"
            },
            boxShadow: {
                innerSh: "inset 0 0 20rem black;"
            },
            colors: {
                primary: "#FFCD01",
                secondary: "#EF2A4F",
                background: "#181B30"
            }
        }
    },
    plugins: []
};
