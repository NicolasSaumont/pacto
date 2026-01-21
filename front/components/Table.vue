<script setup lang="ts" generic="T extends { id: string | number }">

const props = withDefaults(
  defineProps<{
    columns: IColumn<T>[]
    data: T[]
    filter?: boolean
    loading?: boolean
  }>(),
  { 
    filter: false, 
    loading: false 
  }
)

const emit = defineEmits<{
  (e: 'row-click', row: T): void
}>()

const { t } = useI18n()

const {
  displayRows,
  getCellTitle,
  getCellValue,
  getColumnClass,
  getColumnStyle,
  search,
  sortColumn,
  sortOrder,
  toggleSort,
} = useTable(props)

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
                    v-if="sortColumn === column.key && sortOrder === sortOrderEnum.ASC"
                    icon="sort-down"
                    class="-mt-2 shrink-0"
                  />
                  <FontAwesomeIcon
                    v-else-if="sortColumn === column.key && sortOrder === sortOrderEnum.DESC"
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
              :title="!loading ? getCellTitle(row, column) : undefined"
              class="py-4 px-3"
              :class="getColumnClass(column)"
              @click="handleRowClick(row)"
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
