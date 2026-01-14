<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  sendProductToEdit
} = useProducts()

const productsStore = useProductsStore()

const {
  postNewProduct,
} = productsStore

const { 
  isConfirmButtonDisabled,
  isProductSaving,
  product,
} = storeToRefs(productsStore)

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
</script>

<template>
  <div class="flex gap-2 mt-6">
    <Button 
      :label="t('common.cancel')" 
      outline 
      @click="handleResetClick"
    />
    <Button 
      :disabled="isConfirmButtonDisabled"
      :label="t('common.save')" 
      :loading="isProductSaving"
      @click="handleSubmitClick"
    />
  </div>
</template>
