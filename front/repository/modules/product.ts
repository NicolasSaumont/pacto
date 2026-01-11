const { fetcher } = apiFactory()

export const productRepository = {
  async getProducts(): Promise<IProduct[]> {
    const { public: { apiBase } } = useRuntimeConfig()
    return await $fetch<IProduct[]>(`${apiBase}/products`)
  },

  async getProduct(id: string): Promise<IProduct> {
    const { public: { apiBase } } = useRuntimeConfig()
    return await $fetch<IProduct>(`${apiBase}/products/${id}`)
  },

  // create(payload: Pick<IProduct, 'name'>): Promise<IProduct> {
  //   return fetcher<IProduct>('/products', {
  //     method: 'POST',
  //     body: payload,
  //   })
  // },

  // delete(id: number): Promise<void> {
  //   return fetcher<void>(`/products/${id}`, {
  //     method: 'DELETE',
  //   })
  // },
}
