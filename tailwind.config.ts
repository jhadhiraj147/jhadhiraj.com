import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Page wash sampled from the hero photograph's sky, and the ink ramp
        // re-solved so every muted tone keeps the contrast it had on white.
        page: {
          DEFAULT: "#e6e6e6",
          soft:    "#e0e0e0",
          surface: "#f0f0f0",
        },
        ink: {
          300: "#b6bfca",
          400: "#8391a3",
          500: "#505b6f",
        },
        // Muted tones that sit beside black and white photography. Each clears
        // WCAG AA (4.6:1) on the darkest veiled backdrop, #d2d2d2.
        accent: {
          DEFAULT: "#3f5b7b", // ink blue: roles, links, dates
          cyan:    "#396056", // verdigris: hover and secondary marks
        },
        gold: {
          DEFAULT: "#6e5523", // antique gold: emphasis inside prose
        },
        brand: {
          50:   "#eff7ff",
          100:  "#dbeafe",
          200:  "#93c5fd",
          400:  "#268bd2",
          500:  "#1e7ab5",
          navy: "#002b36",
        },
        sol: {
          "03":    "#002b36",
          "02":    "#073642",
          "01":    "#586e75",
          "00":    "#657b83",
          "0":     "#839496",
          "1":     "#93a1a1",
          "2":     "#eee8d5",
          "3":     "#fdf6e3",
          yellow:  "#b58900",
          orange:  "#cb4b16",
          red:     "#dc322f",
          magenta: "#d33682",
          violet:  "#6c71c4",
          blue:    "#268bd2",
          cyan:    "#2aa198",
          green:   "#859900",
        },
      },
      fontFamily: {
        // Display serif - headings, large statements, hero name
        display: ["var(--font-playfair)", "Georgia", "serif"],
        // UI chrome - nav, buttons, labels, pills
        sans:    ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        // Body prose - paragraphs, descriptions (Plex Sans, sibling of the mono)
        body:    ["var(--font-plex-sans)", "system-ui", "sans-serif"],
        // Technical / monospace - labels, diagrams, code, numbers
        mono:    ["var(--font-plex-mono)", "ui-monospace", "monospace"],
        // Technical prose beside diagrams
        tech:    ["var(--font-plex-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        float:        "float 6s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out 2s infinite",
        "float-med":  "float 7s ease-in-out 1s infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        blink:        "blink 1s step-end infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) scale(1)" },
          "50%":      { transform: "translateY(-18px) scale(1.04)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%":      { opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
