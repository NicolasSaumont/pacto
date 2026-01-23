<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { formatMonthTitle } from '~/utils/date'
import { isProxy, toRaw } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: Dayjs | IRangeDates
    max?: Dayjs
    min?: Dayjs
    range?: boolean
  }>(),
  { 
    range: false 
  },
)

const emit = defineEmits<{
  (e: 'select', value: Dayjs | IRangeDates): void
  (e: 'close'): void
}>()

const {
  convertToDayjs,
} = useDatePicker()

const WEEK_DAYS = [
  'Lu',
  'Ma',
  'Me',
  'Je',
  'Ve',
  'Sa',
  'Di',
]

const monthTitle = computed(() => formatMonthTitle(viewMonth.value))

const isRangeValue = (value: unknown): value is IRangeDates =>
  !!value && typeof value === 'object' && 'start' in value && 'end' in value

// --- Normalisation modelValue -> valeurs sûres Dayjs ---
const selectedSingle = computed<Dayjs | null>(() => {
  if (props.range) return null
  return convertToDayjs(props.modelValue)
})

const selectedRange = computed<{ start: Dayjs; end: Dayjs } | null>(() => {
  if (!props.range) return null
  const mvRaw = props.modelValue ? (isProxy(props.modelValue) ? toRaw(props.modelValue) : props.modelValue) : null
  if (!mvRaw || !isRangeValue(mvRaw)) return null

  const start = convertToDayjs(mvRaw.start)
  const end = convertToDayjs(mvRaw.end)
  if (!start || !end) return null

  return end.isBefore(start, 'day') ? { start: end, end: start } : { start, end }
})

// --- Mois affiché ---
const initViewMonth = () => {
  const range = selectedRange.value
  if (range) return range.start.startOf('month')
  const single = selectedSingle.value
  if (single) return single.startOf('month')
  return dayjs().startOf('month')
}

const viewMonth = ref<Dayjs>(initViewMonth())

watch([selectedSingle, selectedRange], () => {
  viewMonth.value = initViewMonth()
})

// --- Grille 6 semaines (42 jours), semaine commençant lundi ---
const SHOWN_WEEKS_COUNT = 6
const DAYS_PER_WEEK = 7

const startOfGrid = computed(() => {
  const first = viewMonth.value.startOf('month')
  const dow = (first.day() + SHOWN_WEEKS_COUNT) % DAYS_PER_WEEK // dim(0)..sam(6) -> lun(0)..dim(6)
  return first.subtract(dow, 'day')
})

const days = computed(() => {
  const start = startOfGrid.value
  return Array.from({ length: SHOWN_WEEKS_COUNT * DAYS_PER_WEEK }, (_, index) => start.add(index, 'day'))
})

const isOutOfMonth = (date: Dayjs) => date.month() !== viewMonth.value.month()

const minimalDate = computed(() => convertToDayjs(props.min))
const maximalDate = computed(() => convertToDayjs(props.max))

const isDisabled = (date: Dayjs) => {
  const min = minimalDate.value
  const max = maximalDate.value
  if (min && date.isBefore(min, 'day')) return true
  if (max && date.isAfter(max, 'day')) return true
  return false
}

// --- Styles sélection ---
const isSelectedSingle = (date: Dayjs) => {
  const single = selectedSingle.value
  return !!single && date.isSame(single, 'day')
}

const isInSelectedRange = (date: Dayjs) => {
  const range = selectedRange.value
  if (!range) return false
  return (date.isSame(range.start, 'day') || date.isAfter(range.start, 'day')) &&
    (date.isSame(range.end, 'day') || date.isBefore(range.end, 'day'))
}

const isRangeEdge = (date: Dayjs) => {
  const range = selectedRange.value
  if (!range) return false
  return date.isSame(range.start, 'day') || date.isSame(range.end, 'day')
}

// --- Navigation mois ---
const previousMonth = () => {
  viewMonth.value = viewMonth.value.subtract(1, 'month')
}
const nextMonth = () => {
  viewMonth.value = viewMonth.value.add(1, 'month')
}

// --- Sélection (single / range) ---
const rangeStartSelection = ref<Dayjs | null>(null)

watch(
  () => props.range,
  () => {
    rangeStartSelection.value = null
  },
)

const onPick = (date: Dayjs) => {
  if (isDisabled(date)) return

  if (!props.range) {
    emit('select', date)
    emit('close')
    return
  }

  // Range: 1er clic => start (et end=start pour feedback immédiat)
  if (!rangeStartSelection.value) {
    rangeStartSelection.value = date
    emit('select', { start: date, end: date })
    return
  }

  // 2e clic => end (auto-tri)
  const start = rangeStartSelection.value
  const end = date
  const range = end.isBefore(start, 'day') ? { start: end, end: start } : { start, end }

  rangeStartSelection.value = null
  emit('select', range)
  emit('close')
}
</script>

<template>
  <div class="w-80 rounded-xl bg-white shadow-lg px-6 py-4 text-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between mb-4">
      <button 
        type="button" 
        class="rounded-lg p-2 hover:bg-gray-200"
        @click="previousMonth"
      >
        <FontAwesomeIcon icon="chevron-left" />
      </button>
      <div class="font-medium">
        {{ monthTitle }}
      </div>
      <button 
        type="button" 
        class="rounded-lg p-2 hover:bg-gray-200"
        @click="nextMonth"
      >
        <FontAwesomeIcon icon="chevron-right" />
      </button>
    </div>

    <!-- Weekdays -->
    <div class="grid grid-cols-7 text-xs text-gray-800 mb-3 pb-1 border-b border-gray-500">
      <div v-for="day in WEEK_DAYS" :key="day" class="text-center">{{ day }}</div>
    </div>

    <!-- Days -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="day in days"
        :key="day.valueOf()"
        type="button"
        class="h-9 rounded text-sm"
        :disabled="isDisabled(day)"
        :class="[
          isOutOfMonth(day) && 'text-gray-400',
          isDisabled(day) && 'opacity-40 cursor-not-allowed',
          !isDisabled(day) && 'hover:bg-gray-200',

          // range background en premier (pour que les dates limite puissent venir par dessus)
          isInSelectedRange(day) && 'bg-blue-300',

          // edges / selected override background
          isRangeEdge(day) && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-gray-800',
          isSelectedSingle(day) && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-gray-800',
        ]"
        @click="onPick(day)"
      >
        {{ day.date() }}
      </button>
    </div>
  </div>
</template>
