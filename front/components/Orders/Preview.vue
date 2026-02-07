<script setup lang='ts'>
const { t } = useI18n()
const { notify } = useNotify()

const {
  orderProductsColumns,
} = useOrders()

const customerStore = useCustomersStore()
const orderStore = useOrdersStore()

const { customer } = storeToRefs(customerStore)

const {
  isOrderGettingFetch,
  order,
  selectedCustomerId,
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

const selectedCustomerProducts = computed(() => {
  return customer.value.products.map((product: IProduct) => {
    const existingItem = order.value.items.find(
      item => item.product.id === product.id
    )

    return {
      id: existingItem?.id,
      product,
      quantity: existingItem?.quantity ?? 0,
    }
  })
  .sort((a, b) =>
    a.product.name.localeCompare(b.product.name, 'fr', {
      sensitivity: 'base',
    })
  )
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
      :disabled="isOrderGettingFetch || !selectedCustomerId"
      class="absolute right-5 top-5 z-50"
      @click="handleAddProductClick"
    />
    
    <Table 
      :columns="orderProductsColumns"
      :data="selectedCustomerProducts"
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
