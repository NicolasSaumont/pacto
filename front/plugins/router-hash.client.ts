import { defineNuxtPlugin } from '#app'
import { createWebHashHistory, type Router } from 'vue-router'

export default defineNuxtPlugin((nuxtApp) => {
  const router = nuxtApp.$router as Router
  if (!router) return

  // Remplace la history par hash mode
  router.options.history = createWebHashHistory()
})