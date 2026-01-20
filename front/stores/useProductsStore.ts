import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
  const isProductSaving = ref(false)
  const isProductGettingFetch = ref(false)
  const product = ref<IProduct>(structuredClone(DEFAULT_PRODUCT))
  const products = ref<IProduct[]>([])

  const isConfirmButtonDisabled = computed(() => !product.value.name)
  
  const editProduct = async (product: IProduct) => {
    try {
      await productRepository.patchProduct(product)
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

  const postNewProduct = async (product: IProduct) => {
    try {
      await productRepository.postProduct(product)
    } catch (error) {
      throw error
    }
  }

  const resetForm = () => {
    product.value = structuredClone(DEFAULT_PRODUCT)
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
