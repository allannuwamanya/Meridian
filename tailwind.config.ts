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
        accent: {
          primary: "#7c3aed",
          secondary: "#06b6d4",
        },
        surface: {
          base: "#0a0a0f",
          DEFAULT: "#111118",
          elevated: "#18181f",
          overlay: "#1e1e28",
        },
      },
      backgroundImage: {
        "meridian-gradient": "linear-gradient(135deg, #7c3aed, #06b6d4)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.4s ease both",
        "pulse-glow": "pulseGlow 2s ease infinite",
        shimmer: "shimmer 1.5s ease infinite",
      },
      keyframes: {
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        pulseGlow: {
          "0%,100%": { boxShadow: "0 0 20px rgba(124,58,237,0.25)" },
          "50%": { boxShadow: "0 0 40px rgba(124,58,237,0.4)" },
        },
        shimmer: {
          from: { backgroundPosition: "-200% 0" },
          to: { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
