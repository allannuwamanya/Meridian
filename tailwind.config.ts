import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Meridian brand primary — rose pink
        brand: {
          50:  "#fff1f2",
          100: "#ffe4e6",
          200: "#fecdd3",
          300: "#fda4af",
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",   // PRIMARY
          700: "#be123c",
          800: "#9f1239",
          900: "#881337",
        },
        surface: {
          base:     "#f7f7f8",
          DEFAULT:  "#ffffff",
          elevated: "#ffffff",
          overlay:  "#fdf2f4",
        },
        ink: {
          primary:   "#111827",
          secondary: "#374151",
          muted:     "#6b7280",
          placeholder: "#9ca3af",
        },
      },
      backgroundImage: {
        "meridian-gradient": "linear-gradient(135deg, #e11d48, #f43f5e)",
        "meridian-soft":     "linear-gradient(135deg, #fff1f2, #fdf2f4)",
      },
      fontFamily: {
        sans:  ["Inter", "sans-serif"],
        serif: ["DM Serif Display", "serif"],
        mono:  ["JetBrains Mono", "monospace"],
      },
      animation: {
        "fade-in-up":  "fadeInUp 0.4s ease both",
        "fade-in":     "fadeIn 0.3s ease both",
        "slide-up":    "slideUp 0.4s ease both",
        "pulse-glow":  "pulseGlow 2s ease infinite",
        "shimmer":     "shimmer 1.5s ease infinite",
        "toast-in":    "toastIn 0.35s ease both",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(16px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(225, 29, 72, 0.1)" },
          "50%":     { boxShadow: "0 0 40px rgba(225, 29, 72, 0.25)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to:   { backgroundPosition: "200% 0" },
        },
        toastIn: {
          from: { opacity: "0", transform: "translateX(100%)" },
          to:   { opacity: "1", transform: "translateX(0)" },
        },
      },
      borderRadius: {
        "xl":  "12px",
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        "card":   "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)",
        "popup":  "0 8px 32px -8px rgba(0,0,0,0.12), 0 2px 8px -2px rgba(0,0,0,0.08)",
        "brand":  "0 4px 24px rgba(225, 29, 72, 0.25)",
        "brand-lg": "0 8px 40px rgba(225, 29, 72, 0.35)",
      },
    },
  },
  plugins: [],
};
export default config;
