export interface IInputProps {
  clearable?: boolean
  disabled?: boolean
  icon?: string
  iconClickable?: boolean
  isNumberInput?: boolean
  label?: string
  loading?: boolean
  modelValue?: string | number
  placeholder?: string
  readonly?: boolean
  theme?: TInputTheme
}

export type TInputTheme = 'dark' | 'light'
