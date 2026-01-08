<script setup lang='ts'>
import { useMenu } from '~/composables/useMenu'

const { currentMenuItem } = useMenu()
</script>

<template>
  <div class="flex gap-2 justify-between mb-6">
    <div class="text-2xl">
      <slot name="title">
        {{ currentMenuItem?.description }}
      </slot>
    </div>
    <slot name="header-right" />
  </div>
</template>