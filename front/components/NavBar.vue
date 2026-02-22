<script setup lang='ts'>
import { useMenu } from '~/composables/useMenu'

const WIDTH_LOGO = 40

const { t } = useI18n()

const { 
  menuItemClass,
  menuItems,
} = useMenu()
</script>

<template>
  <div class="bg-gray-900 w-80 p-5 flex flex-col gap-10 border-r border-gray-600 shrink-0">
    <NuxtLink :to="MAIN_URL" class="flex items-center gap-2">
      <NuxtImg 
        :src="`${BASE_LOGO_SOURCE}${BLUE_TRANSPARENT_LOGO_SOURCE}`" 
        :alt="t('common.application-logo')" 
        :width="WIDTH_LOGO"
      />
      <span class="uppercase font-semibold text-2xl">{{ APP_NAME }}</span>
    </NuxtLink>

    <nav class="flex flex-col gap-4 ml-6">
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
    </nav>
  </div>
</template>
