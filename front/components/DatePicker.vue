<script setup lang='ts'>
import { Dayjs } from 'dayjs'

const props = withDefaults(defineProps<{
  disabled?: boolean
  icon?: string
  modelValue?: Dayjs
  label?: string
  loading?: boolean
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
  rightPaddingClass,
} = useDatePicker(props)

const handleResetClick = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="w-full max-w-72">
    <!-- Label -->
    <label
      v-if="label"
      class="block mb-1 text-sm font-medium text-gray-400"
    >
      {{ label }}
    </label>

    <!-- Input wrapper -->
    <div class="relative">
      <input
        type="text"
        :value="modelValue"
        :disabled="disabled"
        :placeholder="placeholder ? `${placeholder}...` : undefined"
        class="w-full"
        :class="[
          inputClasses,
          rightPaddingClass,
          (disabled || loading) && 'cursor-not-allowed opacity-80',
        ]"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <FontAwesomeIcon
        v-if="modelValue && !disabled && !loading"
        icon="circle-xmark"
        class="absolute top-1/2 -translate-y-1/2 cursor-pointer"
        :class="[iconColorClass, clearRightClass]"
        @click="handleResetClick"
      />

      <!-- LOADING -->
      <span
        v-if="loading"
        class="absolute top-1/2 -translate-y-1/2"
        :class="clearRightClass"
        aria-label="loading"
      >
        <span
          class="block h-5 w-5 rounded-full border-2 border-transparent border-t-current animate-spin"
          :class="iconColorClass"
        />
      </span>

      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
        :class="[
          iconColorClass,
          (disabled || loading) && 'opacity-50',
        ]"
      />
    </div>
  </div>
</template>

