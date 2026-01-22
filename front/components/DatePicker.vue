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
</script>

<template>
  <Input 
    :model-value="inputValue"
    :disabled
    icon="calendar"
    icon-clickable
    :label
    :loading
    :placeholder
    readonly
    :theme
    @icon-click="onClickInput"
  />
</template>
