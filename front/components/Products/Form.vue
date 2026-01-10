<script setup lang='ts'>
const { t } = useI18n()

const {
  resetForm,
} = useProductsStore()

const {
  isProductSaving,
  isProductGettingFetch,
  product
} = storeToRefs(useProductsStore())

const isProductNameInputDisabled = computed(() => isProductSaving.value || isProductGettingFetch.value)

onUnmounted(resetForm)
</script>

<template>
  <Input
    v-model="product.name"
    :disabled="isProductNameInputDisabled"
    :label="t('product.name')"
    :loading="isProductGettingFetch"
    theme="light"
  />
</template>
