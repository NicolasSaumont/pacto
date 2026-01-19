<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  sendCustomerToCreate,
  sendCustomerToEdit,
} = useCustomers()

const customersStore = useCustomersStore()
const productsStore = useProductsStore()

const {
  resetForm,
} = customersStore

const {
  isCustomerSaving,
  isCustomerGettingFetch,
  customer
} = storeToRefs(customersStore)

const {
  isProductGettingFetch,
} = storeToRefs(productsStore)

const customerName = computed<string>({
  get() {
    return customer.value?.name ?? DEFAULT_CUSTOMER.name
  },
  set(value) {
    if (!customer.value) return
    customer.value.name = value
  },
})

const isCustomerNameInputDisabled = computed(() => isCustomerSaving.value || isCustomerGettingFetch.value)

const handleResetClick = () => {
  navigateTo(CUSTOMERS)
}

const handleSubmitClick = async () => {
  if (!customer.value) return

  isCustomerSaving.value = true
  try {
    if (props.mode === ModeEnum.CREATION) await sendCustomerToCreate(customer.value)
    else if (props.mode === ModeEnum.EDITION) await sendCustomerToEdit(customer.value)

    await navigateTo(CUSTOMERS)
  } catch {
    // IMPORTANT: on consomme l'erreur pour éviter le warning Vue
    // la notif est déjà affichée dans withNotify
    return
  } finally {
    isCustomerSaving.value = false
  }
}

onUnmounted(resetForm)
</script>

<template>
  <form 
    class="flex flex-col gap-6"
    @submit.prevent="handleSubmitClick"
    @reset.prevent="handleResetClick"
  >
    <Input
      v-model="customerName"
      :disabled="isCustomerNameInputDisabled"
      :label="t('customer.name')"
      :loading="isCustomerGettingFetch"
      theme="light"
    />

    <CustomersProductsSkeleton v-if="isCustomerGettingFetch || isProductGettingFetch"/>

    <CustomersProducts v-else />

    <CustomersFooter />
  </form>
</template>
