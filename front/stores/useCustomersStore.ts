import { defineStore } from 'pinia'

export const useCustomersStore = defineStore('customers', () => {
  // const isProductSaving = ref(false)
  const isCustomerGettingFetch = ref(false)
  // const product = ref<IProduct>({ ...DEFAULT_PRODUCT })
  const customers = ref<ICustomer[]>([
    {
      id: 1,
      name: 'Boucherie Martin',
    },
    {
      id: 2,
      name: 'Boucherie Dupont',
    },
    {
      id: 3,
      name: 'Boucherie Bernard',
    },
  ])

  // const isConfirmButtonDisabled = computed(() => !product.value.name)
  
  // const editProduct = async (product: IProduct) => {
  //   try {
  //     await productRepository.patchProduct(product)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const deleteProduct = async (productId: string) => {
  //   try {
  //     await productRepository.deleteProduct(productId)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const postNewProduct = async (product: IProduct) => {
  //   try {
  //     await productRepository.postProduct(product)
  //   } catch (error) {
  //     throw error
  //   }
  // }

  // const resetForm = () => {
  //   product.value = { ...DEFAULT_PRODUCT }
  // }

  // const setProduct = async (productId: string) => {
  //   product.value = await productRepository.getProduct(productId)
  // }

  const setCustomers = async () => {
    console.log('setCustomers')
    // customers.value = await customerRepository.getCustomers() 
  }

  return {
    customers,
    isCustomerGettingFetch,
    // deleteProduct,
    // editProduct,
    // isConfirmButtonDisabled,
    // isProductSaving,
    // postNewProduct,
    // product,
    // resetForm,
    // setProduct,
    setCustomers,
  }
})
