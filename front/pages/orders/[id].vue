<script setup lang='ts'>
const { t } = useI18n()

const { loadOrder } = useOrders()

onMounted(async () => { 
  await loadOrder()
})
</script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <Header>
      <template #title>
        <span>{{ t('order.edit') }}</span>
      </template>
    </Header>
    <div class="flex flex-1 gap-4 min-h-0">
      <OrdersForm :mode="ModeEnum.EDITION" />
      <OrdersPreview />
    </div>
    <OrdersFooter :mode="ModeEnum.EDITION" />
  </div>
</template>