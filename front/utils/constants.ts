import dayjs from "dayjs"

/* GENERAL */

export const APP_NAME = 'pacto'
export const DATE_FORMAT = 'DD/MM/YYYY'
export const DATE_API_FORMAT = 'YYYY-MM-DD'
export const DATE_MONTH_YEAR_ONLY_FORMAT = 'MMMM YYYY'
export const INPUT_DEBOUNCE = 300
export const LOADER_MIN_DURATION = 500
export const LOADER_TIMEOUT_DURATION = 200
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
export const ORDERS_CREATE_URL = '/orders/create'
export const PRODUCTS_URL = '/products'
export const PRODUCTS_CREATE_URL = '/products/create'

/* LOGO */

export const BASE_LOGO_SOURCE = '/logo'
export const BLUE_TRANSPARENT_LOGO_SOURCE = '/blue-transparent-logo.png'
export const LIGHT_TRANSPARENT_LOGO_SOURCE = '/light-transparent-logo.png'

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

/* ORDERS */

export const DEFAULT_SEARCH_DATES = {
  end: dayjs(),
  start: dayjs().subtract(2, 'weeks')
}

export const DEFAULT_ORDER = {
  id: 0,
  comment: undefined,
  customer: {
    id: 0,
    name: '',
  },
  deliveryDate: undefined,
  items: [],
  orderDate: dayjs(),
}