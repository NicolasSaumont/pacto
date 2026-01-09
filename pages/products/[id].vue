<script setup lang='ts'>
const { t } = useI18n()
const route = useRoute()

const {
  setProduct,
} = useProductsStore()

const {
  isProductGettingFetch,
} = storeToRefs(useProductsStore())

onMounted(async () => {
  isProductGettingFetch.value = true
  const productId = getRouteParam(route.params.id)
  if (!productId) return
  await setProduct(productId)
  isProductGettingFetch.value = false
})
</script>

<template>
  <Header>
    <template #title>
      {{ t('product.edit-product') }}
    </template>
  </Header>

  <ProductsForm />

  <ProductsFooter :mode="ModeEnum.EDITION"/>
</template>
