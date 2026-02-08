import { Dayjs } from 'dayjs'

export interface IDatePickerProps<T> {
  disabled?: boolean
  displayedFormat?: string
  label?: string
  loading?: boolean
  max?: Dayjs
  min?: Dayjs
  modelValue?: T
  placeholder?: string
  range?: boolean
  required?: boolean
  theme?: TInputTheme
}

export interface IRangeDates {
  start: Dayjs
  end: Dayjs
}

export type DateLike = Dayjs | Date | IRangeDates | string | null | undefined
