<script setup lang='ts'>
import { useMenu } from '~/composables/useMenu'

const { currentMenuItem } = useMenu()
</script>

<template>
  <div class="text-2xl mb-6">
    {{  currentMenuItem.description  }}
  </div>
</template>