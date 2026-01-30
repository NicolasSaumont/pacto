import type { Dayjs } from "dayjs"

export interface IItem {
  id: number
  product: IProduct
  quantity: number
}

export interface IOrder {
  id: number
  comment?: string
  orderDate: Dayjs
  deliveryDate?: Dayjs
  customer: ICustomerOnly
  items: IItem[]
}
