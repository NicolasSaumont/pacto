const { fetcher } = apiFactory()

export const customerRepository = {

  // async deleteProduct(id: string): Promise<void> {
  //   return fetcher<void>(`/products/${id}`, {
  //     method: 'DELETE',
  //   })
  // },

  // async getProduct(id: string): Promise<IProduct> {
  //   return fetcher<IProduct>(`/products/${id}`, {
  //     method: 'GET',
  //   })
  // },

  async getCustomers(): Promise<ICustomer[]> {
    return fetcher<ICustomer[]>('/customers', {
      method: 'GET',
    })
  },

  // async patchProduct(newProduct: IProduct): Promise<void> {
  //   return fetcher<void>(`/products/${newProduct.id}`, {
  //     method: 'PATCH',
  //     body: { name: newProduct.name }
  //   })
  // },

  // async postProduct(newProduct: IProduct): Promise<IProduct> {
  //   return fetcher<IProduct>('/products', {
  //     method: 'POST',
  //     body: { name: newProduct.name }
  //   })
  // },
}
