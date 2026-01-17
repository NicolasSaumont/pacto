const { fetcher } = apiFactory()

export const customerRepository = {

  // async deleteProduct(id: string): Promise<void> {
  //   return fetcher<void>(`/products/${id}`, {
  //     method: 'DELETE',
  //   })
  // },

  async getCustomer(id: string): Promise<ICustomer> {
    return fetcher<ICustomer>(`/customers/${id}`, {
      method: 'GET',
    })
  },

  async getCustomers(): Promise<ICustomer[]> {
    return fetcher<ICustomer[]>('/customers', {
      method: 'GET',
    })
  },

  async patchCustomer(newCustomer: ICustomer): Promise<void> {
    return fetcher<void>(`/products/${newCustomer.id}`, {
      method: 'PATCH',
      body: { name: newCustomer.name }
    })
  },

  async postCustomer(newCustomer: ICustomer): Promise<ICustomer> {
    return fetcher<ICustomer>('/customers', {
      method: 'POST',
      body: { name: newCustomer.name }
    })
  },
}
