<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  type?: 'button' | 'submit' | 'reset'
}>(), {
  disabled: false,
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="
      bg-blue-500 text-white font-medium py-2 px-3 rounded-lg max-w-44 transition-colors
      enabled:hover:bg-blue-700
      disabled:opacity-50 disabled:cursor-not-allowed
    "
    @click="emit('click', $event)"
  >
    <slot>Blabla</slot>
  </button>
</template>
