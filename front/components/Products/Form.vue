<script setup lang='ts'>
const { t } = useI18n()

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
