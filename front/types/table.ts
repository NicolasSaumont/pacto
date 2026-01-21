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

export interface IDataColumn<T> {
  customClasses?: string
  header: string
  key: keyof T
  searchable?: boolean
  size?: TColumnSize
  sortable?: boolean
  sortByDefault?: sortOrderEnum | null
  title?: TColumnTitle<T>
}

export interface ISlotColumn<T> {
  customClasses?: string
  header: string
  slot: string            // ex: "actions"
  size?: TColumnSize
  title?: TColumnTitle<T>
}

export type IColumn<T> = IDataColumn<T> | ISlotColumn<T>

export const isDataColumn = <T>(column: IColumn<T>): column is IDataColumn<T> =>
  'key' in column

export const isSlotColumn = <T>(column: IColumn<T>): column is ISlotColumn<T> =>
  'slot' in column