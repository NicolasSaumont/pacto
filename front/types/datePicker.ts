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

export type TInputTheme = 'dark' | 'light'
