<script setup lang="ts">
const isVisible = defineModel<boolean>()

const props = withDefaults(
  defineProps<{
    title: string
    description: string
    isConfirmationModal?: boolean
  }>(),
  {
    isConfirmationModal: false,
  }
)

const emit = defineEmits<{
  (e: 'confirm'): void
}>()

const { t } = useI18n()

const onConfirm = () => {
  emit('confirm')
  isVisible.value = false
}

const onCancel = () => {
  isVisible.value = false
}
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
        class="relative z-10 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
      >
        <!-- Close button -->
        <FontAwesomeIcon
          icon="xmark"
          class="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-black"
          @click="onCancel"
        />

        <!-- Content -->
        <div class="flex flex-col gap-4 text-gray-800">
          <span class="text-lg font-semibold">{{ title }}</span>
          <span>{{ description }}</span>
        </div>

        <!-- Actions -->
        <div 
          v-if="isConfirmationModal"
          class="mt-6 flex justify-end gap-3"
        >
          <Button
            :label="t('common.cancel')"
            outline
            @click="onCancel"
          />
          <Button
            :label="t('common.confirm')"
            @click="onConfirm"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>
