<script setup lang='ts'>
const { t } = useI18n()

const {
  resetForm,
} = useProductsStore()

const {
  isProductProcessing,
  product
  // productName,
} = storeToRefs(useProductsStore())

onUnmounted(resetForm)
</script>

<template>
  <Input
    v-model="product.name"
    :disabled="isProductProcessing"
    :label="t('product.name')"
    theme="light"
  />
</template>
