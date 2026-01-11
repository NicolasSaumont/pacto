<script setup lang='ts'>
const { t } = useI18n()

const { 
  columns,
} = useProducts()

const productsStore = useProductsStore()

const { 
  deleteProduct,
  setProducts,
} = productsStore

const { products } = storeToRefs(productsStore)

const handleRowClick = (row: IProduct) => {
  navigateTo(`/products/${row.id}`)
}

const handleDeleteProductClick = async (row: IProduct) => {
  await deleteProduct(row.id.toString())
  setProducts()
}

onMounted(setProducts)
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #header-right>
        <Button 
          :label="t('products.add-product')" 
          @click="navigateTo(PRODUCTS_CREATE)"
        />
      </template>
    </Header>
    
    <Table 
      :columns="columns" 
      :data="products" 
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