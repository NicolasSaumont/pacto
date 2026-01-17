import { useI18n } from 'vue-i18n'

export function useCustomers() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

const customersStore = useCustomersStore()

  const { 
    // editProduct,
    // postNewProduct,
    // setProduct,
    setCustomers,
  } = customersStore

  const { 
    isCustomerGettingFetch,
  } = storeToRefs(customersStore)

  const columns: IColumn<ICustomer>[] = [
    {
      header: t('common.customers', 1),
      key: 'name',
      sortable: true,
      sortByDefault: sortOrderEnum.ASC
    },
    {
      header: '',
      size: '10%',
      slot: 'actions'
    }
  ]

  // const isDeleteProductConfirmationModalVisible = ref(false)

  // const loadProduct = async () => {
  //   isProductGettingFetch.value = true
  //   try {
  //     const productId = getRouteParam(route.params.id)
  //     if (!productId) {
  //       await navigateTo('/products')
  //       return
  //     }

  //     await withNotify(
  //       () => setProduct(productId),
  //       {
  //         errorContent: t('product.api.get.error-message'),
  //         rethrow: true,
  //       }
  //     )
  //   } catch {
  //     await navigateTo('/products')
  //   } finally {
  //     isProductGettingFetch.value = false
  //   }
  // }

  const loadCustomers = async () => {
    isCustomerGettingFetch.value = true

    await withNotify(
      async () => {
        await setCustomers()
      },
      {
        errorContent: t('products.api.get.error-message'),
      }
    )

    isCustomerGettingFetch.value = false
  }

  // const sendProductToCreate = async (product: IProduct) => {
  //   await withNotify(
  //     async () => {
  //       await postNewProduct(product)
  //     },
  //     {
  //       successContent: t('product.api.post.success-message'),
  //       errorContent: t('product.api.post.error-message'),
  //       rethrow: true,
  //     }
  //   )
  // }

  // const sendProductToEdit = async (product: IProduct) => {
  //   await withNotify(
  //     async () => {
  //       await editProduct(product)
  //     },
  //     {
  //       successContent: t('product.api.edit.success-message'),
  //       errorContent: t('product.api.edit.error-message'),
  //       rethrow: true,
  //     }
  //   )
  // }
  
  return { 
    columns,
    // isDeleteProductConfirmationModalVisible,
    loadCustomers,
    // loadProducts,
    // sendProductToCreate,
    // sendProductToEdit,
  }
}