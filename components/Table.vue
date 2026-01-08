<script setup lang="ts" generic="T extends { id: string | number }">
import { useDebounce } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    columns: IColumn<T>[]
    data: T[]
    filter?: boolean
    loading?: boolean
  }>(),
  { filter: false, loading: false }
)

const emit = defineEmits<{
  (e: 'row-click', row: T): void
}>()

const { t } = useI18n()

const SKELETON_ROWS = 8

const search = ref('')
const debouncedSearch = useDebounce(search, INPUT_DEBOUNCE)

const sortColumn = ref<keyof T | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)

const dataColumns = computed(() =>
  props.columns.filter(isDataColumn)
)

const filteredData = computed(() => {
  if (props.loading) return props.data
  if (!props.filter) return props.data
  if (!debouncedSearch.value.trim()) return props.data

  const query = debouncedSearch.value.toLowerCase()

  return props.data.filter((row) =>
    dataColumns.value.some((column) => {
      if (column.searchable === false) return false
      const value = row[column.key]
      if (value == null) return false
      return String(value).toLowerCase().includes(query)
    })
  )
})

const sortedData = computed(() => {
  const data = [...filteredData.value]
  if (sortColumn.value && sortOrder.value) {
    data.sort((a, b) => {
      const key = sortColumn.value as keyof T
      const valA = a[key]
      const valB = b[key]
      if (valA == null) return 1
      if (valB == null) return -1

      if (typeof valA === 'number' && typeof valB === 'number') {
        return sortOrder.value === 'asc' ? valA - valB : valB - valA
      }

      const strA = String(valA).toLowerCase()
      const strB = String(valB).toLowerCase()
      return sortOrder.value === 'asc'
        ? strA.localeCompare(strB)
        : strB.localeCompare(strA)
    })
  }
  return data
})

const displayRows = computed(() => {
  if (!props.loading) return sortedData.value
  return Array.from({ length: SKELETON_ROWS }, (_, i) => ({ id: `skeleton-${i}` } as unknown as T))
})

const toggleSort = (column: IColumn<T>) => {
  if (props.loading) return
  if (!isDataColumn(column)) return
  if (!column.sortable) return

  const columnKey = column.key
  if (sortColumn.value !== columnKey) {
    sortColumn.value = columnKey
    sortOrder.value = 'asc'
  } else {
    if (sortOrder.value === 'asc') sortOrder.value = 'desc'
    else if (sortOrder.value === 'desc') {
      sortColumn.value = null
      sortOrder.value = null
    } else sortOrder.value = 'asc'
  }
}

const getCellValue = (row: T, key: keyof T) => row[key]

const getColumnStyle = (column: IColumn<T>) => {
  if (!column.size) return {}

  if (typeof column.size === 'number') {
    return { width: `${column.size}px` }
  }

  return { width: column.size }
}

const handleRowClick = (row: T) => {
  if (props.loading) return
  emit('row-click', row)
}
</script>

<template>
  <div class="bg-gray-900 p-6 rounded-2xl border border-gray-600 w-full h-full flex flex-col min-h-0">

    <div v-if="filter" class="flex justify-end mb-3 pr-4">
      <Input
        v-model="search"
        icon="magnifying-glass"
        :placeholder="t('common.search')"
        :disabled="loading"
      />
    </div>

    <div class="overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <table class="w-full table-fixed border-collapse">
        <thead class="sticky top-0 bg-gray-900 z-10">
          <tr>
            <th
              v-for="(column, colIndex) in columns"
              :key="isDataColumn(column) ? String(column.key) : `slot-${column.slot}-${colIndex}`"
              class="text-left py-2 px-3 select-none"
              :style="getColumnStyle(column)"
              :class="{ 'cursor-pointer': isDataColumn(column) && column.sortable && !loading }"
              @click="toggleSort(column)"
            >
              <div class="flex gap-2 items-center">
                <span class="truncate">{{ column.header }}</span>
              
                <template v-if="isDataColumn(column) && column.sortable && !loading">
                  <FontAwesomeIcon
                    v-if="sortColumn === column.key && sortOrder === 'asc'"
                    icon="sort-down"
                    class="-mt-2 shrink-0"
                  />
                  <FontAwesomeIcon
                    v-else-if="sortColumn === column.key && sortOrder === 'desc'"
                    icon="sort-up"
                    class="-mb-2 shrink-0"
                  />
                </template>
              </div>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="row in displayRows"
            :key="row.id"
            :class="loading ? '' : 'hover:cursor-pointer hover:bg-gray-800'"
          >
            <td
              v-for="(column, colIndex) in columns"
              :key="isDataColumn(column) ? String(column.key) : `slot-${column.slot}-${colIndex}`"
              :style="getColumnStyle(column)"
              class="py-4 px-3"
              @click="isDataColumn(column) && handleRowClick(row)"
            >
              <template v-if="loading">
                <div class="animate-pulse">
                  <div class="h-4 rounded bg-gray-800 w-3/4" />
                </div>
              </template>
            
              <template v-else>
                <span v-if="isDataColumn(column)" class="block truncate">
                  {{ getCellValue(row, column.key) }}
                </span>
              
                <!-- colonne slot -->
                <template v-else>
                  <div @click.stop>
                    <slot :name="column.slot" :row="row" />
                  </div>
                </template>
              </template>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
