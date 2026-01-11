// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

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

  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },

  modules: [
    '@pinia/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
  ],

  imports: {
    dirs: [
      './composables/**',
      './repository/**',
      './stores/**',
      './types/**', 
      './utils/**', 
    ],
  },

  css: [
    '@/assets/css/main.css',
    '@fortawesome/fontawesome-svg-core/styles.css'
  ],

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
  },
})
