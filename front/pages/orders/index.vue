<script setup lang='ts'>
const { t } = useI18n()

const { withNotify } = useNotifyAction()
const { notify } = useNotify()

const {
  isDeleteOrderConfirmationModalVisible,
  loadOrders,
  ordersColumns,
} = useOrders()

const ordersStore = useOrdersStore()

const {
  deleteOrder,
  setOrders,
} = ordersStore

const { 
  isOrderGettingFetch,
  orders,
  searchDates,
} = storeToRefs(ordersStore)

const orderToDelete = ref<IOrder | null>(null)

const handleDeleteOrderClick = async () => {
  if (!orderToDelete.value) return

  const orderId = orderToDelete.value.id.toString()

  await withNotify(
    async () => {
      await deleteOrder(orderId)
      await setOrders(searchDates.value)
    },
    {
      successContent: t('order.api.delete.success-message'),
      errorContent: t('order.api.delete.error-message'),
    }
  )
  
  orderToDelete.value = null
  isDeleteOrderConfirmationModalVisible.value = false
}

const handleDuplicateOrderClick = (row: IOrder) => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
  // orderToDuplicate.value = row
  // isDuplicateOrderConfirmationModalVisible.value = true
}

const handleOpenDeleteOrderConfirmationModalClick = (row: IOrder) => {
  orderToDelete.value = row
  isDeleteOrderConfirmationModalVisible.value = true
}

const handleRowClick = (row: IOrder) => {
  navigateTo(`/orders/${row.id}`)
}

const handleSearchClick = () => {
  loadOrders(searchDates.value)
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

    <div class="flex gap-4 items-end">
      <DatePicker
        v-model="searchDates"
        :label="t('common.dates', 2)"
        range
        theme="light"
      />
      <Button 
        icon="magnifying-glass"
        @click="handleSearchClick"
      />
    </div>

    <Table 
      :columns="ordersColumns" 
      :data="orders"
      filter
      :loading="isOrderGettingFetch"
      @row-click="handleRowClick"
    >
      <template #customers="{ row }">
        <span>{{ row.customer.name }}</span>
      </template>

      <template #items="{ row }">
        <span>{{ row.items.length }}</span>
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

    <Modal 
      v-model="isDeleteOrderConfirmationModalVisible"
      :description="t('order.delete.confirmation')"
      is-confirmation-modal
      :title="t('order.delete')"
      @confirm="handleDeleteOrderClick"
    />
  </div>
</template>