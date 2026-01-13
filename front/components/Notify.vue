
<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'

const props = withDefaults(
  defineProps<{
    timeout?: number
  }>(),
  {
    timeout: NOTIFICATION_DEFAULT_DURATION,
  }
)

const {
  notifications
} = useNotify()

const hoverNotify = (idTimeout: number | undefined) => {
  if (idTimeout) {
    clearTimeout(idTimeout)
  }
}

const deleteNotify = (id: string | number, timeout?: number) => {
  const index = notifications.findIndex((notification) => notification.id === id)
  if (index === -1) return

  const delayMs = timeout ?? props.timeout

  // évite d'empiler plusieurs timeouts
  const current = notifications[index]

  if (!current) return 

  if (typeof current.idTimeout === 'number') clearTimeout(current.idTimeout)

  current.idTimeout = window.setTimeout(() => {
    const index = notifications.findIndex((notification) => notification.id === id)
    if (index !== -1) notifications.splice(index, 1)
  }, delayMs)
}

const tailwindClassesByState = (state: TNotifyState, style: INotification['style'] = 'color') => {
  const isWhite = style === 'white'

  const map: Record<TNotifyState, string> = {
    success: isWhite
      ? 'bg-white text-green-900 border-green-600'
      : 'bg-green-800 text-green-50 border-green-500',

    error: isWhite
      ? 'bg-white text-red-800 border-red-600'
      : 'bg-red-800 text-red-50 border-red-500',

    warning: isWhite
      ? 'bg-white text-yellow-700 border-yellow-600'
      : 'bg-yellow-700 text-yellow-50 border-yellow-500',

    info: isWhite
      ? 'bg-white text-blue-800 border-blue-600'
      : 'bg-blue-800 text-blue-50 border-blue-500',
  }

  return map[state]
}

onUnmounted(() => {
  for (const notif of notifications) {
    if (typeof notif.idTimeout === 'number') clearTimeout(notif.idTimeout)
  }
})
</script>

<template>
  <div class="fixed top-4 right-4 z-[9999] w-[360px] max-w-[calc(100vw-2rem)] pointer-events-none">
    <transition-group name="slide-fade" tag="div" class="flex flex-col gap-3">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        :itemid="notification.id + ''"
        class="pointer-events-auto flex items-start gap-2 p-6 rounded-lg shadow-xl border-l-4"
        :class="tailwindClassesByState(notification.state, notification.style)"
        @mouseover="hoverNotify(notification.idTimeout)"
        @mouseleave="deleteNotify(notification.id)"
        @click.stop
        @pointerdown.stop
      >
        <div class="flex flex-row items-start gap-4 w-[20.25rem]">
          <FontAwesomeIcon
            v-if="notification.icon"
            :icon="notification.icon"
            class="text-xl"
          />
          <div class="text-sm flex flex-col items-start gap-1">
            <span class="font-semibold">{{ notification.title }}</span>
            <span v-if="notification.content">{{ notification.content }}</span>
          </div>
        </div>

        <FontAwesomeIcon
          icon="xmark"
          class="cursor-pointer"
          @click.stop="deleteNotify(notification.id, 1)"
          @pointerdown.stop
        />
      </div>
    </transition-group>
  </div>
</template>


