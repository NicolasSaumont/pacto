<script setup lang="ts">
const isVisible = defineModel<boolean>()

const props = withDefaults(
  defineProps<{
    title: string
    description?: string
    isConfirmationModal?: boolean
  }>(),
  {
    isConfirmationModal: false,
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

defineOptions({
  inheritAttrs: false,
})

const { t } = useI18n()
const attrs = useAttrs()

const confirmButtonRef = ref<HTMLButtonElement | null>(null)

const onConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const onCancel = () => {
  isVisible.value = false
}

const onKeyDown = (e: KeyboardEvent) => {
  if (!isVisible.value) return

  switch (e.key) {
    case 'Enter':
      if (props.isConfirmationModal) {
        e.preventDefault()
        onConfirm()
      }
      break

    case 'Escape':
      e.preventDefault()
      onCancel()
      break
  }
}

watch(isVisible, async (visible) => {
  if (visible) {
    await nextTick()
    confirmButtonRef.value?.focus()
    document.addEventListener('keydown', onKeyDown)
  } else {
    document.removeEventListener('keydown', onKeyDown)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="isVisible"
      class="fixed inset-0 z-50 flex items-center justify-center"
    >
      <!-- Overlay -->
      <div
        class="absolute inset-0 bg-black/50"
        @click="onCancel"
      />

      <!-- Modal -->
      <div
        class="relative z-10 flex max-h-[80vh] flex-col rounded-lg bg-white p-6 shadow-xl"
        v-bind="attrs"
      >
        <!-- Close button -->
        <FontAwesomeIcon
          icon="xmark"
          class="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black"
          @click="onCancel"
        />

        <!-- Header -->
        <div class="shrink-0 pb-4">
          <FontAwesomeIcon
            icon="xmark"
            class="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black"
            @click="onCancel"
          />

          <span class="text-lg font-semibold text-gray-800">
            {{ title }}
          </span>
        </div>

        <!-- Content -->
        <div class="flex-1 overflow-y-auto py-4 text-gray-800">
           <span
              v-if="description"
              class="mt-1 block text-sm text-gray-600"
            >
              {{ description }}
            </span>
          <slot v-else name="content" />
        </div>

        <!-- Actions -->
        <div class="shrink-0 pt-4 flex justify-end">
          <div v-if="isConfirmationModal" class="flex gap-3">
            <Button
              :label="t('common.cancel')"
              outline
              @click="onCancel"
            />
            <Button
              ref="confirmButtonRef"
              :label="t('common.confirm')"
              @click="onConfirm"
            />
          </div>

          <slot v-else name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>
