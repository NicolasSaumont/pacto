export interface ICustomer {
  id: number
  name: string
  products: IProduct[]
}

export type ICustomerOnly = Omit<ICustomer, 'products'>
