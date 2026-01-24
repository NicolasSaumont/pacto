<script setup lang='ts'>
const { t } = useI18n()
const { notify } = useNotify()

const orderStore = useOrdersStore()

const {
  order,
} = storeToRefs(orderStore)

const handleAddProductClick = () => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
}
</script>

<template>
  <form class="flex flex-col gap-6 flex-1 bg-gray-900 p-6 rounded-2xl border border-gray-600">
    <div>Select client</div>
    <DatePicker 
      v-model="order.orderDate"
      :label="t('order.date')"
      :min="order.orderDate"
    />
    <DatePicker 
      v-model="order.deliveryDate"
      :label="t('order.delivery-date')"
      :min="order.orderDate"
    />
    <div class="flex gap-4 items-center">
      <div>Select multiple produit</div>
      <Button
        icon="plus"
        @click="handleAddProductClick"
      />
    </div>
    <div class="flex-1 min-h-0">
      <TextArea 
        v-model="order.comment"
        :label="t('common.comments', 2)" 
        class="h-full" 
      />
    </div>
  </form>
</template>
