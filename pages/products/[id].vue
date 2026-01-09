<script setup lang='ts'>
const { t } = useI18n()
const route = useRoute()

const {
  setProduct,
} = useProductsStore()

const {
  isProductProcessing,
} = storeToRefs(useProductsStore())

onMounted(async () => {
  isProductProcessing.value = true
  const productId = getRouteParam(route.params.id)
  if (!productId) return
  await setProduct(productId)
  isProductProcessing.value = false
})
</script>

<template>
  <Header>
    <template #title>
      {{ t('product.edit-product') }}
    </template>
  </Header>

  <ProductsForm />
</template>
