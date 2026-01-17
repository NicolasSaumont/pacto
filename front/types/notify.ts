export type TNotifyState = 'success' | 'error' | 'warning' | 'info'
export type TNotifyStyle = 'color' | 'white'

export interface INotification {
  id: string | number
  state: TNotifyState
  style?: TNotifyStyle
  title?: string
  content?: string
  icon?: string
  idTimeout?: number
}

export interface INotifyPayload extends Omit<INotification, 'id' | 'idTimeout'> {
  uniqueId?: string | number
  timeout?: number
}
