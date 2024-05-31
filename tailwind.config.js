/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#3c3c3c",
          100: "#747474",
          200: "#848484",
          300: "#565656",
        },
        black: "#040404",
        secondary: "#dcb46a",
        gray: {
          100: "#cdcde0",
        },
      },
      fontFamily: {
        lbold: ["LeagueSpartan-Bold", "sans-serif"],
        iregular: ["Inter-Regular", "sans-serif"],
        rregular: ["Roboto-Regular", "sans-serif"],
        sregular: ["SpaceMono-Regular", "sans-serif"],
      },
    },
  },
  plugins: [],
};
