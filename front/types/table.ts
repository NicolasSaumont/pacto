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

export enum sortOrderEnum {
  ASC = 'ascending',
  DESC = 'descending'
}

export interface IDataColumn<T> {
  header: string
  key: keyof T
  searchable?: boolean
  size?: TColumnSize
  sortable?: boolean
  sortByDefault?: sortOrderEnum | null
}

export interface ISlotColumn {
  header: string
  slot: string // ex: "actions"
  size?: TColumnSize
}

export type IColumn<T> = IDataColumn<T> | ISlotColumn

export const isDataColumn = <T>(column: IColumn<T>): column is IDataColumn<T> =>
  'key' in column

export const isSlotColumn = <T>(column: IColumn<T>): column is ISlotColumn =>
  'slot' in column