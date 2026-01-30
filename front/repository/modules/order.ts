import dayjs from "dayjs"

const { fetcher } = apiFactory()

export const orderRepository = {
  // async deleteCustomer(id: string): Promise<void> {
  //   return fetcher<void>(`/customers/${id}`, {
  //     method: 'DELETE',
  //   })
  // },

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

  // async postCustomer(newCustomer: ICustomer): Promise<ICustomer> {
  //   return fetcher<ICustomer>('/customers', {
  //     method: 'POST',
  //     body: { 
  //       name: newCustomer.name,
  //       productIds: (newCustomer.products ?? []).map(product => product.id),
  //     },
  //   })
  // },
}
