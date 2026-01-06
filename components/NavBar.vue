<script setup lang='ts'>
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useI18n()

const menuItems = [
  {
    label: t('common.synthesis'),
    path: '/',
    icon: ''
  },
  {
    label: t('common.orders'),
    path: '/orders',
    icon: ''
  },
  {
    label: t('common.customers'),
    path: '/customers',
    icon: ''
  },
  {
    label: t('common.products'),
    path: '/products',
    icon: ''
  },
  {
    label: 'Model',
    path: '/model',
    icon: ''
  }
]

const menuItemClass = (path: string) => {
  const base = 'px-3 py-2 rounded-lg transition'

  const isActive = 'bg-blue-800 text-white'
  const isInactive = 'hover:bg-blue-800 hover:text-white'

  return [
    base,
    route.path === path ? isActive : isInactive
  ]
}
</script>

<template>
  <div class="bg-gray-900 w-[15%] p-5 flex flex-col gap-10 border-r border-gray-600">
    <NuxtLink to="/" class="uppercase font-semibold text-2xl">{{ APP_NAME }}</NuxtLink>

    <div class="flex flex-col gap-4 ml-6">
      <NuxtLink 
        v-for="item in menuItems" 
        :key="item.label" 
        :to="item.path" 
        :class="menuItemClass(item.path)"
      > 
        {{ item.label }}
      </NuxtLink>
    </div>
  </div>
</template>
