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
  }
]
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header />
    <Table class="flex-1" :columns="columns" :data="MOCKED_PRODUCT">
      <template #header-right> blabla </template>
    </Table>
  </div>
</template>