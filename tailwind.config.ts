import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        blush: "#ff6fb5",
        butter: "#ffd85a",
        cream: "#fff9ef"
      },
      boxShadow: {
        glow: "0 8px 28px rgba(255,111,181,0.25)"
      }
    },
  },
  plugins: [],
} satisfies Config;
