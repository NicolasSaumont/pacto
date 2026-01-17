<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  sendProductToEdit,
} = useProducts()

const productsStore = useProductsStore()

const {
  postNewProduct,
  resetForm,
} = productsStore

const {
  isProductSaving,
  isProductGettingFetch,
  product
} = storeToRefs(productsStore)

const isProductNameInputDisabled = computed(() => isProductSaving.value || isProductGettingFetch.value)


const handleResetClick = () => {
  navigateTo(PRODUCTS)
}

const handleSubmitClick = async () => {
  isProductSaving.value = true
  try {
    if (props.mode === ModeEnum.CREATION) await postNewProduct()
    else if (props.mode === ModeEnum.EDITION) await sendProductToEdit(product.value)

    await navigateTo(PRODUCTS)
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
      theme="light"
    />
    <ProductsFooter />
  </form>
</template>
