<script setup lang="ts">
const props = withDefaults(defineProps<{
  color?: TButtonColor
  disabled?: boolean
  flat?: boolean
  icon?: string
  label?: string
  type?: 'button' | 'submit' | 'reset'
}>(), {
  color: 'primary',
  disabled: false,
  flat: false,
  type: 'button',
})

const emit = defineEmits<{
  (e: 'click', ev: MouseEvent): void
}>()

const {
  buttonStyle
} = useButton(props)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :class="buttonStyle"
    @click="emit('click', $event)"
  >
    <slot>
      <div class="flex gap-2 items-center">
        <span v-if="label">{{ label }}</span>
        <FontAwesomeIcon v-if="icon" :icon />
      </div>
    </slot>
  </button>
</template>
