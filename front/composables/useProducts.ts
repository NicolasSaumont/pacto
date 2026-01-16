import { useI18n } from 'vue-i18n'

export function useProducts() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const productsStore = useProductsStore()

  const { 
    deleteProduct,
    editProduct,
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

  const loadProduct = async () => {
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
    } catch {
      await navigateTo('/products')
    } finally {
      isProductGettingFetch.value = false
    }
  }

  const loadProducts = async () => {
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

  const sendProductToEdit = async (product: IProduct) => {
    await withNotify(
      async () => {
        await editProduct(product)
      },
      {
        successContent: t('product.api.edit.success-message'),
        errorContent: t('product.api.edit.error-message'),
        rethrow: true,
      }
    )
  }
  
  return { 
    columns,
    isDeleteProductConfirmationModalVisible,
    loadProduct,
    loadProducts,
    sendProductToEdit,
  }
}