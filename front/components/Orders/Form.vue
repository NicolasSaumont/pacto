<script setup lang='ts'>
const { t } = useI18n()
const { notify } = useNotify()

const orderStore = useOrdersStore()

const {
  order,
} = storeToRefs(orderStore)

const handleAddProductClick = () => {
  notify({
    state: 'info',
    content: t('common.unavailable-feature'),
  })
}

const customer = ref()
const products = ref([])
const customerOptions = [
  {
    label: 'client 1',
    value: 1,
  },
  {
    label: 'client 2',
    value: 2,
  },
  {
    label: 'client 3',
    value: 3,
  },
  {
    label: 'client 4',
    value: 4,
  },
  {
    label: 'client 5',
    value: 5,
  }
]
const productsOptions = [
  {
    label: 'produit 1',
    value: 1,
  },
  {
    label: 'produit 2',
    value: 2,
  },
  {
    label: 'produit 3',
    value: 3,
  },
  {
    label: 'produit 4',
    value: 4,
  }
]
</script>

<template>
  <form class="flex flex-col gap-6 flex-1 bg-gray-900 p-6 rounded-2xl border border-gray-600">
    <Select 
      v-model="customer"
      :label="t('common.customers', 1)"
      :options="customerOptions"
    />
    <DatePicker 
      v-model="order.orderDate"
      :label="t('order.date')"
      :min="order.orderDate"
    />
    <DatePicker 
      v-model="order.deliveryDate"
      :label="t('order.delivery-date')"
      :min="order.orderDate"
    />
    <div class="flex gap-4 items-end">
      <Select 
        v-model="products"
        :label="t('common.products', 2)"
        multiple
        :options="productsOptions"
      />
      <Button
        icon="plus"
        @click="handleAddProductClick"
      />
    </div>
    <div class="flex-1 min-h-0">
      <TextArea 
        v-model="order.comment"
        :label="t('common.comments', 2)" 
        class="h-full" 
      />
    </div>
  </form>
</template>
