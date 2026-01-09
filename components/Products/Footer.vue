<script setup lang='ts'>
const { t } = useI18n()

const {
  postNewProduct,
  resetForm,
} = useProductsStore()

const { 
  isConfirmButtonDisabled,
  isProductProcessing,
} = storeToRefs(useProductsStore())

const handleResetClick = () => {
  navigateTo(PRODUCTS)
}

const handleSubmitClick = async () => {
  isProductProcessing.value = true
  await postNewProduct()
  await navigateTo(PRODUCTS)
  resetForm()
  isProductProcessing.value = false
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
      :loading="isProductProcessing"
      @click="handleSubmitClick"
    />
  </div>
</template>
