const notificationData = reactive({
  notifications: [] as INotification[],
})

export function useNotify() {
  const defaultIconByState: Record<TNotifyState, string> = {
    success: 'circle-check',
    error: 'circle-xmark',
    warning: 'triangle-exclamation',
    info: 'circle-info',
  }

  const randomId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`

  const dismiss = (id: string | number) => {
    const idx = notificationData.notifications.findIndex((n) => n.id === id)
    if (idx !== -1) notificationData.notifications.splice(idx, 1)
  }

  const scheduleDismiss = (id: string | number, delayMs: number) =>
    window.setTimeout(() => dismiss(id), delayMs)

  const notify = (payload: INotifyPayload): string | number => {
    const id = payload.uniqueId ?? randomId()
    const dismissDelayMs =
      payload.timeout && payload.timeout > 0 ? payload.timeout : 5000

    const icon = payload.icon ?? defaultIconByState[payload.state]

    const existing = notificationData.notifications.find((n) => n.id === id)

    if (existing) {
      if (typeof existing.idTimeout === 'number') clearTimeout(existing.idTimeout)

      Object.assign(existing, {
        ...payload,
        icon,
        idTimeout: scheduleDismiss(id, dismissDelayMs),
      })

      return id
    }

    notificationData.notifications.push({
      id,
      ...payload,
      icon,
      idTimeout: scheduleDismiss(id, dismissDelayMs),
    })

    return id
  }

  return {
    dismiss,
    notifications: notificationData.notifications,
    notify,
  }
}
