const { fetcher } = apiFactory()

export const orderRepository = {
  // async deleteCustomer(id: string): Promise<void> {
  //   return fetcher<void>(`/customers/${id}`, {
  //     method: 'DELETE',
  //   })
  // },

  // async getCustomer(id: string): Promise<ICustomer> {
  //   return fetcher<ICustomer>(`/customers/${id}`, {
  //     method: 'GET',
  //   })
  // },

  async getOrders(searchDates: IOrderSearchDates): Promise<IOrder[]> {
    // return fetcher<IOrder[]>('/orders', {
    //   method: 'GET',
    //   params: {
    //     startDate: searchDates.start, 
    //     endDate: searchDates.end 
    //   }
    // })
    return MOCKED_ORDERS
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
