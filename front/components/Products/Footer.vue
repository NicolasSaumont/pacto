<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const productsStore = useProductsStore()

const {
  editProduct,
  postNewProduct,
  resetForm,
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

  if (props.mode === ModeEnum.CREATION) await postNewProduct()
  else if (props.mode === ModeEnum.EDITION) await editProduct(product.value)

  await navigateTo(PRODUCTS)
  resetForm()
  isProductSaving.value = false
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
