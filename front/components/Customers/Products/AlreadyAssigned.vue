<script setup lang='ts'>
const { t } = useI18n()

const customersStore = useCustomersStore()
const { customer } = storeToRefs(customersStore)

const { sortProductsByName } = useProducts()

const unassignProduct = (product: IProduct) => {
  if (!customer.value?.products) return
  const index = customer.value.products.findIndex(customerProduct => customerProduct.id === product.id)
  if (index >= 0) customer.value.products.splice(index, 1)
  sortProductsByName(customer.value.products)
}
</script>

<template>
  <div class="flex-1 text-center border-r border-gray-600 min-h-0 flex flex-col">
    <div class="mb-4">{{ t('customer.products', 2) }}</div>

    <div class="flex-1 overflow-y-auto min-h-0 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
      <div v-auto-animate>
        <div 
          v-for="product in (customer?.products ?? [])" 
          :key="product.id" 
          class="flex gap-2 items-center bg-gray-800 my-4 mx-6 py-2 px-3 rounded-lg border border-gray-600"
        >
          <Button 
            :color="ButtonColorEnum.WHITE"
            icon="arrow-left"
            outline
            @click="unassignProduct(product)"
          />
          <span class="flex-1">{{ product.name }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
