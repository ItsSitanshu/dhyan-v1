import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        jksans: ["Plus Jakarta Sans", "sans-serif"],
        nue: ["Bebas Neue", 'serif'],
        ars: "var(--font-arsenica)"
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        prim1: "var(--prim1)",
        prim2: "var(--prim2)",
        sec1: "var(--sec1)",
        sec2: "var(--sec2)",
        bgsec: "var(--bgsec)",
        lprim: "var(--lprim)",
        psec: "var(--psec)",
        lsec: "var(--lsec)",
      },
    },
  },
  plugins: [],
} satisfies Config;
