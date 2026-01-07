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

const getCellValue = (row: T, key: keyof T) => row[key]
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
              class="text-left py-2 mb-5"
            >
              {{ column.header }}
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
            v-for="(row, rowIndex) in filteredData" 
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

