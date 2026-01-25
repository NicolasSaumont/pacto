<script setup lang='ts'>
const {
  orderProductsColumns,
} = useOrders()

const orderStore = useOrdersStore()

const {
  order,
} = storeToRefs(orderStore)
</script>

<template>
  <div class="flex-1">
    <Table 
      :columns="orderProductsColumns"
      :data="order.products"
      :is-clickable="false"
    >
      <template #products="{ row }">
        <span>{{ row.product.name }}</span>
      </template>

      <template #quantity="{ row }">
        {{ row.product.name }}
      </template>
    </Table>
  </div>
</template>
