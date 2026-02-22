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

const showSkeleton = ref(true)

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
  navigateTo(CUSTOMERS_URL)
}

const handleSubmitClick = async () => {
  if (!customer.value) return

  let showLoader = true

  const loaderTimeout = setTimeout(() => {
    if (showLoader) {
      isCustomerSaving.value = true
    }
  }, LOADER_TIMEOUT_DURATION)

  try {
    if (props.mode === ModeEnum.CREATION) await sendCustomerToCreate(customer.value)
    else if (props.mode === ModeEnum.EDITION) await sendCustomerToEdit(customer.value)

    await navigateTo(CUSTOMERS_URL)
  } catch {
    // IMPORTANT: on consomme l'erreur pour éviter le warning Vue
    // la notif est déjà affichée dans withNotify
    return
  } finally {
    showLoader = false
    clearTimeout(loaderTimeout)
    isCustomerSaving.value = false
  }
}

onMounted(() => {
  // Force l'affichage du squelette pour éviter un effet de flash
  setTimeout(() => {
    showSkeleton.value = false
  }, LOADER_MIN_DURATION);
})

onUnmounted(resetForm)
</script>

<template>
  <div class="flex-1 min-h-0 flex flex-col">
    <form
      class="flex flex-col gap-6 flex-1 min-h-0"
      @submit.prevent="handleSubmitClick"
      @reset.prevent="handleResetClick"
    >
      <Input
        v-model="customerName"
        :disabled="isCustomerNameInputDisabled"
        :label="t('customer.name')"
        :loading="isCustomerGettingFetch"
        required
        theme="light"
        class="shrink-0"
      />

      <CustomersProductsSkeleton 
        v-if="isCustomerGettingFetch || isProductGettingFetch || showSkeleton" 
        class="flex-1 min-h-0" 
      />

      <CustomersProducts v-else class="flex-1 min-h-0" />

      <CustomersFooter class="shrink-0 mt-6" />
    </form>
  </div>
</template>
