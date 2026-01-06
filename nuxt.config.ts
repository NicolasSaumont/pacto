// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Pacto',
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
  ],

  imports: {
    dirs: ['./types/**'],
  },

  css: ['@/assets/css/main.css'],
})
