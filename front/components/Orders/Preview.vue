<script setup lang='ts'>
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
</script>

<template>
  <div class="flex-1">
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
