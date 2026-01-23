import { Dayjs } from 'dayjs'

export interface IDatePickerProps {
  disabled?: boolean
  icon?: string
  modelValue?: Dayjs
  label?: string
  loading?: boolean
  placeholder?: string
  theme?: TInputTheme
}

export interface IRangeDates {
  start: Dayjs
  end: Dayjs
}

export type DateLike = Dayjs | Date | string | null | undefined
