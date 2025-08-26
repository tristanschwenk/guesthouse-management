// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: [
    '@nuxtjs/tailwindcss'
  ],
  css: [
    '~/assets/css/main.css'
  ],
  build: {
    transpile: ['v-calendar', 'vue3-apexcharts', 'apexcharts']
  },
  typescript: {
    strict: true
  }
})
