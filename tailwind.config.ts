import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-blue': '#1e3a8a',
        'brand-lightblue': '#3b82f6',
        'brand-dark': '#f3f4f6', // Page background
        'brand-gray': '#ffffff', // Card background
        'brand-lightgray': '#d1d5db', // Borders
      },
    },
  },
  plugins: [],
};
export default config;
