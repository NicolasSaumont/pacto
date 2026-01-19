<script setup lang='ts'>
const { t } = useI18n()

const customersStore = useCustomersStore()
const { customer } = storeToRefs(customersStore)
</script>

<template>
  <div class="flex-1 text-center">
    <div>{{ t('customer.products', 2) }}</div>

    <div 
      v-for="product in customer.products" 
      :key="product.id" 
      class="bg-gray-800 m-4 mr-0 py-2 px-3 rounded-lg border border-gray-600"
    >
      {{ product.name }}
    </div>
  </div>
</template>
