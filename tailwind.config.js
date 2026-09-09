/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        tea: {
          50: "#f2f7f0",
          100: "#e0ecd9",
          200: "#c2dab5",
          300: "#9dc389",
          400: "#77a862",
          500: "#588c44",
          600: "#437034",
          700: "#37592c",
          800: "#2e4826",
          900: "#273c21",
          950: "#122111",
        },
        gold: {
          200: "#f0dfb0",
          300: "#e8cd8f",
          400: "#d9b25f",
          500: "#c99a3d",
          600: "#ab7c2c",
          700: "#8a611f",
        },
        brass: {
          300: "#e8c896",
          400: "#d9a656",
          500: "#c08a3e",
          600: "#a16f2f",
        },
      },
    },
  },
  plugins: [],
};
