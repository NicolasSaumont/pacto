<script setup lang='ts'>
const { t } = useI18n()

const { 
  columns,
} = useProducts()

const handleRowClick = (row: IProduct) => {
  navigateTo(`/products/${row.id}`)
}

const handleDeleteProductClick = (row: IProduct) => {
  console.log('Delete product :', row)
}
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #header-right>
        <Button 
          :label="t('products.add-product')" 
          @click="navigateTo('/products/create')"
        />
      </template>
    </Header>
    
    <Table 
      :columns="columns" 
      :data="MOCKED_PRODUCT" 
      filter
      class="flex-1" 
      @row-click="handleRowClick"
    >
      <template #actions="{ row }">
        <div class="text-center">
          <Button 
            color="red"
            flat
            icon="trash" 
            @click="handleDeleteProductClick(row)"
          />
        </div>
      </template>
    </Table>
  </div>
</template>