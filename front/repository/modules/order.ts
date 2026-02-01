import dayjs from "dayjs"

const { fetcher } = apiFactory()
const { convertToDayjs } = useDatePicker()

export const orderRepository = {
  async deleteOrder(id: string): Promise<void> {
    return fetcher<void>(`/orders/${id}`, {
      method: 'DELETE',
    })
  },

  async getOrder(id: string): Promise<IOrder> {
    const order = await fetcher<IOrder>(`/orders/${id}`, {
      method: 'GET',
    })

    return {
      ...order,
      orderDate: dayjs(order.orderDate),
      deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : undefined,
    }
  },

  async getOrders(searchDates: IRangeDates): Promise<IOrder[]> {
    const orders = await fetcher<IOrder[]>('/orders', {
      method: 'GET',
      params: {
        startDate: dayjs(searchDates.start).format(DATE_API_FORMAT), 
        endDate: dayjs(searchDates.end).format(DATE_API_FORMAT) 
      }
    })

    return orders.map(order => ({
      ...order,
      orderDate: dayjs(order.orderDate),
      deliveryDate: order.deliveryDate ? dayjs(order.deliveryDate) : undefined,
    }))
  },

  // async patchCustomer(id: number, body: Record<string, unknown>): Promise<void> {
  //   return fetcher<void>(`/customers/${id}`, {
  //     method: 'PATCH',
  //     body,
  //   })
  // },

  async postOrder(newOrder: IOrder): Promise<IOrder> {
    const orderDate = convertToDayjs(newOrder.orderDate)
    const deliveryDate = convertToDayjs(newOrder.deliveryDate)

    return fetcher<IOrder>('/orders', {
      method: 'POST',
      body: {
        customerId: newOrder.customer.id,
        orderDate: orderDate?.format(DATE_API_FORMAT),
        deliveryDate: deliveryDate?.format(DATE_API_FORMAT),
        comment: newOrder.comment,
        items: newOrder.items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity
        }))
      },
    })
  },
}
