<script setup lang='ts'>
import { useMenu } from '~/composables/useMenu'

const { currentMenuItem } = useMenu()
</script>

<template>
  <div class="flex gap-2 items-center text-2xl">
    <span>{{  currentMenuItem.description  }}</span>
    <FontAwesomeIcon :icon="currentMenuItem.icon" />
  </div>
</template>