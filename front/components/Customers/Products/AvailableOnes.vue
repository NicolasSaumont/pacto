<script setup lang='ts'>
const { t } = useI18n()

const customersStore = useCustomersStore()
const { customer } = storeToRefs(customersStore)

const { getAvailableProducts } = useProducts()

const assignProduct = (product: IProduct) => {
  if (!customer.value) return
  if (!customer.value.products) customer.value.products = []

  // Évite doublon
  if (customer.value.products.some(customerProduct => customerProduct.id === product.id)) return

  customer.value.products.push(product)
}
</script>

<template>
  <div class="flex-1 text-center border-r border-gray-600 min-h-0 flex flex-col">
    <div class="mb-4">{{ t('common.available-products', 2) }}</div>

    <div class="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div v-auto-animate>
        <div
          v-for="product in getAvailableProducts(customer)"
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
