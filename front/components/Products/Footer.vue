<script setup lang='ts'>
const { t } = useI18n()

const productsStore = useProductsStore()

const { 
  isConfirmButtonDisabled,
  isProductSaving,
} = storeToRefs(productsStore)
</script>

<template>
  <div class="flex gap-2 mt-12">
    <Button 
      type="reset"
      :label="t('common.cancel')" 
      outline 
    />
    <Button 
      type="submit"
      :disabled="isConfirmButtonDisabled"
      :label="t('common.save')" 
      :loading="isProductSaving"
    />
  </div>
</template>
