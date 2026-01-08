<script setup lang='ts'>
const props = withDefaults(defineProps<{
  icon?: string
  modelValue?: string
  label?: string
  placeholder?: string
  theme?: TInputTheme
}>(), {
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const { 
  clearRightClass,
  iconColorClass,
  inputClasses,
  labelClass,
  rightPaddingClass,
} = useInput(props)

const handleResetClick = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="w-full max-w-72">
    <!-- Label -->
    <label
      v-if="label"
      class="block mb-1 text-sm font-medium"
      :class="labelClass"
    >
      {{ label }}
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <input
        type="text"
        :value="modelValue"
        :placeholder="placeholder ? `${placeholder}...` : undefined"
        class="w-full"
        :class="[
          inputClasses,
          rightPaddingClass,
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <FontAwesomeIcon
        v-if="modelValue"
        icon="circle-xmark"
        class="absolute top-1/2 -translate-y-1/2 cursor-pointer"
        :class="[iconColorClass, clearRightClass]"
        @click="handleResetClick"
      />

      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        :class="iconColorClass"
      />
    </div>
  </div>
</template>

