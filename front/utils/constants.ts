/* GENERAL */

export const APP_NAME = 'pacto'
export const INPUT_DEBOUNCE = 300
export const NOTIFICATION_DEFAULT_DURATION = 5000
export const SKELETON_ROWS = 8

export enum ModeEnum {
  CREATION = 'creation',
  EDITION = 'edition',
}
/* URL */

export const CUSTOMERS_URL = '/customers'
export const CUSTOMERS_CREATE_URL = '/customers/create'
export const MAIN_URL = '/'
export const ORDERS_URL = '/orders'
export const PRODUCTS_URL = '/products'
export const PRODUCTS_CREATE_URL = '/products/create'

/* PRODUCTS */

export const DEFAULT_PRODUCT = {
  id: 0,
  name: ''
}

/* CUSTOMERS */

export const DEFAULT_CUSTOMER = {
  id: 0,
  name: '',
  products: []
}