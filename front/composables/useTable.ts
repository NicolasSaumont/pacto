import { useDebounce } from '@vueuse/core'
import dayjs from 'dayjs'

export function useTable<T extends { id: string | number }>(props: ITableProps<T>) {
  const SKELETON_ROWS = 8

  const search = ref('')
  const debouncedSearch = useDebounce(search, INPUT_DEBOUNCE)

  const sortColumn = ref<keyof T | null>(null)
  const sortOrder = ref<sortOrderEnum | null>(null)
  const defaultSortApplied = ref(false)

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
          return sortOrder.value === sortOrderEnum.ASC ? valA - valB : valB - valA
        }

        const strA = String(valA).toLowerCase()
        const strB = String(valB).toLowerCase()
        return sortOrder.value === sortOrderEnum.ASC
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

  const getCellTitle = (row: T, column: IColumn<T>) => {
    if (!column.title) return undefined

    // --- DATA COLUMN ---
    if (isDataColumn(column)) {
      const rawValue = row[column.key]

      if (column.title === true) {
        const displayed = getCellValue(row, column.key)
        return displayed != null ? String(displayed) : undefined
      }

      if (typeof column.title === 'string') {
        return column.title
      }

      return column.title(row, rawValue)
    }

    // --- SLOT COLUMN ---
    if (column.title === true) return undefined
    if (typeof column.title === 'string') return column.title
    return column.title(row, undefined)
  }

  const getCellValue = (row: T, key: keyof T) => {
    const value = row[key]

    if (dayjs.isDayjs(value)) {
      return value.format(DATE_FORMAT)
    }

    return value
  }

  const getColumnClass = (column: IColumn<T>) => {
    return 'customClasses' in column ? column.customClasses : undefined
  }

  const getColumnStyle = (column: IColumn<T>) => {
    if (!('size' in column) || !column.size) return {}

    if (typeof column.size === 'number') return { width: `${column.size}px` }
    return { width: column.size }
  }

  const toggleSort = (column: IColumn<T>) => {
    if (props.loading) return
    if (!isDataColumn(column)) return
    if (!column.sortable) return

    const columnKey = column.key

    if (sortColumn.value !== columnKey) {
      sortColumn.value = columnKey
      sortOrder.value = sortOrderEnum.ASC
    } else {
      if (sortOrder.value === sortOrderEnum.ASC) sortOrder.value = sortOrderEnum.DESC
      else if (sortOrder.value === sortOrderEnum.DESC) {
        sortColumn.value = null
        sortOrder.value = null
      } else sortOrder.value = sortOrderEnum.ASC
    }
  }

  // Applique le tri par défaut une seule fois, dès que les colonnes sont prêtes, sans jamais écraser un tri déjà défini
  watch(
    // On observe les colonnes et l'état de loading :
    // - les colonnes peuvent arriver async
    // - on ne veut pas trier tant que la table est en loading
    () => [props.columns, props.loading] as const,

    () => {
      // ❌ Tant que la table charge, on ne touche pas au tri
      if (props.loading) return

      // ❌ Le tri par défaut a déjà été appliqué une fois
      //    (évite de réinitialiser le tri après un clic utilisateur)
      if (defaultSortApplied.value) return

      // ❌ Un tri est déjà en place (ex: initialisé ailleurs)
      //    → on respecte l'existant
      if (sortColumn.value || sortOrder.value) return

      // 🔍 Recherche de la première colonne déclarée avec sortByDefault
      const defaultCol = dataColumns.value.find(
        (column) => column.sortable && column.sortByDefault != null
      )
      if (!defaultCol) return

      // ✅ Initialisation du tri par défaut
      sortColumn.value = defaultCol.key
      sortOrder.value = defaultCol.sortByDefault ?? null

      // 🔒 Marque le tri par défaut comme appliqué
      defaultSortApplied.value = true
    }, 
    
    { immediate: true, deep: true }
  )

  return {
    displayRows,
    search,
    sortColumn,
    sortOrder,
    toggleSort,
    getCellTitle,
    getCellValue,
    getColumnClass,
    getColumnStyle,
  }
}
