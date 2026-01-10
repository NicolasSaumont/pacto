import { useDebounce } from '@vueuse/core'

export function useTable<T extends { id: string | number }>(props: ITableProps<T>) {
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
    return Array.from(
      { length: SKELETON_ROWS },
      (_, i) => ({ id: `skeleton-${i}` } as unknown as T)
    )
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
    if (!('size' in column) || !column.size) return {}

    if (typeof column.size === 'number') return { width: `${column.size}px` }
    return { width: column.size }
  }

  return {
    displayRows,
    search,
    sortColumn,
    sortOrder,
    toggleSort,
    getCellValue,
    getColumnStyle,
  }
}
