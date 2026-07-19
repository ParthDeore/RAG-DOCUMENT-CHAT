import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#12161F",
          900: "#1B2430",
          800: "#26303F",
          700: "#374255",
        },
        paper: {
          50: "#FAFAF7",
          100: "#F2F1EC",
          200: "#E6E4DA",
        },
        gold: {
          400: "#D9B24C",
          500: "#C9A227",
          600: "#A9840F",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        sans: ["var(--font-sans)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        card: "10px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(18,22,31,0.06), 0 4px 12px rgba(18,22,31,0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
