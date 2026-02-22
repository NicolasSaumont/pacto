<script setup lang='ts'>
defineProps<{
  products: IProductSummary[]
}>()

const { t } = useI18n()

const ordersStore = useOrdersStore()

const { 
  isOrderGettingFetch, 
} = storeToRefs(ordersStore)

const productsSummaryColumns: IColumn<IProductSummary>[] = [
  {
    header: t('common.products', 1),
    key: 'name',
    sortable: true,
    sortByDefault: sortOrderEnum.ASC,
    title: (row) => row.name
  },
  {
    header: t('common.quantity'),
    key: 'quantity',
    sortable: true,
  }
]
</script>

<template>
  <Table 
    :columns="productsSummaryColumns" 
    :data="products"
    filter
    :loading="isOrderGettingFetch"
  />
</template>
