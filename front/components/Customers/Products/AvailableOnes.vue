<script setup lang='ts'>
const products = defineModel<IProduct[]>('products')

const { t } = useI18n()

const productsStore = useProductsStore()

const { sortProductsByName } = useProducts()

const allProducts = computed(() => productsStore.products ?? [])

const assignProduct = (productToAssign: IProduct) => {
  if (!products.value) return
  if (products.value.some(product => product.id === productToAssign.id)) return

  products.value = sortProductsByName([...products.value, productToAssign])
}

const availableProducts = computed(() =>
  (allProducts.value ?? []).filter(product =>
    !products.value?.some(customerProduct => customerProduct.id === product.id)
  )
)
</script>

<template>
  <div class="flex-1 text-center border-r border-gray-600 min-h-0 flex flex-col">
    <div class="mb-4">{{ t('common.available-products', 2) }}</div>
    <div class="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div v-auto-animate>
        <div
          v-for="product in availableProducts"
          :key="product.id"
          class="flex gap-2 items-center bg-gray-800 my-4 mx-6 py-2 px-3 rounded-lg border border-gray-600"
        >
          <span class="flex-1">{{ product.name }}</span>
          <Button
            :color="ButtonColorEnum.WHITE"
            icon="arrow-right"
            outline
            @click="assignProduct(product)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
