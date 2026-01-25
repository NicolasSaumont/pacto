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
        <Input 
          v-model="row.quantity"
          is-number-input
          theme="light"
        />
      </template>
    </Table>
  </div>
</template>
