<script setup lang='ts'>
const { t } = useI18n()

// const { withNotify } = useNotifyAction()
const { notify } = useNotify()

const {
  columns,
  // isDeleteCustomerConfirmationModalVisible,
  loadOrders,
} = useOrders()

const ordersStore = useOrdersStore()

// const {
//   deleteCustomer,
//   setCustomers,
// } = ordersStore

const { 
  isOrderGettingFetch,
  orders,
  searchDates,
} = storeToRefs(ordersStore)

// const customerToDelete = ref<ICustomer | null>(null)

// const handleDeleteCustomerClick = async () => {
//   if (!customerToDelete.value) return

//   const customerId = customerToDelete.value.id.toString()

//   await withNotify(
//     async () => {
//       await deleteCustomer(customerId)
//       await setCustomers()
//     },
//     {
//       successContent: t('product.api.delete.success-message'),
//       errorContent: t('product.api.delete.error-message'),
//     }
//   )
  
//   customerToDelete.value = null
//   isDeleteCustomerConfirmationModalVisible.value = false
// }

const handleDuplicateOrderClick = (row: IOrder) => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
  // customerToDelete.value = row
  // isDeleteCustomerConfirmationModalVisible.value = true
}

const handleOpenDeleteOrderConfirmationModalClick = (row: IOrder) => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
  // customerToDelete.value = row
  // isDeleteCustomerConfirmationModalVisible.value = true
}

const handleRowClick = (row: IOrder) => {
  navigateTo(`/orders/${row.id}`)
}

onMounted(() => loadOrders(searchDates.value))
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #header-right>
        <Button 
          :label="t('orders.add-order')" 
          @click="navigateTo(ORDERS_CREATE_URL)"
        />
      </template>
    </Header>

    <div class="flex gap-6 items-end">
      <DatePicker
        v-model="searchDates"
        :label="t('common.dates', 2)"
        range
        theme="light"
      />
    </div>

    <Table 
      :columns="columns" 
      :data="orders"
      filter
      :loading="isOrderGettingFetch"
      @row-click="handleRowClick"
    >
      <template #products="{ row }">
        {{ row.products.length }}
      </template>

      <template #actions="{ row }">
        <div class="flex gap-2 justify-center">
          <Button 
            flat
            icon="copy" 
            :title="t('common.duplicate')"
            @click.stop="handleDuplicateOrderClick(row)"
          />
          <Button 
            :color="ButtonColorEnum.RED"
            flat
            icon="trash" 
            :title="t('common.delete')"
            @click.stop="handleOpenDeleteOrderConfirmationModalClick(row)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>