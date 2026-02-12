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

const isManageProductModalVisible = ref(false)

const quantityModel = (row: { product: IProduct }) =>
  computed<number>({
    get: () => {
      const item = order.value.items.find(
        item => item.product && item.product.id === row.product.id
      )
      return item?.quantity ?? 0
    },
    set: (value) => {
      const item = getOrCreateOrderItem(row.product)

      if (!Number.isFinite(value)) {
        item.quantity = 0
        return
      }

      const number = Number(value)
      item.quantity = Number.isFinite(number) ? number : 0
    },
  })

const selectedCustomerProducts = computed(() => {
  return customer.value.products.map((product: IProduct) => {
    const existingItem = order.value.items.find(
      item => item.product && item.product.id === product.id
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

const getOrCreateOrderItem = (product: IProduct) => {
  let item = order.value.items.find(
    item => item.product && item.product.id === product.id
  )

  if (!item) {
    item = {
      product,
      quantity: 0,
    }
    order.value.items.push(item)
  }

  return item
}

const handleAddProductClick = () => {
  isManageProductModalVisible.value = true
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

    <Modal 
      v-model="isManageProductModalVisible"
      :title="t('common.products-management')"
    >
      <template #content>
        <CustomersProducts class="flex-1 min-h-0 text-gray-100" />
      </template>

      <template #footer>
        <Button
          :label="t('common.close')"
          outline
          @click="isManageProductModalVisible = false"
        />
      </template>
    </Modal>
  </div>
</template>
