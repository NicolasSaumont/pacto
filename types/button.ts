export interface IButtonProps {
  color?: TButtonColor
  disabled?: boolean
  flat?: boolean
  outline?: boolean
  icon?: string
  label?: string
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export type TButtonColor = 'primary' | 'red'
