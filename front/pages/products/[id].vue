<script setup lang='ts'>
const { t } = useI18n()
const route = useRoute()

const productsStore = useProductsStore()

const { setProduct } = productsStore
const { isProductGettingFetch } = storeToRefs(productsStore)

onMounted(async () => {
  isProductGettingFetch.value = true
  const productId = getRouteParam(route.params.id)
  if (!productId) return
  await setProduct(productId)
  isProductGettingFetch.value = false
})
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #title>
        {{ t('product.edit') }}
      </template>
    </Header>

    <ProductsForm />

    <ProductsFooter :mode="ModeEnum.EDITION"/>
  </div>
</template>
