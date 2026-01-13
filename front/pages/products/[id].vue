<script setup lang='ts'>
const { t } = useI18n()
const route = useRoute()
const { withNotify } = useNotifyAction()

const productsStore = useProductsStore()

const { setProduct } = productsStore
const { isProductGettingFetch } = storeToRefs(productsStore)

const fetchProductOnMount = async () => {
  isProductGettingFetch.value = true
  try {
    const productId = getRouteParam(route.params.id)
    if (!productId) {
      await navigateTo('/products')
      return
    }

    await withNotify(
      () => setProduct(productId),
      {
        errorContent: t('product.api.get.error-message'),
        rethrow: true,
      }
    )
  } catch (error) {
    await navigateTo('/products')
  } finally {
    isProductGettingFetch.value = false
  }
}

onMounted(fetchProductOnMount)
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
