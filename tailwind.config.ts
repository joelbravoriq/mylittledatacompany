import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#12151a",
          900: "#181c23",
          850: "#1a1e26",
          800: "#1f242d",
          700: "#2b303b",
          600: "#3a404d",
          500: "#565c6b",
          400: "#6d7280",
          300: "#9096a3",
          200: "#b7bcc7",
          100: "#e4e2dc",
          50: "#f5f3ef",
        },
        amber: {
          DEFAULT: "#e8a33d",
          dim: "#b4761f",
          bright: "#f5bc63",
          bg: "#2e2617",
        },
        policy: {
          DEFAULT: "#7c98e0",
          dim: "#5b7fd6",
          bright: "#a4bcf0",
        },
        ok: "#3ecf8e",
        warn: "#e8a33d",
      },
      fontFamily: {
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Arial Narrow", "sans-serif"],
        mono: ["var(--font-jbmono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        grid: "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      animation: {
        blink: "blink 1.1s step-end infinite",
        "fade-up": "fadeUp 0.6s ease-out forwards",
        "pulse-slow": "pulseSlow 2.5s ease-in-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseSlow: {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
