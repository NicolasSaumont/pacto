<script setup lang='ts'>
const menuItems = [
  {
    label: 'Synthèse',
    path: '/',
    icon: ''
  },
  {
    label: 'Prise de commande',
    path: '/orders',
    icon: ''
  },
  {
    label: 'Clients',
    path: '/customers',
    icon: ''
  },
  {
    label: 'Produits',
    path: '/products',
    icon: ''
  }
]
</script>

<template>
  <div class="bg-gray-900 w-[15%] p-5 flex flex-col gap-10">
    <NuxtLink to="/" class="uppercase font-semibold text-2xl">{{ APP_NAME }}</NuxtLink>

    <div class="flex flex-col gap-7 ml-6">
      <template v-for="item in menuItems" :key="item.label">
        <NuxtLink :to="item.path"> {{ item.label }}</NuxtLink>
      </template>
    </div>
  </div>
</template>
