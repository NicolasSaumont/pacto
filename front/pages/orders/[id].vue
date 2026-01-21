<script setup lang='ts'>
const { t } = useI18n()
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <Header>
      <template #title>
        {{ t('order.edit') }}
      </template>
    </Header>
    <div class="flex flex-1 gap-4 min-h-0">
      <OrdersForm />
      <OrdersPreview />
    </div>
    <OrdersFooter />
  </div>
</template>