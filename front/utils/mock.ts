import dayjs from "dayjs"

export const MOCKED_PRODUCTS: IProduct[] = [
  { id: 1, name: 'Jambon blanc supérieur' },
  { id: 2, name: 'Saucisson sec pur porc' },
  { id: 3, name: 'Bacon nature' },
]

export const MOCKED_PRODUCT: IProduct = { id: 1, name: 'Jambon blanc supérieur' }

export const MOCKED_ORDERS: IOrder[] = [
  {
    id: 1,
    comment: 'Livraison urgente',
    customerName: 'Boucherie Martin',
    deliveryDate: dayjs().add(1, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 10 },
      { id: 2, product: MOCKED_PRODUCTS[1]!, quantity: 5 }
    ]
  },
  {
    id: 2,
    comment: '',
    customerName: 'Boucherie Dupont',
    deliveryDate: dayjs().add(2, 'day'),
    orderDate: dayjs().subtract(1, 'day'),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[2]!, quantity: 20 }
    ]
  },
  {
    id: 3,
    comment: 'Commande hebdomadaire',
    customerName: 'Supermarché Central',
    deliveryDate: dayjs().add(3, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 50 },
      { id: 2, product: MOCKED_PRODUCTS[1]!, quantity: 30 },
      { id: 3, product: MOCKED_PRODUCTS[2]!, quantity: 40 }
    ]
  },
  {
    id: 4,
    comment: 'Client prioritaire',
    customerName: 'Restaurant Le Gourmet',
    deliveryDate: dayjs().add(1, 'week'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[1]!, quantity: 15 }
    ]
  },
  {
    id: 5,
    comment: 'À livrer le matin',
    customerName: 'Cantine scolaire',
    deliveryDate: dayjs().add(5, 'day'),
    orderDate: dayjs().subtract(2, 'day'),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 25 }
    ]
  },
  {
    id: 6,
    comment: '',
    customerName: 'Hôpital Général',
    deliveryDate: dayjs().add(4, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[2]!, quantity: 60 }
    ]
  },
  {
    id: 7,
    comment: 'Commande spéciale',
    customerName: 'Restaurant Italien',
    deliveryDate: dayjs().add(6, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[1]!, quantity: 12 },
      { id: 2, product: MOCKED_PRODUCTS[2]!, quantity: 18 }
    ]
  },
  {
    id: 8,
    comment: 'Ne pas oublier facture',
    customerName: 'Traiteur Express',
    deliveryDate: dayjs().add(2, 'week'),
    orderDate: dayjs().subtract(3, 'day'),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 8 }
    ]
  },
  {
    id: 9,
    comment: '',
    customerName: 'Marché Local',
    deliveryDate: dayjs().add(1, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 5 },
      { id: 2, product: MOCKED_PRODUCTS[1]!, quantity: 5 },
      { id: 3, product: MOCKED_PRODUCTS[2]!, quantity: 5 }
    ]
  },
  {
    id: 10,
    comment: 'Livraison unique',
    customerName: 'Événement Privé',
    deliveryDate: dayjs().add(10, 'day'),
    orderDate: dayjs(),
    products: [
      { id: 1, product: MOCKED_PRODUCTS[1]!, quantity: 40 }
    ]
  }
]

export const MOCKED_ORDER = {
  id: 1,
  comment: 'Livraison urgente',
  customerName: 'Boucherie Martin',
  deliveryDate: dayjs().add(1, 'day'),
  orderDate: dayjs(),
  products: [
    { id: 1, product: MOCKED_PRODUCTS[0]!, quantity: 10 },
    { id: 2, product: MOCKED_PRODUCTS[1]!, quantity: 5 }
  ]
}