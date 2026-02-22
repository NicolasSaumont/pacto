<script setup lang='ts'>
const { t } = useI18n()

const ordersStore = useOrdersStore()

const {
  orders
} = storeToRefs(ordersStore)

// Compteurs animés
const animatedOrdersCount = ref(0)
const animatedCustomersCount = ref(0)
const animatedProductsCount = ref(0)

// Compteurs
const ordersCount = computed(() => orders.value.length)
const customersCount = computed(() => new Set(orders.value.map(o => o.customer.id)).size)
const productsCount = computed(() => {
  return orders.value
    .flatMap(order => order.items) // Permet de n'avoir qu'un seul tableau plutôt que des tableaux imbriqués
    .reduce((sum, item) => sum + item.quantity, 0)
})

// Fonction pour mettre à jour les compteurs
const animateCounters = () => {
  useAnimatedCounter(ordersCount.value, 400, animatedOrdersCount)
  useAnimatedCounter(customersCount.value, 400, animatedCustomersCount)
  useAnimatedCounter(productsCount.value, 400, animatedProductsCount)
}

// Surveille les changements de `orders` pour (re)lancer l'animation des compteurs
watch(orders, () => {
  animateCounters()
}, { immediate: true })
</script>

<template>
  <div class="flex gap-10">
    <SynthesisCardsCard :count="animatedOrdersCount" :description="t('common.orders', 2)" />
    <SynthesisCardsCard :count="animatedCustomersCount" :description="t('common.customers', 2)" />
    <SynthesisCardsCard :count="animatedProductsCount" :description="t('common.products', 2)" />
  </div>
</template>
