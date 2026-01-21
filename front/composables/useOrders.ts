import { useI18n } from 'vue-i18n'

export function useOrders() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const ordersStore = useOrdersStore()

  const { 
  //   editCustomer,
  //   postNewCustomer,
  //   setCustomer,
    setOrders,
  } = ordersStore

  const { 
    isOrderGettingFetch,
  } = storeToRefs(ordersStore)

  const columns: IColumn<IOrder>[] = [
    {
      header: t('common.customers', 1),
      key: 'customerName',
      sortable: true,
      title: (row) => row.customerName
    },
    {
      header: t('common.date'),
      key: 'orderDate',
      sortable: true,
      sortByDefault: sortOrderEnum.DESC
    },
    {
      header: t('order.delivery-date'),
      key: 'deliveryDate',
    },
    {
      header: t('common.products', 2),
      slot: 'products',
      title: (row) =>
        row.products
          .map(p => `${p.product.name} × ${p.quantity}`)
          .join('\n')
    },
    {
      header: t('common.comments', 2),
      key: 'comment',
      title: (row) => row.comment ?? ''
    },
    {
      header: '',
      size: '10%',
      slot: 'actions'
    }
  ]

  // const isDeleteCustomerConfirmationModalVisible = ref(false)

  // const loadCustomer = async () => {
  //   isCustomerGettingFetch.value = true
  //   try {
  //     const customerId = getRouteParam(route.params.id)
  //     if (!customerId) {
  //       await navigateTo(CUSTOMERS_URL)
  //       return
  //     }

  //     await withNotify(
  //       () => setCustomer(customerId),
  //       {
  //         errorContent: t('customer.api.get.error-message'),
  //         rethrow: true,
  //       }
  //     )
  //   } catch {
  //     await navigateTo(CUSTOMERS_URL)
  //   } finally {
  //     isCustomerGettingFetch.value = false
  //   }
  // }

  const loadOrders = async () => {
    isOrderGettingFetch.value = true

    await withNotify(
      async () => {
        await setOrders()
      },
      {
        errorContent: t('orders.api.get.error-message'),
      }
    )

    isOrderGettingFetch.value = false
  }

  // const sendCustomerToCreate = async (customer: ICustomer) => {
  //   await withNotify(
  //     async () => {
  //       await postNewCustomer(customer)
  //     },
  //     {
  //       successContent: t('customer.api.post.success-message'),
  //       errorContent: t('customer.api.post.error-message'),
  //       rethrow: true,
  //     }
  //   )
  // }

  // const sendCustomerToEdit = async (customer: ICustomer) => {
  //   await withNotify(
  //     async () => {
  //       await editCustomer(customer)
  //     },
  //     {
  //       successContent: t('customer.api.edit.success-message'),
  //       errorContent: t('customer.api.edit.error-message'),
  //       rethrow: true,
  //     }
  //   )
  // }
  
  return { 
    columns,
    // isDeleteCustomerConfirmationModalVisible,
    loadOrders,
    // loadCustomers,
    // sendCustomerToCreate,
    // sendCustomerToEdit,
  }
}