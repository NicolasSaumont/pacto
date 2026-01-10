export interface IInputProps {
  disabled?: boolean
  icon?: string
  modelValue?: string
  label?: string
  loading?: boolean
  placeholder?: string
  theme?: TInputTheme
}

export type TInputTheme = 'dark' | 'light'
