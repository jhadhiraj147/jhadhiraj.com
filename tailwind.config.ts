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
        // Semantic ink and surfaces follow the midnight terminal palette.
        slate: {
          50: "#0c2e37", 100: "#10333d", 200: "#1f4650",
          300: "#315863", 400: "#527d86", 500: "#85a9af",
          600: "#9bbbc0", 700: "#b1cecf", 800: "#c5dfdc", 900: "#d5eeea",
          950: "#e4f5ef",
        },
        page: {
          DEFAULT: "#062832",
          soft:    "#05232c",
          surface: "#08343e",
        },
        ink: {
          300: "#81a5ad",
          400: "#92b4bb",
          500: "#a6c5c8",
        },
        // Mint accents and cool highlights drawn from the terminal reference.
        accent: {
          DEFAULT: "#83dbc5",
          cyan:    "#83bbc7",
        },
        gold: {
          DEFAULT: "#b0d6c9",
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
      // Readable prose scale, with a 14px floor for UI labels and metadata.
      fontSize: {
        caption:      ["14px", { lineHeight: "22px" }],
        body:         ["16px", { lineHeight: "28px" }], // n=0   every paragraph, inline code, links
        lead:         ["20px", { lineHeight: "32px" }], // n=1   role and degree lines, lead-ins, taglines
        title:        ["25px", { lineHeight: "32px" }], // n=2   every h3
        headline:     ["31px", { lineHeight: "40px" }], // n=3   the name under the motto
        "display-sm": ["39px", { lineHeight: "44px" }], // n=4   section titles on phones
        "display-md": ["49px", { lineHeight: "52px" }], // n=5   section titles on tablets, figures
        "display-lg": ["61px", { lineHeight: "64px" }], // n=6   section titles on desktop
      },
      fontFamily: {
        // Monospace headings carry the terminal character throughout the page.
        display: ["var(--font-console)", "ui-monospace", "monospace"],
        // UI chrome - nav, buttons, labels, pills
        sans:    ["var(--font-console)", "ui-monospace", "monospace"],
        // Body prose - paragraphs, descriptions (Plex Sans, sibling of the mono)
        body:    ["var(--font-console)", "ui-monospace", "monospace"],
        // Technical / monospace - labels, diagrams, code, numbers
        mono:    ["var(--font-console)", "ui-monospace", "monospace"],
        // Technical prose beside diagrams
        tech:    ["var(--font-console)", "ui-monospace", "monospace"],
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
