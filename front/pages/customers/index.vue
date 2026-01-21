<script setup lang='ts'>
const { t } = useI18n()

const { withNotify } = useNotifyAction()

const {
  columns,
  isDeleteCustomerConfirmationModalVisible,
  loadCustomers,
} = useCustomers()

const customersStore = useCustomersStore()

const {
  deleteCustomer,
  setCustomers,
} = customersStore

const { 
  customers,
  isCustomerGettingFetch,
} = storeToRefs(customersStore)

const customerToDelete = ref<ICustomer | null>(null)

const handleDeleteCustomerClick = async () => {
  if (!customerToDelete.value) return

  const customerId = customerToDelete.value.id.toString()

  await withNotify(
    async () => {
      await deleteCustomer(customerId)
      await setCustomers()
    },
    {
      successContent: t('product.api.delete.success-message'),
      errorContent: t('product.api.delete.error-message'),
    }
  )
  
  customerToDelete.value = null
  isDeleteCustomerConfirmationModalVisible.value = false
}

const handleOpenDeleteCustomerConfirmationModalClick = (row: ICustomer) => {
  customerToDelete.value = row
  isDeleteCustomerConfirmationModalVisible.value = true
}

const handleRowClick = (row: ICustomer) => {
  navigateTo(`/customers/${row.id}`)
}

onMounted(loadCustomers)
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-12">
    <Header>
      <template #header-right>
        <Button 
          :label="t('customers.add-customer')" 
          @click="navigateTo(CUSTOMERS_CREATE_URL)"
        />
      </template>
    </Header>
    
    <Table 
      :columns="columns" 
      :data="customers"
      filter
      :loading="isCustomerGettingFetch"
      @row-click="handleRowClick"
    >
      <template #actions="{ row }">
        <div class="text-center">
          <Button 
            :color="ButtonColorEnum.RED"
            flat
            icon="trash" 
            :title="t('common.delete')"
            @click.stop="handleOpenDeleteCustomerConfirmationModalClick(row)"
          />
        </div>
      </template>
    </Table>

    <Modal 
      v-model="isDeleteCustomerConfirmationModalVisible"
      :description="t('product.delete.confirmation')"
      is-confirmation-modal
      :title="t('product.delete')"
      @confirm="handleDeleteCustomerClick"
    />
  </div>
</template>