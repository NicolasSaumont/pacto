export interface IButtonProps {
  color?: TButtonColor
  disabled?: boolean
  flat?: boolean
  outline?: boolean
  icon?: string
  label?: string
  type?: 'button' | 'submit' | 'reset'
}

export type TButtonColor = 'primary' | 'red'
