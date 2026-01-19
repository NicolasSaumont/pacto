<script setup lang='ts'>
const { t } = useI18n()

const { withNotify } = useNotifyAction()

const {
  columns,
  isDeleteProductConfirmationModalVisible,
  loadProducts,
} = useProducts()

const productsStore = useProductsStore()

const {
  deleteProduct,
  setProducts,
} = productsStore

const { 
  isProductGettingFetch,
  products
} = storeToRefs(productsStore)

const productToDelete = ref<IProduct | null>(null)

const handleDeleteProductClick = async () => {
  if (!productToDelete.value) return

  const productId = productToDelete.value.id.toString()

  await withNotify(
    async () => {
      await deleteProduct(productId)
      await setProducts()
    },
    {
      successContent: t('product.api.delete.success-message'),
      errorContent: t('product.api.delete.error-message'),
    }
  )
  
  productToDelete.value = null
  isDeleteProductConfirmationModalVisible.value = false
}

const handleOpenDeleteProductConfirmationModalClick = (row: IProduct) => {
  productToDelete.value = row
  isDeleteProductConfirmationModalVisible.value = true
}

const handleRowClick = (row: IProduct) => {
  navigateTo(`/products/${row.id}`)
}

onMounted(loadProducts)
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
            :color="ButtonColorEnum.RED"
            flat
            icon="trash" 
            @click.stop="handleOpenDeleteProductConfirmationModalClick(row)"
          />
        </div>
      </template>
    </Table>

    <Modal 
      v-model="isDeleteProductConfirmationModalVisible"
      :description="t('product.delete.confirmation')"
      is-confirmation-modal
      :title="t('product.delete')"
      @confirm="handleDeleteProductClick"
    />
  </div>
</template>