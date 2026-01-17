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

const {
  resetForm,
} = customersStore

const {
  isCustomerSaving,
  isCustomerGettingFetch,
  customer
} = storeToRefs(customersStore)

const isCustomerNameInputDisabled = computed(() => isCustomerSaving.value || isCustomerGettingFetch.value)


const handleResetClick = () => {
  navigateTo(CUSTOMERS)
}

const handleSubmitClick = async () => {
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
    @submit.prevent="handleSubmitClick"
    @reset.prevent="handleResetClick"
  >
    <Input
      v-model="customer.name"
      :disabled="isCustomerNameInputDisabled"
      :label="t('customer.name')"
      :loading="isCustomerGettingFetch"
      theme="light"
    />
    <CustomersFooter />
  </form>
</template>
