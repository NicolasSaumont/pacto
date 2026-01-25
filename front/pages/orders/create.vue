<script setup lang='ts'>
const { t } = useI18n()
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <Header>
      <template #title>
        <span>{{ t('order.new') }}</span>
      </template>
    </Header>
    <div class="flex flex-1 gap-4 min-h-0">
      <OrdersForm />
      <OrdersPreview />
    </div>
    <OrdersFooter />
  </div>
</template>