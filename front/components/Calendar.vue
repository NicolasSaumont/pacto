<script setup lang="ts">
import dayjs, { type Dayjs } from 'dayjs'
import { formatMonthTitle } from '~/utils/date'
import { isProxy, toRaw } from 'vue'

const props = withDefaults(
  defineProps<{
    modelValue?: Dayjs | IRangeDates
    range?: boolean
    min?: Dayjs
    max?: Dayjs
  }>(),
  { range: false },
)

const emit = defineEmits<{
  (e: 'select', value: Dayjs | IRangeDates): void
  (e: 'close'): void
}>()

const monthTitle = computed(() => formatMonthTitle(viewMonth.value))

/**
 * IMPORTANT:
 * Vue peut proxyfier des objets Dayjs -> dayjs.isDayjs() peut “croire” que c’est Dayjs,
 * puis Dayjs essaie clone() et plante.
 * On reconstruit donc systématiquement via dayjs(raw.$d ?? raw).
 */
const toDayjs = (value?: unknown): Dayjs | null => {
  if (!value) return null
  const raw = isProxy(value) ? toRaw(value) : value
  const base = (raw as any).$d ?? raw
  const d = dayjs(base as any)
  return d.isValid() ? d : null
}

const isRangeValue = (v: unknown): v is IRangeDates =>
  !!v && typeof v === 'object' && 'start' in (v as any) && 'end' in (v as any)

// --- Normalisation modelValue -> valeurs sûres Dayjs ---
const selectedSingle = computed<Dayjs | null>(() => {
  if (props.range) return null
  return toDayjs(props.modelValue)
})

const selectedRange = computed<{ start: Dayjs; end: Dayjs } | null>(() => {
  if (!props.range) return null
  const mvRaw = props.modelValue ? (isProxy(props.modelValue) ? toRaw(props.modelValue) : props.modelValue) : null
  if (!mvRaw || !isRangeValue(mvRaw)) return null

  const start = toDayjs(mvRaw.start)
  const end = toDayjs(mvRaw.end)
  if (!start || !end) return null

  return end.isBefore(start, 'day') ? { start: end, end: start } : { start, end }
})

// --- Mois affiché ---
const initViewMonth = () => {
  const r = selectedRange.value
  if (r) return r.start.startOf('month')
  const s = selectedSingle.value
  if (s) return s.startOf('month')
  return dayjs().startOf('month')
}

const viewMonth = ref<Dayjs>(initViewMonth())

watch([selectedSingle, selectedRange], () => {
  viewMonth.value = initViewMonth()
})

// --- Grille 6 semaines (42 jours), semaine commençant lundi ---
const startOfGrid = computed(() => {
  const first = viewMonth.value.startOf('month')
  const dow = (first.day() + 6) % 7 // dim(0)..sam(6) -> lun(0)..dim(6)
  return first.subtract(dow, 'day')
})

const days = computed(() => {
  const start = startOfGrid.value
  return Array.from({ length: 42 }, (_, i) => start.add(i, 'day'))
})

const isOutOfMonth = (d: Dayjs) => d.month() !== viewMonth.value.month()

const minD = computed(() => toDayjs(props.min))
const maxD = computed(() => toDayjs(props.max))

const isDisabled = (d: Dayjs) => {
  const mn = minD.value
  const mx = maxD.value
  if (mn && d.isBefore(mn, 'day')) return true
  if (mx && d.isAfter(mx, 'day')) return true
  return false
}

// --- Styles sélection ---
const isSelectedSingle = (d: Dayjs) => {
  const s = selectedSingle.value
  return !!s && d.isSame(s, 'day')
}

const isInSelectedRange = (d: Dayjs) => {
  const r = selectedRange.value
  if (!r) return false
  return (d.isSame(r.start, 'day') || d.isAfter(r.start, 'day')) &&
    (d.isSame(r.end, 'day') || d.isBefore(r.end, 'day'))
}

const isRangeEdge = (d: Dayjs) => {
  const r = selectedRange.value
  if (!r) return false
  return d.isSame(r.start, 'day') || d.isSame(r.end, 'day')
}

// --- Navigation mois ---
const prevMonth = () => {
  viewMonth.value = viewMonth.value.subtract(1, 'month')
}
const nextMonth = () => {
  viewMonth.value = viewMonth.value.add(1, 'month')
}

// --- Sélection (single / range) ---
const rangeDraftStart = ref<Dayjs | null>(null)

watch(
  () => props.range,
  () => {
    rangeDraftStart.value = null
  },
)

const onPick = (d: Dayjs) => {
  if (isDisabled(d)) return

  if (!props.range) {
    emit('select', d)
    emit('close')
    return
  }

  // Range: 1er clic => start (et end=start pour feedback immédiat)
  if (!rangeDraftStart.value) {
    rangeDraftStart.value = d
    emit('select', { start: d, end: d })
    return
  }

  // 2e clic => end (auto-tri)
  const start = rangeDraftStart.value
  const end = d
  const r = end.isBefore(start, 'day') ? { start: end, end: start } : { start, end }

  rangeDraftStart.value = null
  emit('select', r)
  emit('close')
}
</script>

<template>
  <div class="w-80 rounded-xl bg-white shadow-lg px-6 py-4 text-gray-800">
    <!-- Header -->
    <div class="flex items-center justify-between mb-2">
      <button type="button" class="px-2 py-1 rounded hover:bg-gray-200" @click="prevMonth">‹</button>
      <div class="font-medium">
        {{ monthTitle }}
      </div>
      <button type="button" class="px-2 py-1 rounded hover:bg-gray-200" @click="nextMonth">›</button>
    </div>

    <!-- Weekdays -->
    <div class="grid grid-cols-7 text-xs text-gray-800 mb-2">
      <div class="text-center">Lu</div>
      <div class="text-center">Ma</div>
      <div class="text-center">Me</div>
      <div class="text-center">Je</div>
      <div class="text-center">Ve</div>
      <div class="text-center">Sa</div>
      <div class="text-center">Di</div>
    </div>

    <!-- Days -->
    <div class="grid grid-cols-7 gap-1">
      <button
        v-for="d in days"
        :key="d.valueOf()"
        type="button"
        class="h-9 rounded text-sm"
        :disabled="isDisabled(d)"
        :class="[
          isOutOfMonth(d) && 'text-gray-400',
          isDisabled(d) && 'opacity-40 cursor-not-allowed',
          !isDisabled(d) && 'hover:bg-gray-200',

          // range background first (so edges can override)
          isInSelectedRange(d) && 'bg-blue-300',

          // edges / selected override
          isRangeEdge(d) && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-gray-800',
          isSelectedSingle(d) && 'bg-blue-600 text-white hover:bg-blue-600 hover:text-gray-800',
        ]"
        @click="onPick(d)"
      >
        {{ d.date() }}
      </button>
    </div>
  </div>
</template>
