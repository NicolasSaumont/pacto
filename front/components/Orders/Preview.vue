<script setup lang='ts'>
const { t } = useI18n()
const { notify } = useNotify()

const {
  orderProductsColumns,
} = useOrders()

const orderStore = useOrdersStore()

const {
  isOrderGettingFetch,
  order,
} = storeToRefs(orderStore)

const quantityModel = (row: { quantity: number | null }) => computed<number>({
  get: () => {
    return typeof row.quantity === 'number' ? row.quantity : 0
  },
  set: (value: any) => {
    if (value === '' || value === null || value === undefined) {
      row.quantity = 0
      return
    }

    const number = Number(value)
    row.quantity = Number.isFinite(number) ? number : 0
  },
})

const handleAddProductClick = () => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
}
</script>

<template>
  <div class="relative flex-1">
    <Button
      icon="plus"
      :disabled="isOrderGettingFetch"
      class="absolute right-5 top-5 z-50"
      @click="handleAddProductClick"
    />
    
    <Table 
      :columns="orderProductsColumns"
      :data="order.items"
      :is-clickable="false"
      :loading="isOrderGettingFetch"
    >
      <template #items="{ row }">
        <span>{{ row.product.name }}</span>
      </template>

      <template #quantity="{ row }">
        <Input 
          v-model="quantityModel(row).value"
          is-number-input
          theme="light"
        />
      </template>
    </Table>
  </div>
</template>
