import dayjs from 'dayjs'
import { defineStore } from 'pinia'
import { toRaw } from 'vue'

export const useOrdersStore = defineStore('orders', () => {
  const { convertToDayjs } = useDatePicker()

  const productsStore = useProductsStore()
  const { products } = storeToRefs(productsStore)

  const isDuplicationWanted = ref(false)
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

    const originalByProductId = new Map(original.map(i => [i.product.id, i]))
    const currentByProductId = new Map(current.map(i => [i.product.id, i]))

    // ADD / UPDATE / REMOVE-by-zero
    for (const item of current) {
      const originalItem = originalByProductId.get(item.product.id)
      const quantity = item.quantity ?? 0

      // Si quantity = 0 => supprimer si existait, sinon ignorer (pas d'add)
      if (quantity === 0) {
        if (originalItem) {
          patch.remove ??= []
          patch.remove.push(originalItem.id)
        }
        continue
      }

      // quantity > 0
      if (!originalItem) {
        patch.add ??= []
        patch.add.push({ productId: item.product.id, quantity: quantity })
      } else if (quantity !== originalItem.quantity) {
        patch.update ??= []
        patch.update.push({ id: originalItem.id, quantity: quantity })
      }
    }

    // REMOVE (produit désélectionné)
    for (const item of original) {
      if (!currentByProductId.has(item.product.id)) {
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
    const orderDate = convertToDayjs(order.orderDate)
    const originalOrderDate = convertToDayjs(original.orderDate)

    if (orderDate && !orderDate.isSame(originalOrderDate, 'day')) {
      body.orderDate = orderDate.format(DATE_API_FORMAT)
    }

    // DELIVERY DATE
    const deliveryDate = convertToDayjs(order.deliveryDate)
    const originalDeliveryDate = convertToDayjs(original.deliveryDate)
    if (deliveryDate && !deliveryDate.isSame(originalDeliveryDate, 'day')) {
      body.deliveryDate = deliveryDate.format(DATE_API_FORMAT)
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

      if (!Object.keys(body).length) return

      const updatedOrder = await orderRepository.patchOrder(order.id, body)

      // resync snapshot
      originalOrder.value = structuredClone(toRaw(updatedOrder))
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
    isDuplicationWanted,
    isOrderGettingFetch,
    isOrderSaving,
    fillSelects,
    order,
    orders,
    originalOrder,
    postNewOrder,
    searchDates,
    selectedCustomerId,
    selectedProducts,
    setOrder,
    setOrders,
  }
})
