import type { Config } from "tailwindcss";

// Semantik token — CSS-o'zgaruvchidan RGB kanal o'qiydi (alpha qo'llab-quvvatlanadi).
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Semantik sirt tokenlari (light/dark .dark blokida almashadi)
        background: v("--bg"),
        foreground: v("--fg"),
        card: v("--card"),
        muted: { DEFAULT: v("--muted"), foreground: v("--muted-fg") },
        border: v("--border"),
        input: v("--input"),
        ring: v("--ring"),
        // Brend — SKAZKA iliq/yorqin palitra (bolalar uchun, §7.2)
        brand: {
          50: v("--brand-50"),
          100: v("--brand-100"),
          200: v("--brand-200"),
          300: v("--brand-300"),
          400: v("--brand-400"),
          500: v("--brand-500"),
          600: v("--brand-600"),
          700: v("--brand-700"),
          800: v("--brand-800"),
          900: v("--brand-900"),
          foreground: v("--brand-fg"),
        },
        // O'ynoqi aksent
        accent: {
          DEFAULT: v("--accent"),
          500: v("--accent"),
          600: v("--accent-600"),
          foreground: v("--accent-fg"),
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        // Bolalar UX: yumaloq, do'stona shakllar (§7.2)
        xl2: "1.25rem",
        blob: "2rem",
      },
      boxShadow: {
        card: "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
        soft: "0 4px 16px -4px rgb(120 70 30 / 0.12)",
        pop: "0 12px 40px -12px rgb(120 70 30 / 0.25)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.96)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        // Maskot (Mishka) reaksiyalari uchun
        "bounce-soft": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
        wiggle: "wiggle 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
