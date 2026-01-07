<script setup lang='ts' generic="T extends { id: string | number }">
defineProps<{
  columns: IColumn<T>[]
  data: T[]
}>()

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

          <tr>
            <th class="pr-4">
              <slot name="header-right" />
            </th>
          </tr>
        </thead>

        <tbody>
          <tr 
            v-for="(row, rowIndex) in data" 
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

