// https://nuxt.com/docs/api/configuration/nuxt-config
import { config } from '@fortawesome/fontawesome-svg-core'
config.autoAddCss = false

export default defineNuxtConfig({
  app: {
    head: {
      charset: 'utf-8',
      viewport: 'width=device-width, initial-scale=1',
      title: 'Pacto',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
        { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
      ]
    },
  },

  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr: false,

  modules: [
    '@formkit/auto-animate/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/tailwindcss',
    '@nuxt/image',
    '@pinia/nuxt',
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
    '@fortawesome/fontawesome-svg-core/styles.css',
  ],

  i18n: {
    bundle: {
      optimizeTranslationDirective: false,
    },
  },

  nitro: {
    devProxy: {
      '/api': {
        target: 'http://back:3001',
        changeOrigin: true,
      },
    },
    routeRules: {
      '/api/**': {
        proxy: 'http://back:3001/**',
      },
    },
  },
})
