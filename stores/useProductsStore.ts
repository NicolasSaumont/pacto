import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
  const isProductProcessing = ref(false)
  const product = ref<IProduct>({ ...DEFAULT_PRODUCT })
  // const productName = ref<string>()

  const isConfirmButtonDisabled = computed(() => !product.value.name)
  
  const postNewProduct = async () => {
    console.log('New product creation is processing : ', product.value.name)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const resetForm = () => {
    product.value = { ...DEFAULT_PRODUCT }
  }

  const setProduct = async (productId: string) => {
    // await getProduct(productId)
    console.log('Product is getting fetch : ', productId)
    await new Promise(resolve => setTimeout(resolve, 1000))
    product.value = MOCKED_PRODUCT
  }

  return {
    isConfirmButtonDisabled,
    isProductProcessing,
    postNewProduct,
    product,
    // productName,
    resetForm,
    setProduct,
  }
})
