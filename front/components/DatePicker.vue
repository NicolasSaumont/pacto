<script lang="ts" setup generic="T extends Dayjs | IRangeDates">
import dayjs, { type Dayjs } from 'dayjs'

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
  range: false,
  theme: 'dark',
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: T | undefined): void
}>()

const wrapperRef = ref<HTMLElement | null>(null)

const isCalendarOpen = ref(false)

const inputValue = computed(() => {
  if (!props.modelValue) return ''
  return props.range
    ? formatRange(props.modelValue as unknown as IRangeDates)
    : formatSingle(props.modelValue as unknown as Dayjs)
})

const closeCalendar = () => { isCalendarOpen.value = false }

const formatSingle = (value: DateLike) => {
  const date = toDayjs(value)
  return date ? date.format(props.displayedFormat) : ''
}

const formatRange = (value: IRangeDates | null | undefined) => {
  if (!value) return ''
  const raw = isProxy(value) ? toRaw(value) : value
  const start = formatSingle(raw.start)
  const end = formatSingle(raw.end)
  if (!start || !end) return ''
  return `${start} - ${end}`
}

/**
 * Normalise une valeur "date-like" en véritable instance Dayjs.
 *
 * Contexte :
 * - Avec Vue (props, stores, réactivité), un Dayjs peut être "proxyfié"
 *   ou transformé en objet "dayjs-like" (ex: avec une propriété `$d`),
 *   ce qui casse certaines méthodes (`format`, `isAfter`, `clone`, etc.).
 *
 * Cette fonction garantit que :
 * - on retourne toujours un vrai `Dayjs` utilisable en toute sécurité
 * - ou `null` si la valeur est absente ou invalide
 *
 * Stratégie :
 * 1. Dé-proxyfie la valeur si nécessaire
 * 2. Si c'est déjà un Dayjs "propre", on le retourne tel quel
 * 3. Sinon, on reconstruit un Dayjs à partir du `Date` interne (`$d`)
 *    ou de la valeur brute
 */
const toDayjs = (value: DateLike): Dayjs | null => {
  if (!value) return null

  const raw = isProxy(value) ? toRaw(value) : value

  // Si c'est déjà un vrai Dayjs (avec clone), on le garde
  if (dayjs.isDayjs(raw) && typeof (raw as any).clone === 'function') {
    return raw as Dayjs
  }

  // Si c'est un "dayjs-like" (ex: Proxy/Object avec $d), on repart du Date
  const base = (raw as any).$d ?? raw
  const date = dayjs(base as any)
  return date.isValid() ? date : null
}

const onSelect = (value: Dayjs | IRangeDates) => {
  emit('update:modelValue', value as unknown as T)
}

const onClick = (e: MouseEvent) => {
  if (!isCalendarOpen.value) return
  const el = wrapperRef.value
  if (!el) return
  if (!el.contains(e.target as Node)) closeCalendar()
}

const onKeydown = (e: KeyboardEvent) => {
  if (!isCalendarOpen.value) return
  if (e.key === 'Escape') closeCalendar()
}

const toggleCalendar = () => {
  if (props.disabled || props.loading) return
  isCalendarOpen.value = !isCalendarOpen.value
}
 
onMounted(() => {
  document.addEventListener('mousedown', onClick)
  document.addEventListener('keydown', onKeydown)
})

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', onClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="wrapperRef" class="relative inline-block">
    <Input
      :model-value="inputValue"
      :clearable="false"
      :disabled
      icon="calendar-day"
      :label
      :loading
      :placeholder
      readonly
      :theme
      class="cursor-pointer"
      @click="toggleCalendar"
    />

    <div v-if="isCalendarOpen" class="absolute z-50 mt-2">
      <Calendar
        :model-value="(modelValue as any)"
        :min
        :max
        :range
        @select="onSelect"
        @close="closeCalendar"
      />
    </div>
  </div>
</template>
