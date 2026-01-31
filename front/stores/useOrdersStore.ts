import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
  // const isCustomerSaving = ref(false)
  const isOrderGettingFetch = ref(false)
  const order = ref<IOrder>(structuredClone(DEFAULT_ORDER))
  const orders = ref<IOrder[]>([])
  const originalOrder = ref<IOrder>(structuredClone(DEFAULT_ORDER))
  const searchDates = ref<IRangeDates>({
    start: dayjs(DEFAULT_SEARCH_DATES.start),
    end: dayjs(DEFAULT_SEARCH_DATES.end),
  })
  const selectedCustomerId = ref<number | null>(null)
  const selectedProducts = ref<number[]>([])

  // const isConfirmButtonDisabled = computed(() => !customer.value.name)
  
  // const editCustomer = async (customer: ICustomer) => {
  //   try {
  //     const body: Record<string, unknown> = {}

  //     // name
  //     if (customer.name !== originalCustomer.value.name) {
  //       body.name = customer.name
  //     }

  //     // products
  //     const currentIds = (customer.products ?? []).map(p => p.id).sort()
  //     const originalIds = (originalCustomer.value.products ?? []).map(p => p.id).sort()

  //     if (currentIds.join(',') !== originalIds.join(',')) {
  //       body.productIds = currentIds
  //     }

  //     if (Object.keys(body).length === 0) return

  //     await customerRepository.patchCustomer(customer.id, body)

  //     // resync snapshot
  //     originalCustomer.value = structuredClone(toRaw(customer))
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const deleteCustomer = async (customerId: string) => {
  //   try {
  //     await customerRepository.deleteCustomer(customerId)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  const fillSelects = () => {
    selectedCustomerId.value = order.value.customer.id 

    selectedProducts.value = order.value.items.map(
      item => item.product.id
    )
  }

  // const postNewCustomer = async (customer: ICustomer) => {
  //   try {
  //     await customerRepository.postCustomer(customer)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const resetForm = () => {
  //   customer.value = structuredClone(DEFAULT_CUSTOMER)
  //   console.log(customer.value)
  // }

  const setOrder = async (orderId: string) => {
    order.value = await orderRepository.getOrder(orderId)
    originalOrder.value = structuredClone(toRaw(order.value))
  }

  const setOrders = async (searchDates: IRangeDates) => {
    orders.value = await orderRepository.getOrders(searchDates) 
  }

  return {
    // deleteCustomer,
    // editCustomer,
    // isConfirmButtonDisabled,
    isOrderGettingFetch,
    // isCustomerSaving,
    fillSelects,
    order,
    orders,
    originalOrder,
    // postNewCustomer,
    // resetForm,
    searchDates,
    selectedCustomerId,
    selectedProducts,
    setOrder,
    setOrders,
  }
})
