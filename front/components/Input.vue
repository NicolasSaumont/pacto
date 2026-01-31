<script setup lang='ts'>
import type { IInputProps } from '../types/input'

const props = withDefaults(defineProps<IInputProps>(), {
  clearable: true,
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'icon-click'): void
  (e: 'update:modelValue', value: string | number): void
}>()

defineOptions({ inheritAttrs: false })

const attrs = useAttrs()

const { 
  clearRightClass,
  iconColorClass,
  inputClasses,
  rightPaddingClass,
} = useInput(props)

const handleResetClick = () => {
  emit('update:modelValue', '')
}

const onInput = (e: Event) => {
  const el = e.target as HTMLInputElement
  let value = el.value

  if (!props.isNumberInput) {
    emit('update:modelValue', value)
    return
  }

  // enlève tout sauf chiffres et .
  value = value.replace(/[^\d.]/g, '')

  // empêche plusieurs points
  const parts = value.split('.')
  if (parts.length > 2) {
    value = parts[0] + '.' + parts.slice(1).join('')
  }

  el.value = value

  emit(
    'update:modelValue',
    value === '' || value === '.'
      ? ''
      : Number(value)
  )
}

const onKeyDown = (e: KeyboardEvent) => {
  if (!props.isNumberInput) return

  const allowedKeys = [
    'Backspace',
    'Delete',
    'ArrowLeft',
    'ArrowRight',
    'Tab',
  ]

  if (allowedKeys.includes(e.key)) return

  // chiffre
  if (/^\d$/.test(e.key)) return

  // point décimal (1 seul)
  if (e.key === '.') {
    const value = String(props.modelValue ?? '')
    if (!value.includes('.')) return
  }
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
        v-bind="attrs"
        type="text"
        :inputmode="isNumberInput ? 'decimal' : undefined"
        :pattern="isNumberInput ? '[0-9]*' : undefined"
        :value="modelValue"
        :disabled="disabled"
        :readonly="readonly"
        class="w-full"
        :class="[
          inputClasses,
          rightPaddingClass,
          (disabled || loading) && 'cursor-not-allowed opacity-50',
        ]"
        @keydown="onKeyDown"
        @input="onInput"
      />

      <!-- CLEAR ICON -->
      <FontAwesomeIcon
        v-if="modelValue && clearable && !disabled && !loading"
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

      <!-- TRAILING ICON -->
      <FontAwesomeIcon
        v-if="icon"
        :icon="icon"
        class="absolute right-3 top-1/2 -translate-y-1/2"
        :class="[
          iconColorClass,
          (disabled || loading) && 'opacity-50',
          iconClickable ? 'cursor-pointer' : 'pointer-events-none',
        ]"
        @click="iconClickable ? emit('icon-click') : undefined"
      />
    </div>
  </div>
</template>

