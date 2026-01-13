const { fetcher } = apiFactory()

export const productRepository = {

  async deleteProduct(id: string): Promise<void> {
    return fetcher<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  },

  async getProduct(id: string): Promise<IProduct> {
    return fetcher<IProduct>(`/products/${id}`, {
      method: 'GET',
    })
  },

  async getProducts(): Promise<IProduct[]> {
    return fetcher<IProduct[]>('/products', {
      method: 'GET',
    })
  },

  async updateProduct(newProduct: IProduct): Promise<void> {
    return fetcher<void>(`/products/${newProduct.id}`, {
      method: 'PATCH',
      body: { name: newProduct.name }
    })
  },

  // create(payload: Pick<IProduct, 'name'>): Promise<IProduct> {
  //   return fetcher<IProduct>('/products', {
  //     method: 'POST',
  //     body: payload,
  //   })
  // },
}
