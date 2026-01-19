<script setup lang='ts'>
const { t } = useI18n()

const customersStore = useCustomersStore()
const { customer } = storeToRefs(customersStore)

const unassignProduct = (product: IProduct) => {
  if (!customer.value?.products) return
  const index = customer.value.products.findIndex(customerProduct => customerProduct.id === product.id)
  if (index >= 0) customer.value.products.splice(index, 1)
}
</script>

<template>
  <div class="flex-1 text-center">
    <div>{{ t('customer.products', 2) }}</div>

    <div v-auto-animate>
      <div 
        v-for="product in (customer?.products ?? [])" 
        :key="product.id" 
        class="flex gap-2 items-center bg-gray-800 m-4 mr-0 py-2 px-3 rounded-lg border border-gray-600"
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
</template>
