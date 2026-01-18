import { defineStore } from 'pinia'

export const useCustomersStore = defineStore('customers', () => {
  const isCustomerSaving = ref(false)
  const isCustomerGettingFetch = ref(false)
  const customer = ref<ICustomer>({ ...DEFAULT_CUSTOMER })
  const customers = ref<ICustomer[]>([])

  const isConfirmButtonDisabled = computed(() => !customer.value.name)
  
  const editCustomer = async (customer: ICustomer) => {
    try {
      await customerRepository.patchCustomer(customer)
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
    customer.value = { ...DEFAULT_CUSTOMER }
  }

  const setCustomer = async (customerId: string) => {
    customer.value = await customerRepository.getCustomer(customerId)
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
    postNewCustomer,
    resetForm,
    setCustomer,
    setCustomers,
  }
})
