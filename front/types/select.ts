export type SelectOptionValue = string | number

export interface ISelectOption {
  label: string
  value: SelectOptionValue
  disabled?: boolean
}

export interface ISelectProps {
  clearable?: boolean
  disabled?: boolean
  icon?: string
  label?: string
  loading?: boolean
  modelValue?: string | number | (string | number)[] | null
  multiple?: boolean
  options: ISelectOption[]
  placeholder?: string
  theme?: TInputTheme
}
