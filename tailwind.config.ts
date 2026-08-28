import type { Config } from "tailwindcss";

/** Cores vindas de variáveis CSS para permitir a troca de tema (ver app/globals.css). */
const themed = (variable: string) => `rgb(var(${variable}) / <alpha-value>)`;

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: themed("--c-dark-900"),
          800: themed("--c-dark-800"),
          700: themed("--c-dark-700"),
        },
        gold: {
          DEFAULT: themed("--c-accent"),
          light: themed("--c-accent-light"),
          bege: themed("--c-accent-bege"),
        },
        cream: themed("--c-cream"),
        cta: {
          DEFAULT: themed("--c-cta"),
          hover: themed("--c-cta-hover"),
          text: themed("--c-cta-text"),
        },
        action: {
          DEFAULT: themed("--c-action"),
          hover: themed("--c-action-hover"),
        },
        check: themed("--c-check"),
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
