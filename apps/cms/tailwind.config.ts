import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx,mdx}", "./components/**/*.{ts,tsx,mdx}", "./app/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        soft: "var(--soft)",
        fg: "var(--fg)",
        muted: "var(--muted)",
        border: "var(--border)",
        "strong-border": "var(--strong-border)",
        accent: "var(--accent)",
        success: "var(--success)",
        warning: "var(--warning)",
        danger: "var(--danger)",
      },
      boxShadow: {
        shell: "var(--shadow)",
      },
      fontFamily: {
        sans: ["var(--font)"],
        mono: ["var(--mono)"],
      },
    },
  },
  plugins: [],
};

export default config;
