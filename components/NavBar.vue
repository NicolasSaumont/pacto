<script setup lang='ts'>
import { useRoute } from 'vue-router'

const route = useRoute()

const { t } = useI18n()

const menuItems = [
  {
    label: t('common.synthesis'),
    path: '/',
    icon: 'file-contract'
  },
  {
    label: t('common.orders'),
    path: '/orders',
    icon: 'file-pen'
  },
  {
    label: t('common.customers'),
    path: '/customers',
    icon: 'user'
  },
  {
    label: t('common.products'),
    path: '/products',
    icon: 'boxes-stacked'
  },
  {
    label: 'Model',
    path: '/model',
    icon: 'user'
  }
]

const menuItemClass = (path: string) => {
  const base = 'flex gap-2 items-center px-3 py-2 rounded-lg transition'

  const isActive = 'bg-blue-800 text-white'
  const isInactive = 'hover:bg-blue-800 hover:text-white'

  return [
    base,
    route.path === path ? isActive : isInactive
  ]
}
</script>

<template>
  <div class="bg-gray-900 w-1/5 p-5 flex flex-col gap-10 border-r border-gray-600">
    <NuxtLink to="/" class="uppercase font-semibold text-2xl">{{ APP_NAME }}</NuxtLink>

    <navbar class="flex flex-col gap-4 ml-6">
      <NuxtLink 
        v-for="item in menuItems" 
        :key="item.label" 
        :to="item.path" 
        :class="menuItemClass(item.path)"
      > 
        <FontAwesomeIcon
          :icon="item.icon"
          class="w-4 h-4"
        />
        <span>{{ item.label }}</span>
      </NuxtLink>
    </navbar>
  </div>
</template>
