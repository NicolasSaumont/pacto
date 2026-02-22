<script setup lang='ts'>
defineProps<{
  count: number
  description: string
}>()
</script>

<template>
  <div class="flex flex-col gap-2 bg-gray-900 border border-gray-600 rounded-2xl p-6 w-full">
    <span class="text-4xl font-bold">{{ count }}</span>
    <span class="text-xl text-gray-400">{{ description }}</span>
  </div>
</template>
