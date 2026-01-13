import { useI18n } from 'vue-i18n'

export function useProducts() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const productsStore = useProductsStore()

  const { 
    deleteProduct,
    setProduct,
    setProducts,
  } = productsStore

  const { 
    isProductGettingFetch,
  } = storeToRefs(productsStore)

  const columns: IColumn<IProduct>[] = [
    {
      header: t('common.products', 1),
      key: 'name',
      sortable: true,
    },
    {
      header: '',
      size: '10%',
      slot: 'actions'
    }
  ]

  const isDeleteProductConfirmationModalVisible = ref(false)
  const productToDelete = ref<IProduct | null>(null)

  const fetchProductOnMount = async () => {
    isProductGettingFetch.value = true
    try {
      const productId = getRouteParam(route.params.id)
      if (!productId) {
        await navigateTo('/products')
        return
      }

      await withNotify(
        () => setProduct(productId),
        {
          errorContent: t('product.api.get.error-message'),
          rethrow: true,
        }
      )
    } catch (error) {
      await navigateTo('/products')
    } finally {
      isProductGettingFetch.value = false
    }
  }

  const fetchProductsOnMount = async () => {
    isProductGettingFetch.value = true

    await withNotify(
      async () => {
        await setProducts()
      },
      {
        errorContent: t('products.api.get.error-message'),
      }
    )

    isProductGettingFetch.value = false
  }

  const handleDeleteProductClick = async () => {
    if (!productToDelete.value) return

    const productId = productToDelete.value.id.toString()

    await withNotify(
      async () => {
        await deleteProduct(productId)
        await setProducts()
      },
      {
        successContent: t('product.api.delete.success-message'),
        errorContent: t('product.api.delete.error-message'),
      }
    )
    
    productToDelete.value = null
    isDeleteProductConfirmationModalVisible.value = false
  }

  const handleOpenDeleteProductConfirmationModalClick = (row: IProduct) => {
    productToDelete.value = row
    isDeleteProductConfirmationModalVisible.value = true
  }

  const handleRowClick = (row: IProduct) => {
    navigateTo(`/products/${row.id}`)
  }
  
  return { 
    columns,
    fetchProductOnMount,
    fetchProductsOnMount,
    handleDeleteProductClick,
    handleOpenDeleteProductConfirmationModalClick,
    handleRowClick,
    isDeleteProductConfirmationModalVisible,
  }
}