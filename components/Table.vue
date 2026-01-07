<script setup lang='ts' generic="T extends { id: string | number }">
import { useDebounce } from '@vueuse/core'

const props = withDefaults(
  defineProps<{
    columns: IColumn<T>[]
    data: T[]
    filter?: boolean
  }>(),
  {
    filter: false,
  }
)

const { t } = useI18n()

const search = ref('')
const debouncedSearch = useDebounce(search, INPUT_DEBOUNCE)

const sortColumn = ref<keyof T | null>(null)
const sortOrder = ref<'asc' | 'desc' | null>(null)

const filteredData = computed(() => {
  if (!props.filter) return props.data
  if (!debouncedSearch.value.trim()) return props.data

  const query = debouncedSearch.value.toLowerCase()

  return props.data.filter((row) =>
    props.columns.some((column) => {
      const value = row[column.key]
      if (value == null) return false

      return String(value).toLowerCase().includes(query)
    })
  )
})

const sortedData = computed(() => {
  let data = [...filteredData.value] // filteredData déjà filtré par search

  if (sortColumn.value && sortOrder.value) {
    data.sort((a: T, b: T) => {
      const key = sortColumn.value as keyof T // ✅ assure TS que c’est une clé de T
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

const getCellValue = (row: T, key: keyof T) => row[key]

const toggleSort = (column: IColumn<T>) => {
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

</script>

<template>
  <div class="bg-gray-900 p-6 rounded-2xl border border-gray-600 w-full h-full flex flex-col min-h-0">
    <div class="overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <table class="w-full border-collapse">
        <thead class="sticky top-0 bg-gray-900 z-10 flex justify-between">
          <tr>
            <th
              v-for="column in columns"
              :key="String(column.key)"
              class="text-left py-2 px-3 flex gap-2 items-center select-none"
              :class="{ 'cursor-pointer': column.sortable }"
              @click="toggleSort(column)"
            >
              <span>{{ column.header }}</span>

              <FontAwesomeIcon
                v-if="column.sortable && sortColumn === column.key && sortOrder === 'asc'"
                icon="sort-down"
                class="-mt-2"
              />
              <FontAwesomeIcon
                v-else-if="column.sortable && sortColumn === column.key && sortOrder === 'desc'"
                icon="sort-up"
                class="-mb-2"
              />
            </th>
          </tr>

          <tr v-if="filter">
            <th class="pr-4">
              <Input
                v-model="search"
                icon="magnifying-glass"
                :placeholder="t('common.search')"
              />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="(row, rowIndex) in sortedData" 
            :key="row.id"
            class="hover:cursor-pointer hover:bg-gray-800"
          >
            <td
              v-for="column in columns"
              :key="String(column.key)"
              class="py-4 px-3"
              :class="{
                'border-t border-gray-800': rowIndex !== 0,
                'border-b border-gray-800': rowIndex !== data.length - 1,
              }"
            >
              {{ getCellValue(row, column.key) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

