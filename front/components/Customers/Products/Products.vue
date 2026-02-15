<script setup lang='ts'>
const props = defineProps<{
  products?: IProduct[]
}>()

const emit = defineEmits<{
  (e: 'update:products', value: IProduct[]): void
}>()

const customersStore = useCustomersStore()
const { customer } = storeToRefs(customersStore)

const products = computed<IProduct[]>({
  get() {
    return props.products ?? [...(customer.value.products ?? [])]
  },
  set(value) {
    if (props.products) {
      emit('update:products', value)
    } else {
      customer.value.products = [...value]
    }
  },
})
</script>

<template>
  <div class="flex bg-gray-900 py-6 rounded-2xl border border-gray-600 h-full min-h-0">
    <CustomersProductsAvailableOnes v-model:products="products" />
    <CustomersProductsAlreadyAssigned v-model:products="products" />    
  </div>
</template>
