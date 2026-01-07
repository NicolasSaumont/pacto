export interface IColumn<T> {
  header: string
  key: keyof T
  sortable?: boolean
}