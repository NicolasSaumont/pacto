<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  editProduct,
  postNewProduct,
  resetForm,
} = useProductsStore()

const { 
  isConfirmButtonDisabled,
  isProductSaving,
  product,
} = storeToRefs(useProductsStore())

const handleResetClick = () => {
  navigateTo(PRODUCTS)
}

const handleSubmitClick = async () => {
  isProductSaving.value = true

  if (props.mode === ModeEnum.CREATION) await postNewProduct()
  else if (props.mode === ModeEnum.EDITION) await editProduct(product.value.id)

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
