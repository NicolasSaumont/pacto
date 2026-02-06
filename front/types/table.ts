export interface ITableProps<T> {
  columns: IColumn<T>[]
  data: T[]
  filter?: boolean
  loading?: boolean
}

export type TColumnSize =
  | number          // px
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | 'auto'

export type TColumnTitle<T> =
  | boolean
  | string
  | ((row: T, value: unknown) => string)

export enum sortOrderEnum {
  ASC = 'ascending',
  DESC = 'descending'
}

type TColumnValue = string | number | null | undefined

interface IColumnBase<T> {
  customClasses?: string
  header: string
  isClickable?: boolean
  searchable?: boolean
  size?: TColumnSize
  title?: TColumnTitle<T>
}

export interface IDataColumn<T> extends IColumnBase<T> {
  key: keyof T
  sortable?: boolean
  sortByDefault?: sortOrderEnum | null
}

export interface ISlotColumn<T> extends IColumnBase<T> {
  key?: never
  searchValue?: (row: T) => TColumnValue
  slot: string          // ex: "actions"
  sortable?: boolean
  sortByDefault?: sortOrderEnum | null
  sortValue?: (row: T) => TColumnValue
}

export type IColumn<T> = IDataColumn<T> | ISlotColumn<T>

export const isDataColumn = <T>(column: IColumn<T>): column is IDataColumn<T> =>
  'key' in column

export const isSlotColumn = <T>(column: IColumn<T>): column is ISlotColumn<T> =>
  'slot' in column