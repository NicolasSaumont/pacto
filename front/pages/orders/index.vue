<script setup lang='ts'>
const { t } = useI18n()

const { withNotify } = useNotifyAction()

const {
  isDeleteOrderConfirmationModalVisible,
  isDuplicateOrderConfirmationModalVisible,
  loadOrder,
  loadOrders,
  ordersColumns,
  printOrder,
} = useOrders()

const ordersStore = useOrdersStore()

const {
  deleteOrder,
  setOrders,
} = ordersStore

const { 
  isDuplicationWanted,
  isOrderGettingFetch,
  orders,
  ordersSearchDates,
} = storeToRefs(ordersStore)

const orderToDelete = ref<IOrder | null>(null)
const orderToDuplicate = ref<IOrder | null>(null)
const orderToPrint = ref<IOrder | null>(null)

const handleDeleteOrderClick = async () => {
  if (!orderToDelete.value) return

  const orderId = orderToDelete.value.id.toString()

  await withNotify(
    async () => {
      await deleteOrder(orderId)
      await setOrders(ordersSearchDates.value)
    },
    {
      successContent: t('order.api.delete.success-message'),
      errorContent: t('order.api.delete.error-message'),
    }
  )
  
  orderToDelete.value = null
  isDeleteOrderConfirmationModalVisible.value = false
}

const handleDuplicateOrderClick = async () => {
  if (!orderToDuplicate.value) return

  isDuplicationWanted.value = true

  const orderId = orderToDuplicate.value.id.toString()

  await loadOrder(orderId)

  navigateTo(ORDERS_CREATE_URL)
}

const handleOpenDuplicateOrderConfirmationModalClick = (row: IOrder) => {
  orderToDuplicate.value = row
  isDuplicateOrderConfirmationModalVisible.value = true
}

const handleOpenDeleteOrderConfirmationModalClick = (row: IOrder) => {
  orderToDelete.value = row
  isDeleteOrderConfirmationModalVisible.value = true
}

const handlePrintOrderClick = (row: IOrder) => {
  orderToPrint.value = row

  if (!orderToPrint.value.id) return

  printOrder(orderToPrint.value.id)
}

const handleRowClick = (row: IOrder) => {
  navigateTo(`/orders/${row.id}`)
}

const handleSearchClick = () => {
  loadOrders(ordersSearchDates.value)
}

onMounted(() => loadOrders(ordersSearchDates.value))
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
        v-model="ordersSearchDates"
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
        <div class="flex justify-center">
          <Button 
            flat
            icon="copy" 
            :title="t('common.duplicate')"
            @click.stop="handleOpenDuplicateOrderConfirmationModalClick(row)"
          />
          <Button 
            flat
            icon="print" 
            :title="t('common.print')"
            @click.stop="handlePrintOrderClick(row)"
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

    <!-- Modale de duplication -->
    <Modal 
      v-model="isDuplicateOrderConfirmationModalVisible"
      :description="t('order.duplicate.confirmation')"
      is-confirmation-modal
      :title="t('order.duplicate')"
      @confirm="handleDuplicateOrderClick"
    />

    <!-- Modale de suppression -->
    <Modal 
      v-model="isDeleteOrderConfirmationModalVisible"
      :description="t('order.delete.confirmation')"
      is-confirmation-modal
      :title="t('order.delete')"
      @confirm="handleDeleteOrderClick"
    />
  </div>
</template>