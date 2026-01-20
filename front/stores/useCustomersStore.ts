import { defineStore } from 'pinia'

export const useCustomersStore = defineStore('customers', () => {
  const isCustomerSaving = ref(false)
  const isCustomerGettingFetch = ref(false)
  const customer = ref<ICustomer>(structuredClone(DEFAULT_CUSTOMER))
  const customers = ref<ICustomer[]>([])
  const originalCustomer = ref<ICustomer>(structuredClone(DEFAULT_CUSTOMER))

  const isConfirmButtonDisabled = computed(() => !customer.value.name)
  
  const editCustomer = async (customer: ICustomer) => {
    try {
      const body: Record<string, unknown> = {}

      // name
      if (customer.name !== originalCustomer.value.name) {
        body.name = customer.name
      }

      // products
      const currentIds = (customer.products ?? []).map(p => p.id).sort()
      const originalIds = (originalCustomer.value.products ?? []).map(p => p.id).sort()

      if (currentIds.join(',') !== originalIds.join(',')) {
        body.productIds = currentIds
      }

      if (Object.keys(body).length === 0) return

      await customerRepository.patchCustomer(customer.id, body)

      // resync snapshot
      originalCustomer.value = structuredClone(toRaw(customer))
    } catch (error) {
      throw error
    }
  }

  const deleteCustomer = async (customerId: string) => {
    try {
      await customerRepository.deleteCustomer(customerId)
    } catch (error) {
      throw error
    }
  }

  const postNewCustomer = async (customer: ICustomer) => {
    try {
      await customerRepository.postCustomer(customer)
    } catch (error) {
      throw error
    }
  }

  const resetForm = () => {
    customer.value = structuredClone(DEFAULT_CUSTOMER)
    console.log(customer.value)
  }

  const setCustomer = async (customerId: string) => {
    customer.value = await customerRepository.getCustomer(customerId)
    originalCustomer.value = structuredClone(toRaw(customer.value))
  }

  const setCustomers = async () => {
    customers.value = await customerRepository.getCustomers() 
  }

  return {
    customer,
    customers,
    deleteCustomer,
    editCustomer,
    isConfirmButtonDisabled,
    isCustomerGettingFetch,
    isCustomerSaving,
    originalCustomer,
    postNewCustomer,
    resetForm,
    setCustomer,
    setCustomers,
  }
})
