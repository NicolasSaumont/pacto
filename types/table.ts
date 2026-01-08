export type ColumnSize =
  | number          // px
  | `${number}px`
  | `${number}rem`
  | `${number}%`
  | 'auto'

export interface IDataColumn<T> {
  header: string
  key: keyof T
  searchable?: boolean
  size?: ColumnSize
  sortable?: boolean
}

export interface ISlotColumn {
  header: string
  slot: string // ex: "actions"
  size?: ColumnSize
}

export type IColumn<T> = IDataColumn<T> | ISlotColumn

export const isDataColumn = <T>(column: IColumn<T>): column is IDataColumn<T> =>
  'key' in column

export const isSlotColumn = <T>(column: IColumn<T>): column is ISlotColumn =>
  'slot' in column