import { defineStore } from 'pinia'

export const useCustomersStore = defineStore('customers', () => {
  const customer = ref<ICustomer>(structuredClone(DEFAULT_CUSTOMER))
  const customers = ref<ICustomer[]>([])
  const isCustomerSaving = ref(false)
  const isCustomerGettingFetch = ref(false)
  const originalCustomer = ref<ICustomer>(structuredClone(DEFAULT_CUSTOMER))

  const isConfirmButtonDisabled = computed(() => !customer.value.name)
  
  const editCustomer = async (editedCustomer: ICustomer) => {
    try {
      const body: Record<string, unknown> = {}

      // name
      if (editedCustomer.name !== originalCustomer.value.name) {
        body.name = editedCustomer.name
      }

      // products
      const currentIds = (editedCustomer.products ?? []).map(p => p.id).sort()
      const originalIds = (originalCustomer.value.products ?? []).map(p => p.id).sort() 

      if (currentIds.join(',') !== originalIds.join(',')) {
        body.productIds = currentIds
      }

      if (Object.keys(body).length === 0) return

      await customerRepository.patchCustomer(editedCustomer.id, body)

      // resync snapshot
      const refreshed = await customerRepository.getCustomer(editedCustomer.id.toString())

      customer.value = structuredClone(refreshed)
      originalCustomer.value = structuredClone(refreshed)
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
    originalCustomer.value = structuredClone(DEFAULT_CUSTOMER)
  }

  const setCustomer = async (customerId: string) => {
    const data = await customerRepository.getCustomer(customerId)
    const cloned = structuredClone(data)

    customer.value = cloned
    originalCustomer.value = structuredClone(cloned)
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
