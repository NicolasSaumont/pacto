export type Primitive = string | number
export type KeyOf<T> = Extract<keyof T, string>

export interface ISelectProps<TOption = any, TValue = Primitive> {
  clearable?: boolean
  disabled?: boolean
  getOptionDisabled?: (opt: TOption) => boolean
  getOptionLabel?: (opt: TOption) => string
  getOptionValue?: (opt: TOption) => TValue
  filter?: boolean
  filterFn?: (option: OptionT, query: string) => boolean
  icon?: string
  label?: string
  labelKey?: KeyOf<TOption>
  loading?: boolean
  modelValue?: TValue | TValue[] | null
  multiple?: boolean
  options: TOption[]
  placeholder?: string
  required?: boolean
  theme?: TInputTheme
  valueKey?: KeyOf<TOption>
}
