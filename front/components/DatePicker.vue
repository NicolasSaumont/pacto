<script lang="ts" setup generic="T extends Dayjs | IRangeDates">
import dayjs, { isDayjs, type Dayjs } from 'dayjs'

const props = withDefaults(
  defineProps<{
    disabled?: boolean
    displayedFormat?: string
    label?: string
    loading?: boolean
    max?: Dayjs
    min?: Dayjs
    modelValue?: T
    placeholder?: string
    range?: boolean
    theme?: TInputTheme
}>(), {
  displayedFormat: DATE_FORMAT,
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: T | undefined): void
}>()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const inputValue = computed<string>(() => {
  if (!props.modelValue) return ''

  if (props.range) {
    const raw = (isProxy(props.modelValue) ? toRaw(props.modelValue) : props.modelValue) as unknown as IRangeDates
    const start = formatDay(raw.start)
    const end = formatDay(raw.end)
    if (!start || !end) return ''
    return `${start} - ${end}`
  }

  return formatDay(props.modelValue)
})

const toDayjs = (value?: unknown): Dayjs | null => {
  if (!value) return null

  const raw = isProxy(value) ? toRaw(value) : value

  // Si c'est déjà un vrai Dayjs (avec clone), on le garde
  if (dayjs.isDayjs(raw) && typeof (raw as any).clone === 'function') {
    return raw as Dayjs
  }

  // Si c'est un "dayjs-like" (ex: Proxy/Object avec $d), on repart du Date
  const base = (raw as any).$d ?? raw
  const d = dayjs(base as any)
  return d.isValid() ? d : null
}

const formatDay = (value?: unknown) => {
  const date = toDayjs(value)
  return date ? date.format(props.displayedFormat) : ''
}

const onClickInput = () => {
  if (props.disabled || props.loading) return
  // TODO: ouvrir le calendrier
  console.log('blabla')
}

const onToggle = () => {
  if (props.disabled || props.loading) return
  open.value = !open.value
}

const onSelect = (value: Dayjs | IRangeDates) => {
  emit('update:modelValue', value as unknown as T)
}

const close = () => { open.value = false }

const onDocClick = (e: MouseEvent) => {
  if (!open.value) return
  const el = rootRef.value
  if (!el) return
  if (!el.contains(e.target as Node)) close()
}

const onKeydown = (e: KeyboardEvent) => {
  if (!open.value) return
  if (e.key === 'Escape') close()
}

onMounted(() => {
  document.addEventListener('mousedown', onDocClick)
  document.addEventListener('keydown', onKeydown)
})
onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onDocClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="rootRef" class="relative inline-block">
    <Input
      :model-value="inputValue"
      :disabled="disabled"
      :label="label"
      :loading="loading"
      :placeholder="placeholder"
      :theme="theme"
      readonly
      icon-clickable
      icon="calendar"
      @icon-click="onToggle"
    />

    <div v-if="open" class="absolute z-50 mt-2">
      <Calendar
        :model-value="(modelValue as any)"
        :range="!!range"
        :min="min"
        :max="max"
        @select="onSelect"
        @close="close"
      />
    </div>
  </div>
</template>
