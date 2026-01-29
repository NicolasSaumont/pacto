<script setup lang="ts">
import { ref } from 'vue'

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

const constraintRef = ref<HTMLElement | null>(null)     // zone = espace restant dispo
const textareaRef = ref<HTMLTextAreaElement | null>(null)

const {
  clearRightClass,
  iconColorClass,
  wrapperClasses,
  textareaClasses,
  rightPaddingClass,
  scrollbarClasses,
  textareaMaxHeightStyle,
} = useTextarea(props, { constraintRef, textareaRef })

const handleResetClick = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="w-full h-full flex flex-col">
    <label v-if="label" class="block mb-1 text-sm font-medium text-gray-400">
      {{ label }}
    </label>

    <!-- IMPORTANT: cette zone représente "l'espace restant" -->
    <div ref="constraintRef" class="flex-1 min-h-0">
      <!-- wrapper ring (auto-height, suit le textarea) -->
      <div
        class="relative w-full rounded-lg border transition focus-within:ring-2 focus-within:ring-blue-500 focus-within:ring-offset-2"
        :class="[
          ...wrapperClasses,
          (disabled || loading) && 'opacity-50',
        ]"
      >
        <textarea
          ref="textareaRef"
          :rows="rows"
          :value="modelValue"
          :disabled="disabled"
          :placeholder="placeholder ? `${placeholder}...` : undefined"
          :style="props.resize ? textareaMaxHeightStyle : undefined"
          class="w-full bg-transparent focus:outline-none overflow-y-auto"
          :class="[
            ...textareaClasses,
            rightPaddingClass,
            scrollbarClasses,
            props.resize ? 'resize-y' : 'resize-none',
            (disabled || loading) && 'cursor-not-allowed',
          ]"
          @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
        />

        <FontAwesomeIcon
          v-if="modelValue && !disabled && !loading"
          icon="circle-xmark"
          class="absolute top-3 cursor-pointer"
          :class="[iconColorClass, clearRightClass]"
          @click="handleResetClick"
        />

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

        <FontAwesomeIcon
          v-if="icon"
          :icon="icon"
          class="absolute right-3 top-3 pointer-events-none"
          :class="[iconColorClass, (disabled || loading) && 'opacity-50']"
        />
      </div>
    </div>
  </div>
</template>
