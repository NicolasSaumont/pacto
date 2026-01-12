<script setup lang='ts'>
const { t } = useI18n()

const { 
  columns,
} = useProducts()

const {
  notify
} = useNotify()

const productsStore = useProductsStore()

const { 
  deleteProduct,
  setProducts,
} = productsStore

const { 
  isProductGettingFetch,
  products
} = storeToRefs(productsStore)

const isDeleteProductConfirmationModalVisible = ref(false)
const productToDelete = ref<IProduct | null>(null)

const handleRowClick = (row: IProduct) => {
  navigateTo(`/products/${row.id}`)
}

const handleOpenDeleteProductConfirmationModalClick = (row: IProduct) => {
  productToDelete.value = row
  isDeleteProductConfirmationModalVisible.value = true
}

const handleDeleteProductClick = async () => {
  if (!productToDelete.value) return

  await deleteProduct(productToDelete.value.id.toString())
  await setProducts()

  productToDelete.value = null
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
      :loading="isProductGettingFetch"
      @row-click="handleRowClick"
    >
      <template #actions="{ row }">
        <div class="text-center">
          <Button 
            color="red"
            flat
            icon="trash" 
            @click.stop="handleOpenDeleteProductConfirmationModalClick(row)"
          />
        </div>
      </template>
    </Table>

    <Button 
      label="useNotify" 
      @click="notify({
        state: 'success',
        title: 'Sauvegardé',
        content: 'Tout est OK ✅',
      })"
    />

    <Modal 
      v-model="isDeleteProductConfirmationModalVisible"
      :description="t('product.delete.confirmation')"
      is-confirmation-modal
      :title="t('product.delete')"
      @confirm="handleDeleteProductClick"
    />
  </div>
</template>