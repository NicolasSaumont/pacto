import { useI18n } from 'vue-i18n'

export function useProducts() {
const { t } = useI18n()

const columns: IColumn<IProduct>[] = [
  {
    header: t('common.products', 1),
    key: 'name',
    sortable: true,
  },
  {
    header: '',
    size: '10%',
    slot: 'actions'
  }
]
  
  return { 
    columns,
  }
}