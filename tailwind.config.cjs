/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#04060D",
          900: "#070A13",
          850: "#0B1020",
          800: "#101628",
          700: "#161D33",
        },
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
      },
      boxShadow: {
        glow: "0 24px 60px -30px rgba(56, 189, 248, 0.45)",
        "glow-violet": "0 24px 60px -30px rgba(139, 92, 246, 0.5)",
        "glow-cyan": "0 24px 60px -30px rgba(34, 211, 238, 0.45)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(120deg, #38BDF8 0%, #818CF8 50%, #C084FC 100%)",
        "grid-lines":
          "linear-gradient(to right, rgba(148, 163, 184, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(148, 163, 184, 0.08) 1px, transparent 1px)",
        /** Halftone dots used as decorative background in the skills section. */
        "dot-grid": "radial-gradient(rgba(148, 163, 184, 0.45) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "56px 56px",
        dot: "14px 14px",
      },
      keyframes: {
        "gradient-pan": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(0, -16px, 0) scale(1.03)" },
        },
        "aurora-drift": {
          "0%, 100%": { transform: "translate(0, 0) scale(1)", opacity: "0.7" },
          "50%": { transform: "translate(28px, -22px) scale(1.1)", opacity: "1" },
        },
        "spin-slow": {
          to: { transform: "rotate(360deg)" },
        },
        "dash-flow": {
          to: { strokeDashoffset: "-32" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.85)", opacity: "0.55" },
          "100%": { transform: "scale(1.7)", opacity: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "gradient-pan": "gradient-pan 8s ease infinite",
        float: "float 7s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        aurora: "aurora-drift 11s ease-in-out infinite",
        "aurora-late": "aurora-drift 14s ease-in-out -7s infinite",
        "spin-slow": "spin-slow 16s linear infinite",
        "dash-flow": "dash-flow 1.4s linear infinite",
        "pulse-ring": "pulse-ring 2.8s ease-out infinite",
        shimmer: "shimmer 2.4s ease-in-out infinite",
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
    },
  },
  plugins: [],
};
