import dayjs from 'dayjs'
import { defineStore } from 'pinia'

export const useOrdersStore = defineStore('orders', () => {
  const { convertToDayjs } = useDatePicker()

  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)

  const isOrderSaving = ref(false)
  const isOrderGettingFetch = ref(false)
  const order = ref<IOrder>(structuredClone(DEFAULT_ORDER))
  const orders = ref<IOrder[]>([])
  const originalOrder = ref<IOrder>(structuredClone(DEFAULT_ORDER))
  const searchDates = ref<IRangeDates>({
    start: dayjs(DEFAULT_SEARCH_DATES.start),
    end: dayjs(DEFAULT_SEARCH_DATES.end),
  })
  const selectedCustomerId = ref<number | null>(null)
  const selectedProducts = ref<number[]>([])

  const isConfirmButtonDisabled = computed(() => 
    !selectedCustomerId.value || 
    !order.value.orderDate ||
    Object.keys(orderPatch.value).length === 0
  )

  const buildItemsPatch = (
    current: IOrder['items'],
    original: IOrder['items']
  ) => {
    const patch: {
      add?: { productId: number; quantity: number }[]
      update?: { id: number; quantity: number }[]
      remove?: number[]
    } = {}

    // MAPS pour comparaison rapide
    const originalMap = new Map(
      original.map(item => [item.product.id, item])
    )

    const currentMap = new Map(
      current.map(item => [item.product.id, item])
    )

    // ADD / UPDATE
    for (const item of current) {
      const originalItem = originalMap.get(item.product.id)

      if (!originalItem) {
        patch.add ??= []
        patch.add.push({
          productId: item.product.id,
          quantity: item.quantity,
        })
      } else if (item.quantity !== originalItem.quantity) {
        patch.update ??= []
        patch.update.push({
          id: originalItem.id,
          quantity: item.quantity,
        })
      }
    }

    // REMOVE
    for (const item of original) {
      if (!currentMap.has(item.product.id)) {
        patch.remove ??= []
        patch.remove.push(item.id)
      }
    }

    return Object.keys(patch).length ? patch : null
  }

  const buildOrderPatch = (
    order: IOrder,
    original: IOrder,
    selectedCustomerId: number | null
  ) => {
    const body: Record<string, unknown> = {}

    // CUSTOMER
    if (selectedCustomerId !== original.customer?.id) {
      body.customerId = selectedCustomerId
    }

    // ORDER DATE
    if (!dayjs(order.orderDate).isSame(convertToDayjs(original.orderDate), 'day')) {
      body.orderDate = dayjs(order.orderDate).format(DATE_API_FORMAT)
    }

    // DELIVERY DATE
    if (!dayjs(order.deliveryDate).isSame(convertToDayjs(original.deliveryDate), 'day')) {
      body.deliveryDate = dayjs(order.deliveryDate).format(DATE_API_FORMAT)
    }

    // COMMENT
    if (order.comment !== original.comment) {
      body.comment = order.comment || null
    }

    // ITEMS
    const itemsPatch = buildItemsPatch(order.items, original.items)
    if (itemsPatch) {
      body.items = itemsPatch
    }

    return body
  }

  const orderPatch = computed(() =>
    buildOrderPatch(
      order.value,
      originalOrder.value,
      selectedCustomerId.value
    )
  )

  const editOrder = async (order: IOrder) => {
    try {
      const body = orderPatch.value

      // if (!Object.keys(body).length) return
      if (!Object.keys(body).length) {
        console.log('editOrder: rien à modifier')
        return true // <-- IMPORTANT pour withNotify
      }
      console.log('editOrder before fetch')
      await orderRepository.patchOrder(order.id, body)
      console.log('editOrder after fetch')

      originalOrder.value = structuredClone(order)
      console.log('editOrder success')
    } catch (error) {
      throw error
    }
  }

  const deleteOrder = async (orderId: string) => {
    try {
      await orderRepository.deleteOrder(orderId)
    } catch (error) {
      throw error
    }
  }

  const fillSelects = () => {
    selectedCustomerId.value = order.value.customer.id 

    selectedProducts.value = order.value.items.map(
      item => item.product.id
    )
  }

  const postNewOrder = async (order: IOrder) => {
    try {
      await orderRepository.postOrder(order)
    } catch (error) {
      throw error
    }
  }

  // const resetForm = () => {
  //   customer.value = structuredClone(DEFAULT_CUSTOMER)
  //   console.log(customer.value)
  // }

  const setOrder = async (orderId: string) => {
    order.value = await orderRepository.getOrder(orderId)
    originalOrder.value = structuredClone(toRaw(order.value))
  }

  const setOrders = async (searchDates: IRangeDates) => {
    orders.value = await orderRepository.getOrders(searchDates) 
  }

  // Aligne les lignes de commande avec les produits sélectionnés par l’utilisateur
  watch(selectedProducts, (ids) => {
    const currentItems = order.value.items ?? []

    const kept = currentItems.filter(item =>
      ids.includes(item.product.id)
    )

    const added = ids
      .filter(id => !kept.some(item => item.product.id === id))
      .map(id => {
        const product = products.value.find(product => product.id === id)
        if (!product) return null

        return {
          id: 0,           
          product,
          quantity: 0,
        }
      })
      .filter(
        (item): item is {
          id: number
          product: { id: number; name: string }
          quantity: number
        } => item !== null
      )

    // Tri des produits dans l'ordre alphabétique
    order.value.items = [...kept, ...added]
      .sort((a, b) =>
        a.product.name.localeCompare(b.product.name, 'fr', {
          sensitivity: 'base',
        })
      )
  })


  return {
    deleteOrder,
    editOrder,
    isConfirmButtonDisabled,
    isOrderGettingFetch,
    isOrderSaving,
    fillSelects,
    order,
    orders,
    originalOrder,
    postNewOrder,
    // resetForm,
    searchDates,
    selectedCustomerId,
    selectedProducts,
    setOrder,
    setOrders,
  }
})
