import { useI18n } from 'vue-i18n'

export function useOrders() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const ordersStore = useOrdersStore()

  const { 
    editOrder,
    postNewOrder,
    setOrder,
    setOrders,
  } = ordersStore

  const { 
    isOrderGettingFetch,
  } = storeToRefs(ordersStore)

  const ordersColumns: IColumn<IOrder>[] = [
    {
      header: t('common.customers', 1),
      searchable: true,
      searchValue: (row) => row.customer?.name,
      slot: 'customers',
      sortable: true,
      sortValue: (row) => row.customer?.name,
      title: (row) => row.customer.name
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
      slot: 'items',
      title: (row) =>
        row.items
          .map(item => `${item.product.name} × ${item.quantity}`)
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

  const orderProductsColumns: IColumn<IItem>[] = [
    {
      header: t('common.products', 1),
      slot: 'items',
      sortable: true,
      sortByDefault: sortOrderEnum.ASC,
      title: (row) => row.product.name
    },
    {
      header: t('common.quantity'),
      slot: 'quantity',
      sortable: true,
    }
  ]

  const isDeleteOrderConfirmationModalVisible = ref(false)

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

  const sendOrderToCreate = async (order: IOrder) => {
    await withNotify(
      async () => {
        await postNewOrder(order)
      },
      {
        successContent: t('order.api.post.success-message'),
        errorContent: t('customer.api.post.error-message'),
        rethrow: true,
      }
    )
  }

  const sendOrderToEdit = async (order: IOrder) => {
    console.log('sendOrderToEdit')
    await withNotify(
      async () => {
        await editOrder(order)
      },
      {
        successContent: t('order.api.edit.success-message'),
        errorContent: t('order.api.edit.error-message'),
        rethrow: true,
      }
    )
  }
  
  return { 
    isDeleteOrderConfirmationModalVisible,
    loadOrder,
    loadOrders,
    ordersColumns,
    orderProductsColumns,
    sendOrderToCreate,
    sendOrderToEdit,
  }
}