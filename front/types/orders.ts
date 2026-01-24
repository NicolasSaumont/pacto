import type { Dayjs } from "dayjs"

export interface IOrderProduct {
  id: number
  product: IProduct
  quantity: number
}

export interface IOrder {
  id: number
  comment?: string
  customerName: string
  deliveryDate?: Dayjs
  orderDate: Dayjs
  products: IOrderProduct[]
}
