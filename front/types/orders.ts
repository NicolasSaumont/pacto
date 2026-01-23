import type { Dayjs } from "dayjs"

interface IOrderProduct {
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
