/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          green: "#00ff66",
          darkgreen: "#052e16",
          border: "rgba(0, 255, 102, 0.2)",
          card: "rgba(0, 0, 0, 0.75)"
        }
      }
    },
  },
  plugins: [],
}

