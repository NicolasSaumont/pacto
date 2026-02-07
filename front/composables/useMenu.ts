import { useI18n } from 'vue-i18n'

export function useMenu() {
  const { t } = useI18n()
  const route = useRoute()

  interface IMenuItem {
    label: string
    description: string
    path: string
    icon: string
  }

  const menuItems: IMenuItem[] = [
    { label: t('common.synthesis'), description: t('common.dashboard'), path: MAIN_URL, icon: 'file-contract' },
    { label: t('common.orders', 2), description: t('common.order-taking'), path: ORDERS_URL, icon: 'file-pen' },
    { label: t('common.customers', 2), description: t('customers.management'), path: CUSTOMERS_URL, icon: 'users' },
    { label: t('common.products', 2), description: t('products.management'), path: PRODUCTS_URL, icon: 'boxes-stacked' },
    { label: 'Model', path: '/model', description: t('model'), icon: 'users' }
  ]

  const currentMenuItem = computed<IMenuItem>(() => {
    return menuItems.find(item => item.path === route.path) || { label: '', description: '', path: '', icon: '' }
  })

  const menuItemClass = (path: string) => {
    const base = 'flex gap-2 items-center px-3 py-2 rounded-lg transition'
  
    const isActive = 'bg-blue-800 text-white'
    const isInactive = 'hover:bg-blue-800 hover:text-white'
  
    return [
      base,
      route.path === path ? isActive : isInactive
    ]
  }

  return { 
    currentMenuItem,
    menuItemClass,
    menuItems, 
  }
}