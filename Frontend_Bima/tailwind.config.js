/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Instagram-like gradient colors
        primary: "#833ab4", // deep purple
        secondary: "#fd1d1d", // red
        accent: "#fcb045", // orange
        lightBg: "#fafafa",
        darkBg: "#121212",
        lightText: "#333",
        darkText: "#fff",
      },
      fontFamily: {
        sans: ["Helvetica", "Arial", "sans-serif"],
        mono: ["Courier", "monospace"],
      },
      borderRadius: {
        xl: "1rem",
        "2xl": "1.5rem",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 3px rgba(0,0,0,0.1)",
        md: "0 4px 6px rgba(0,0,0,0.1)",
        lg: "0 10px 15px rgba(0,0,0,0.2)",
        xl: "0 20px 25px rgba(0,0,0,0.25)",
      },
      backgroundImage: {
        "insta-gradient":
          "linear-gradient(45deg, #833ab4, #fd1d1d, #fcb045, #fd1d1d, #833ab4)",
      },
      spacing: {
        18: "4.5rem",
        22: "5.5rem",
      },
    },
  },
  plugins: [],
  darkMode: "media", // auto dark/light mode
};
