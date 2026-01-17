/* GENERAL */

export const APP_NAME = 'pacto'
export const INPUT_DEBOUNCE = 300
export const NOTIFICATION_DEFAULT_DURATION = 5000

export enum ModeEnum {
  CREATION = 'creation',
  EDITION = 'edition',
}
/* URL */

export const CUSTOMERS = '/customers'
export const CUSTOMERS_CREATE = '/customers/create'
export const MAIN = '/'
export const PRODUCTS = '/products'
export const PRODUCTS_CREATE = '/products/create'

/* PRODUCTS */

export const DEFAULT_PRODUCT = {
  id: 0,
  name: ''
}