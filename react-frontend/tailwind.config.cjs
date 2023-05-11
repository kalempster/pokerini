/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx,css,md,mdx,html,json,scss}"
    ],
    theme: {
        extend: {
            screens: {
                mobile: { raw: "only screen and (any-pointer: coarse)" },
                tall: { raw: "(min-height: 600px)" }
            },
            backgroundImage: {
                poker: "url('./src/images/poker.png')"
            },
            fontFamily: {},
            boxShadow: {
                innerSh: "inset 0 0 20rem black;"
            },
            colors: {
                primary: "#FFCD01",
                secondary: "#EF2A4F",
                background: "#181B30",
                twojstary: "#30365C",
                font: "#92A3AC",
                backgroundshadow: "#141624"
            },
            transitionProperty: {
                "opacity-transform": "opacity, transform"
            }
        }
    },
    plugins: []
};
