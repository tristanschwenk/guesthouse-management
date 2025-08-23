/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      colors: {
        'open': '#4ade80', // Green for available dates
        'close': '#f87171', // Red for booked dates
        'open-close': '#fbbf24', // Yellow for start of reservation
        'close-open': '#60a5fa', // Blue for end of reservation
      }
    },
  },
  plugins: [],
}

