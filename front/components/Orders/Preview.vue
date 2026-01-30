<script setup lang='ts'>
const {
  orderProductsColumns,
} = useOrders()

const orderStore = useOrdersStore()

const {
  isOrderGettingFetch,
  order,
} = storeToRefs(orderStore)
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
          v-model="row.quantity"
          is-number-input
          theme="light"
        />
      </template>
    </Table>
  </div>
</template>
