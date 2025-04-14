// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // Use the CSS variable (--font-inter) defined in layout.tsx
        sans: ["var(--font-inter)", "sans-serif"],
      },
      // other extensions...
    },
  },
  plugins: [require("tailwind-scrollbar-hide")],
};

export default config;
