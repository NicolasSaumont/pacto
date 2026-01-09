export interface IInputProps {
  disabled?: boolean
  icon?: string
  modelValue?: string
  label?: string
  placeholder?: string
  theme?: TInputTheme
}

export type TInputTheme = 'dark' | 'light'
