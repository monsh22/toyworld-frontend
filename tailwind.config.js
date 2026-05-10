/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { 50:"#fff7ed", 100:"#ffedd5", 200:"#fed7aa", 300:"#fdba74", 400:"#fb923c", 500:"#f97316", 600:"#ea580c", 700:"#c2410c" },
        mint: { 400:"#34d399", 500:"#10b981" },
        sky: { 400:"#38bdf8", 500:"#0ea5e9" },
        lemon: { 300:"#fde047", 400:"#facc15" },
      },
      fontFamily: {
        display: ["'Baloo 2'", "cursive"],
        body: ["'DM Sans'", "sans-serif"],
      },
      borderRadius: { "4xl":"2rem" },
      boxShadow: {
        toy: "0 8px 32px -4px rgba(249,115,22,0.25)",
        card: "0 4px 24px -2px rgba(0,0,0,0.08)",
        hover: "0 16px 48px -8px rgba(249,115,22,0.35)",
      },
    },
  },
  plugins: [],
}
