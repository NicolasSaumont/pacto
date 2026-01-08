<script setup lang='ts'>

interface IProduct {
  id: number
  name: string
}

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
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header />
    <Table 
      :columns="columns" 
      :data="MOCKED_PRODUCT" 
      filter
      class="flex-1" 
    />
  </div>
</template>