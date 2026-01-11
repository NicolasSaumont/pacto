const { fetcher } = apiFactory()

export const productRepository = {

  async deleteProduct(id: string): Promise<void> {
    return fetcher<void>(`/products/${id}`, {
      method: 'DELETE',
    })
  },

  async getProduct(id: string): Promise<IProduct> {
    const { public: { apiBase } } = useRuntimeConfig()
    return await $fetch<IProduct>(`${apiBase}/products/${id}`)
  },

  async getProducts(): Promise<IProduct[]> {
    const { public: { apiBase } } = useRuntimeConfig()
    return await $fetch<IProduct[]>(`${apiBase}/products`)
  },

  // create(payload: Pick<IProduct, 'name'>): Promise<IProduct> {
  //   return fetcher<IProduct>('/products', {
  //     method: 'POST',
  //     body: payload,
  //   })
  // },
}
