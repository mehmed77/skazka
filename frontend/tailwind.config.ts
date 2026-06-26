import type { Config } from "tailwindcss";

// Semantik token — CSS-o'zgaruvchidan RGB kanal o'qiydi (Maqola mexanizmi).
const v = (name: string) => `rgb(var(${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: v("--bg"),
        foreground: v("--fg"),
        card: v("--card"),
        muted: { DEFAULT: v("--muted"), foreground: v("--muted-fg") },
        border: v("--border"),
        input: v("--input"),
        ring: v("--ring"),
        brand: {
          50: v("--brand-50"), 100: v("--brand-100"), 200: v("--brand-200"),
          300: v("--brand-300"), 400: v("--brand-400"), 500: v("--brand-500"),
          600: v("--brand-600"), 700: v("--brand-700"), 800: v("--brand-800"),
          900: v("--brand-900"), foreground: v("--brand-fg"),
        },
        accent: { DEFAULT: v("--accent"), 600: v("--accent-600"), foreground: v("--accent-fg") },
        success: { DEFAULT: v("--success"), foreground: v("--success-fg") },
        grape: v("--grape"),
        sun: v("--sun"),
        forest: { DEFAULT: v("--forest"), deep: v("--forest-deep") },
        path: v("--path"),
        status: {
          locked: v("--status-locked"),
          available: v("--status-available"),
          started: v("--status-started"),
          done: v("--status-done"),
        },
      },
      fontFamily: {
        // Yumaloq, do'stona shrift (bolalarbop)
        sans: ["var(--font-nunito)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl2: "1.25rem",
        blob: "2rem",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 2px 8px -2px rgb(120 70 30 / 0.10)",
        soft: "0 6px 20px -6px rgb(120 70 30 / 0.16)",
        pop: "0 14px 44px -12px rgb(120 70 30 / 0.30)",
        glow: "0 0 0 6px rgb(var(--ring) / 0.18)",
      },
      keyframes: {
        "fade-in": { from: { opacity: "0", transform: "translateY(4px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        "scale-in": { from: { opacity: "0", transform: "scale(0.94)" }, to: { opacity: "1", transform: "scale(1)" } },
        "bounce-soft": { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        wiggle: { "0%,100%": { transform: "rotate(-4deg)" }, "50%": { transform: "rotate(4deg)" } },
        "pop-in": { "0%": { opacity: "0", transform: "scale(0.6)" }, "70%": { transform: "scale(1.1)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-5px)" } },
      },
      animation: {
        "fade-in": "fade-in 0.2s ease-out",
        "scale-in": "scale-in 0.15s ease-out",
        "bounce-soft": "bounce-soft 1.6s ease-in-out infinite",
        wiggle: "wiggle 0.5s ease-in-out infinite",
        "pop-in": "pop-in 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
