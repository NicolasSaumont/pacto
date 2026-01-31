<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()
const { notify } = useNotify()

const orderStore = useOrdersStore()
const { isOrderGettingFetch, order } = storeToRefs(orderStore)

const { loadCustomers } = useCustomers()
const customerStore = useCustomersStore()
const { setCustomer } = customerStore
const { customer, customers } = storeToRefs(customerStore)

const { loadProducts } = useProducts()

const selectedCustomerId = ref<number | null>(null)
const selectedProducts = ref<number[]>([])

const fillSelects = () => {
  selectedCustomerId.value = order.value.customer.id 

  selectedProducts.value = order.value.items.map(
    item => item.product.id
  )
}
 
const handleAddProductClick = () => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
}

const resetForm = () => {
  order.value = structuredClone(DEFAULT_ORDER)
}

// Surveille le changement de client sélectionné, pour mettre à jour la variable customer, et ainsi récupére la liste des produits disponibles
watch(selectedCustomerId, async (id) => {
  if (!id) return
  await setCustomer(id.toString())
}, { immediate: true })

onMounted(async () => {
  await loadCustomers()
  await loadProducts()

  console.log(order.value)

  if (props.mode === ModeEnum.EDITION) fillSelects()
})

onUnmounted(resetForm)
</script>

<template>
  <form class="flex flex-col gap-6 flex-1 bg-gray-900 p-6 rounded-2xl border border-gray-600">
    <Select 
      v-model="selectedCustomerId"
      :disabled="mode === ModeEnum.EDITION"
      :label="t('common.customers', 1)"
      label-key="name"
      :loading="isOrderGettingFetch"
      :options="customers"
      valueKey="id"
    />
    <DatePicker 
      v-model="order.orderDate"
      :disabled="mode === ModeEnum.EDITION"
      :label="t('order.date')"
      :loading="isOrderGettingFetch"
      :min="order.orderDate"
    />
    <DatePicker 
      v-model="order.deliveryDate"
      :label="t('order.delivery-date')"
      :loading="isOrderGettingFetch"
      :min="order.orderDate"
    />
    <div class="flex gap-4 items-end">
      <Select 
        v-model="selectedProducts"
        filter
        :label="t('common.products', 2)"
        label-key="name"
        :loading="isOrderGettingFetch"
        multiple
        :options="customer.products"
        valueKey="id"
      />
      <Button
        icon="plus"
        :disabled="isOrderGettingFetch"
        @click="handleAddProductClick"
      />
    </div>
    <div class="flex-1 min-h-0">
      <TextArea 
        v-model="order.comment"
        :label="t('common.comments', 2)" 
        :loading="isOrderGettingFetch"
        class="h-full" 
      />
    </div>
  </form>
</template>
