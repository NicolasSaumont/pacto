<script setup lang='ts'>
const { t } = useI18n()

const {
  loadOrders,
} = useOrders()

const ordersStore = useOrdersStore()

const { 
  ordersSearchDates,
  orders,
} = storeToRefs(ordersStore)

const productsSummary = computed(() => {
  const map = new Map()

  orders.value
    .flatMap(order => order.items)
    .forEach(item => {
      const product = item.product

      if (!map.has(product.id)) {
        map.set(product.id, {
          id: product.id,
          name: product.name,
          quantity: 0
        })
      }

      map.get(product.id).quantity += item.quantity
    })

  return Array.from(map.values())
})

const handleSearchClick = () => {
  loadOrders(ordersSearchDates.value)
}

onMounted(() => loadOrders(ordersSearchDates.value))
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header />

    <div class="flex gap-4 items-end">
      <DatePicker
        v-model="ordersSearchDates"
        :label="t('common.dates', 2)"
        range
        theme="light"
      />
      <Button 
        icon="magnifying-glass"
        @click="handleSearchClick"
      />
    </div>

    <SynthesisCards /> 

    <SynthesisProductsTable :products="productsSummary" />

  </div>
</template>
