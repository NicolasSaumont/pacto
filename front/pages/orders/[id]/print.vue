<script setup lang="ts">
definePageMeta({
  layout: 'print'
})

const { t } = useI18n()
const route = useRoute()

const { convertToDayjs } = useDatePicker()
const { loadOrder } = useOrders()

const orderStore = useOrdersStore()
const { order } = storeToRefs(orderStore)

const deliveryDate = computed<string | null>(() => {
  const date = convertToDayjs(order.value.deliveryDate)
  if (!date) return null
  return date.format(DATE_FORMAT)
})

const itemsToPrint = computed(() => order.value.items.filter((item: IItem) => item.quantity > 0))

const orderDate = computed<string | null>(() => {
  const date = convertToDayjs(order.value.orderDate)
  if (!date) return null
  return date.format(DATE_FORMAT)
})

onMounted(async () => {
  await loadOrder()

  if (!order.value.id) {
    navigateTo(`/orders/${route.params.id}`)
    return
  }

  setTimeout(() => {
    window.print()
  }, 300)
})
</script>

<template>
  <div class="flex flex-col gap-4">
    <span class="self-center font-semibold text-2xl">
      {{ t('common.orders', 1) }}
    </span>

    <div class="flex gap-2">
      <span class="font-semibold">{{ t('print.customer') }}</span> 
      <span>{{ order.customer?.name }}</span>
    </div>
    <div class="flex gap-2 items-end">
      <div class="flex gap-2 grow">
        <span class="font-semibold">{{ t('print.order-date') }}</span>
        <span>{{ orderDate }}</span>
      </div>
      <div v-if="deliveryDate" class="flex gap-2 grow text-red-800 font-semibold text-lg">
        <span>{{ t('print.delivery-date') }}</span>
        <span>{{ deliveryDate }}</span>
      </div>
    </div>

    <table class="w-full text-gray-900 border border-black border-collapse print:border-black">
      <thead>
        <tr>
          <th class="text-gray-900 border border-black px-2 py-1 text-left font-semibold w-1/2">{{ t('common.products', 1) }}</th>
          <th class="text-gray-900 border border-black px-2 py-1 text-center font-semibold w-1/6">{{ t('common.quantity') }}</th>
          <th class="text-gray-900 border border-black px-2 py-1 text-center font-semibold w-1/6">{{ t('common.weight') }}</th>
          <th class="text-gray-900 border border-black px-2 py-1 text-center font-semibold w-1/6">{{ t('common.batch-number') }}</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in itemsToPrint" :key="item.id">
          <td class="border border-black px-2 py-1">{{ item.product.name }}</td>
          <td class="border border-black px-2 py-1 text-center">{{ item.quantity }}</td>
          <td class="border border-black" />
          <td class="border border-black" />
        </tr>
      </tbody>
    </table>

    <div v-if="order.comment" class="border border-black px-2 py-1">
      {{ order.comment }}
    </div>
  </div>
</template>
