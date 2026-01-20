<script setup lang="ts">
const props = withDefaults(defineProps<{
  disabled?: boolean
  icon?: string
  modelValue?: string
  label?: string
  loading?: boolean
  placeholder?: string
  theme?: TInputTheme

  rows?: number
  resize?: boolean
}>(), {
  theme: 'dark',
  rows: 4,
  resize: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const {
  clearRightClass,
  iconColorClass,
  textareaClasses,
  rightPaddingClass,
} = useTextarea(props)

const handleResetClick = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="w-full">
    <!-- Label -->
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-400">
      {{ label }}
    </label>

    <div class="relative">
      <textarea
        :rows="rows"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder ? `${placeholder}...` : undefined"
        class="w-full"
        :class="[
          textareaClasses,
          rightPaddingClass,
          !resize && 'resize-none',
          (disabled || loading) && 'cursor-not-allowed opacity-80',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />

      <!-- Clear (aligné en haut pour textarea) -->
      <FontAwesomeIcon
        v-if="modelValue && !disabled && !loading"
        icon="circle-xmark"
        class="absolute top-3 cursor-pointer"
        :class="[iconColorClass, clearRightClass]"
        @click="handleResetClick"
      />

      <!-- Loading -->
      <span
        v-if="loading"
        class="absolute top-3"
        :class="clearRightClass"
        aria-label="loading"
      >
        <span
          class="block h-5 w-5 rounded-full border-2 border-transparent border-t-current animate-spin"
          :class="iconColorClass"
        />
      </span>

      <!-- Trailing icon -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-3 top-3 pointer-events-none"
        :class="[
          iconColorClass,
          (disabled || loading) && 'opacity-50',
        ]"
      />
    </div>
  </div>
</template>
