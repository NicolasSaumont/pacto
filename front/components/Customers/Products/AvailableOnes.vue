<script setup lang='ts'>
const { t } = useI18n()

const productsStore = useProductsStore()
const customersStore = useCustomersStore()

const { products } = storeToRefs(productsStore)
const { customer } = storeToRefs(customersStore)

const availableProducts = computed(() => {
  if (!customer.value || !customer.value.products) return products.value

  // Création d'un Set contenant tous les id des produits déjà associés au client
  const customerProductIds = new Set(customer.value.products.map(product => product.id))

  // On filtre la liste complète des produits pour exclure ceux déjà assignés au client
  return products.value.filter(product => !customerProductIds.has(product.id))
})
</script>

<template>
  <div class="flex-1 text-center border-r border-gray-600">
    <div>{{ t('common.available-products', 2) }}</div>

    <div 
      v-for="product in availableProducts" 
      :key="product.id" 
      class="bg-gray-800 m-4 ml-0 py-2 px-3 rounded-lg border border-gray-600"
    >
      {{ product.name }}
    </div>
  </div>
</template>
