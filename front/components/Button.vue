<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: ButtonColorEnum
  disabled?: boolean
  flat?: boolean
  icon?: string
  label?: string
  loading?: boolean
  outline?: boolean
  title?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  color: ButtonColorEnum.PRIMARY,
  disabled: false,
  flat: false,
  outline: false,
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const {
  buttonStyle
} = useButton(props)

const buttonRef = ref<HTMLButtonElement | null>(null)

defineExpose({
  focus: () => buttonRef.value?.focus()
})
</script>

<template>
  <button
    ref="buttonRef"
    :type="type"
    :disabled="disabled || loading"
    :title="!disabled && !loading ? title : ''"
    :class="buttonStyle"
    @click="emit('click', $event)"
  >
    <div class="flex gap-2 items-center justify-center">
      <!-- LOADING -->
      <span
        v-if="loading"
        class="h-5 w-5 rounded-full border-2 border-transparent border-t-current animate-spin"
        aria-label="loading"
      />

      <template v-else>
        <slot>
          <span v-if="label">{{ label }}</span>
          <FontAwesomeIcon v-if="icon" :icon="icon" />
        </slot>
      </template>
    </div>
  </button>
</template>

