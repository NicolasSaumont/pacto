import { useI18n } from 'vue-i18n'

export function useOrders() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const ordersStore = useOrdersStore()

  const { 
  //   editCustomer,
  //   postNewCustomer,
    setOrder,
    setOrders,
  } = ordersStore

  const { 
    isOrderGettingFetch,
  } = storeToRefs(ordersStore)

  const ordersColumns: IColumn<IOrder>[] = [
    {
      header: t('common.customers', 1),
      key: 'customerName',
      sortable: true,
      title: (row) => row.customerName
    },
    {
      header: t('common.dates', 1),
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
          .map(orderProduct => `${orderProduct.product.name} × ${orderProduct.quantity}`)
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

  const orderProductsColumns: IColumn<IOrderProduct>[] = [
    {
      header: t('common.products', 1),
      slot: 'products',
      sortable: true,
      sortByDefault: sortOrderEnum.ASC,
      title: (row) => row.product.name
    },
    {
      header: t('common.quantity'),
      key: 'quantity',
      sortable: true,
    }
  ]

  // const isDeleteCustomerConfirmationModalVisible = ref(false)

  const loadOrder = async () => {
    isOrderGettingFetch.value = true
    try {
      const orderId = getRouteParam(route.params.id)
      if (!orderId) {
        await navigateTo(ORDERS_URL)
        return
      }

      await withNotify(
        () => setOrder(orderId),
        {
          errorContent: t('order.api.get.error-message'),
          rethrow: true,
        }
      )
    } catch {
      await navigateTo(ORDERS_URL)
    } finally {
      isOrderGettingFetch.value = false
    }
  }

  const loadOrders = async (searchDates: IRangeDates) => {
    isOrderGettingFetch.value = true

    await withNotify(
      async () => {
        await setOrders(searchDates)
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
    // isDeleteCustomerConfirmationModalVisible,
    loadOrder,
    loadOrders,
    ordersColumns,
    orderProductsColumns,
    // sendCustomerToCreate,
    // sendCustomerToEdit,
  }
}