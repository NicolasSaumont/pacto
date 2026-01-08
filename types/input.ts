export interface IInputProps {
  icon?: string
  modelValue?: string
  label?: string
  placeholder?: string
  theme?: TInputTheme
}

export type TInputTheme = 'dark' | 'light'
