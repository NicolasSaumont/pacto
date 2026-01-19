const { fetcher } = apiFactory()

export const customerRepository = {
  async deleteCustomer(id: string): Promise<void> {
    return fetcher<void>(`/customers/${id}`, {
      method: 'DELETE',
    })
  },

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

  // async patchCustomer(newCustomer: ICustomer): Promise<void> {
  //   return fetcher<void>(`/customers/${newCustomer.id}`, {
  //     method: 'PATCH',
  //     body: {
  //       name: newCustomer.name,
  //       productIds: (newCustomer.products ?? []).map((product) => product.id),
  //     },
  //   })
  // },

  async patchCustomer(id: number, body: Record<string, unknown>): Promise<void> {
    console.log('patchCustomer')
    return fetcher<void>(`/customers/${id}`, {
      method: 'PATCH',
      body,
    })
  },

  async postCustomer(newCustomer: ICustomer): Promise<ICustomer> {
    return fetcher<ICustomer>('/customers', {
      method: 'POST',
      body: { name: newCustomer.name },
    })
  },
}
