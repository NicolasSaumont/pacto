// export type SelectOptionValue = string | number

// export interface ISelectOption {
//   label: string
//   value: SelectOptionValue
//   disabled?: boolean
// }

// export interface ISelectProps {
//   clearable?: boolean
//   disabled?: boolean
//   icon?: string
//   label?: string
//   loading?: boolean
//   modelValue?: string | number | (string | number)[] | null
//   multiple?: boolean
//   options: ISelectOption[]
//   placeholder?: string
//   theme?: TInputTheme
// }

export type Primitive = string | number
export type KeyOf<T> = Extract<keyof T, string>

export interface ISelectProps<TOption = any, TValue = Primitive> {
  modelValue?: TValue | TValue[] | null
  options: TOption[]

  multiple?: boolean
  clearable?: boolean
  disabled?: boolean
  loading?: boolean

  label?: string
  placeholder?: string
  theme?: TInputTheme
  icon?: string

  // ✅ objets complexes
  labelKey?: KeyOf<TOption>
  valueKey?: KeyOf<TOption>
  getOptionLabel?: (opt: TOption) => string
  getOptionValue?: (opt: TOption) => TValue
  getOptionDisabled?: (opt: TOption) => boolean

  maxChipsToShow?: number
}
