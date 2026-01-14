import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
  const isProductSaving = ref(false)
  const isProductGettingFetch = ref(false)
  const product = ref<IProduct>({ ...DEFAULT_PRODUCT })
  const products = ref<IProduct[]>([])

  const isConfirmButtonDisabled = computed(() => !product.value.name)
  
  const editProduct = async (product: IProduct) => {
    try {
      await productRepository.updateProduct(product)
    } catch (error) {
      throw error
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      await productRepository.deleteProduct(productId)
    } catch (error) {
      throw error
    }
  }

  const postNewProduct = async () => {
    console.log('New product creation is processing : ', product.value.name)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const resetForm = () => {
    product.value = { ...DEFAULT_PRODUCT }
  }

  const setProduct = async (productId: string) => {
    product.value = await productRepository.getProduct(productId)
  }

  const setProducts = async () => {
    products.value = await productRepository.getProducts() 
  }

  return {
    deleteProduct,
    editProduct,
    isConfirmButtonDisabled,
    isProductSaving,
    isProductGettingFetch,
    postNewProduct,
    product,
    products,
    resetForm,
    setProduct,
    setProducts,
  }
})
