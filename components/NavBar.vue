<script setup lang='ts'>
import { useMenu } from '~/composables/useMenu'

const { 
  menuItemClass,
  menuItems,
} = useMenu()

</script>

<template>
  <div class="bg-gray-900 w-1/5 p-5 flex flex-col gap-10 border-r border-gray-600 shrink-0">
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
