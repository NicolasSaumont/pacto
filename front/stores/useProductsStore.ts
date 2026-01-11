import { defineStore } from 'pinia'

export const useProductsStore = defineStore('products', () => {
  const isProductSaving = ref(false)
  const isProductGettingFetch = ref(false)
  const product = ref<IProduct>({ ...DEFAULT_PRODUCT })
  const products = ref<IProduct[]>([])

  const isConfirmButtonDisabled = computed(() => !product.value.name)
  
  const editProduct = async (productId: number) => {
    console.log('Product edition is processing : ', productId)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const postNewProduct = async () => {
    console.log('New product creation is processing : ', product.value.name)
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const resetForm = () => {
    product.value = { ...DEFAULT_PRODUCT }
  }

  const setProducts = async () => {
    products.value = await productRepository.getProducts() 
    console.log(products.value)
  }

  const setProduct = async (productId: string) => {
    product.value = await productRepository.getProduct(productId)
    console.log(product.value)
    // console.log('Product is getting fetch : ', productId)
    // await new Promise(resolve => setTimeout(resolve, 1000))
    // product.value = { ...MOCKED_PRODUCT }
  }

  return {
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
