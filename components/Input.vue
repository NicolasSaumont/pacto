<script setup lang='ts'>
const props = defineProps<{
  icon?: string
  modelValue?: string
  placeholder?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const handleResetClick = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="relative">
    <input
      type="text"
      :value="modelValue"
      :placeholder="`${placeholder}...`"
      class="bg-gray-800 border border-gray-600 rounded-lg pl-3 py-1 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
      :class="[icon ? 'pr-16' : 'pr-10']"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <FontAwesomeIcon
      v-if="modelValue"
      icon="circle-xmark"
      class="absolute right-10 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
      :class="[icon ? 'right-10' : 'right-3']"
      @click="handleResetClick"
    />
    <FontAwesomeIcon
      v-if="icon"
      :icon="icon"
      class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
</template>
