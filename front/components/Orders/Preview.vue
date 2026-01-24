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
  <div class="flex-1 bg-gray-900 p-6 rounded-2xl border border-gray-600">
    <Table 
      :columns="orderProductsColumns"
      :data="order.products"
    />
  </div>
</template>
