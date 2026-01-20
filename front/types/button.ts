export interface IButtonProps {
  color?: ButtonColorEnum
  disabled?: boolean
  flat?: boolean
  outline?: boolean
  icon?: string
  label?: string
  loading?: boolean
  type?: 'button' | 'submit' | 'reset'
}

export enum ButtonColorEnum {
  PRIMARY = 'primary',
  RED = 'red',
  SECONDARY = 'secondary',
  WHITE = 'white',
}
