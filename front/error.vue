<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()

const router = useRouter()
const { t } = useI18n()

const is404 = computed(() => props.error.statusCode === 404)

const goBack = () => {
  if (import.meta.client && window.history.length > 1) {
    router.back()
  } else {
    clearError({ redirect: '/' })
  }
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="w-full max-h-full flex flex-col gap-6 items-center justify-center text-center">

      <Header>
        <template #title>
          {{ is404 ? t('error.title.404') : t('error.title.500') }}
        </template>
      </Header>

      <!-- Card -->
      <div
        class="bg-gray-900 p-8 rounded-2xl border border-gray-600 flex flex-col items-center gap-4 max-w-xl animate-[float_4s_ease-in-out_infinite]"
      >
        <div class="text-6xl select-none">
          {{ is404 ? '🧭' : '💥' }}
        </div>

        <p class="text-gray-300 text-lg">
          <span v-if="is404">
            {{ t('error.message.404') }}
          </span>
          <span v-else>
            {{ t('error.message.default') }}
          </span>
        </p>

        <p class="text-sm text-gray-500">
          {{ t('error.code', { errorCode: error.statusCode || 500 }) }}
        </p>

        <div class="flex gap-3 mt-4">
          <Button
            flat
            :label="t('common.go-back')"
            @click="goBack"
          />
          <Button
            :label="t('common.go-back-to-home')"
            @click="clearError({ redirect: MAIN })"
          />
        </div>
      </div>
    </div>
  </NuxtLayout>
</template>

<style scoped>
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}
</style>
