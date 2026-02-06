<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()
const { notify } = useNotify()

const { loadCustomers } = useCustomers()
const { resetForm } = useOrders()
const { loadProducts } = useProducts()

const customerStore = useCustomersStore()
const orderStore = useOrdersStore()
const productStore = useProductsStore()

const { setCustomer } = customerStore
const { customer, customers } = storeToRefs(customerStore)

const { fillSelects } = orderStore

const { 
  isDuplicationWanted,
  isOrderGettingFetch, 
  order,
  selectedCustomerId,
  selectedProducts, 
} = storeToRefs(orderStore)

const { products } = storeToRefs(productStore)

const productsList = computed(() => {
  if (customer.value.id) return customer.value.products
  return products.value
})

const handleAddProductClick = () => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
}

// Surveille le changement de client sélectionné, pour mettre à jour la variable customer, et ainsi récupére la liste des produits disponibles
watch(selectedCustomerId, async (id) => {
  if (!id) {
    customer.value = structuredClone(DEFAULT_CUSTOMER)
    return
  }
  await setCustomer(id.toString())
  order.value.customer.id = id
}, { immediate: true })

// Surveille le changement de client sélectionné, pour vider la liste des produits sélectionnés
watch(selectedCustomerId, (id, oldId) => {
  if (props.mode === ModeEnum.EDITION) return

  // Ne pas vider au "premier remplissage" (duplication/hydratation)
  if (oldId == null) return

  selectedProducts.value = []
})

onMounted(async () => {
  await loadCustomers()
  await loadProducts()

  fillSelects()

  // Reset de la duplication
  isDuplicationWanted.value = false
})

onUnmounted(() => {
  if (isDuplicationWanted.value) return
  resetForm()
})
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
        :options="productsList"
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
