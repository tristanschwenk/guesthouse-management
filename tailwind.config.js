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
        'open': '#22c55e', // Green-500 for available dates
        'close': '#ef4444', // Red-500 for booked dates
        'open-close': '#fb923c', // Orange-400 for check-in/out days
        'close-open': '#fb923c', // Same orange for consistency
      }
    },
  },
  plugins: [],
}

