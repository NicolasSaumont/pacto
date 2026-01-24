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
    >
      <template #products="{ row }">
        {{ row.product.name }}
      </template>
    </Table>
  </div>
</template>
