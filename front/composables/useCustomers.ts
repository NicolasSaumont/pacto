import { useI18n } from 'vue-i18n'

export function useCustomers() {
  const route = useRoute()
  const { t } = useI18n()
  const { withNotify } = useNotifyAction()

  const customersStore = useCustomersStore()

  const { 
    editCustomer,
    postNewCustomer,
    setCustomer,
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

  const isDeleteCustomerConfirmationModalVisible = ref(false)

  const loadCustomer = async () => {
    let showLoader = true

    const loaderTimeout = setTimeout(() => {
      if (showLoader) {
        isCustomerGettingFetch.value = true
      }
    }, LOADER_TIMEOUT_DURATION)
    try {
      const customerId = getRouteParam(route.params.id)
      if (!customerId) {
        await navigateTo(CUSTOMERS_URL)
        return
      }

      await withNotify(
        () => setCustomer(customerId),
        {
          errorContent: t('customer.api.get.error-message'),
          rethrow: true,
        }
      )
    } catch {
      await navigateTo(CUSTOMERS_URL)
    } finally {
      showLoader = false
      clearTimeout(loaderTimeout)
      isCustomerGettingFetch.value = false
    }
  }

  const loadCustomers = async () => {
    let showLoader = true

    const loaderTimeout = setTimeout(() => {
      if (showLoader) {
        isCustomerGettingFetch.value = true
      }
    }, LOADER_TIMEOUT_DURATION)

    await withNotify(
      async () => {
        await setCustomers()
      },
      {
        errorContent: t('products.api.get.error-message'),
      }
    )

    showLoader = false
    clearTimeout(loaderTimeout)

    isCustomerGettingFetch.value = false
  }

  const sendCustomerToCreate = async (customer: ICustomer) => {
    await withNotify(
      async () => {
        await postNewCustomer(customer)
      },
      {
        successContent: t('customer.api.post.success-message'),
        errorContent: t('customer.api.post.error-message'),
        rethrow: true,
      }
    )
  }

  const sendCustomerToEdit = async (customer: ICustomer) => {
    await withNotify(
      async () => {
        await editCustomer(customer)
      },
      {
        successContent: t('customer.api.edit.success-message'),
        errorContent: t('customer.api.edit.error-message'),
        rethrow: true,
      }
    )
  }
  
  return { 
    columns,
    isDeleteCustomerConfirmationModalVisible,
    loadCustomer,
    loadCustomers,
    sendCustomerToCreate,
    sendCustomerToEdit,
  }
}