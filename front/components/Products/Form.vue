<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  sendProductToCreate,
  sendProductToEdit,
} = useProducts()

const productsStore = useProductsStore()

const {
  resetForm,
} = productsStore

const {
  isProductSaving,
  isProductGettingFetch,
  product
} = storeToRefs(productsStore)

const isProductNameInputDisabled = computed(() => isProductSaving.value || isProductGettingFetch.value)


const handleResetClick = () => {
  navigateTo(PRODUCTS_URL)
}

const handleSubmitClick = async () => {
  isProductSaving.value = true
  try {
    if (props.mode === ModeEnum.CREATION) await sendProductToCreate(product.value)
    else if (props.mode === ModeEnum.EDITION) await sendProductToEdit(product.value)

    await navigateTo(PRODUCTS_URL)
  } catch {
    // IMPORTANT: on consomme l'erreur pour éviter le warning Vue
    // la notif est déjà affichée dans withNotify
    return
  } finally {
    isProductSaving.value = false
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
      v-model="product.name"
      :disabled="isProductNameInputDisabled"
      :label="t('product.name')"
      :loading="isProductGettingFetch"
      required
      theme="light"
    />
    <ProductsFooter />
  </form>
</template>
