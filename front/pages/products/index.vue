<script setup lang='ts'>
const { t } = useI18n()

const { notify } = useNotify()

const {
  columns,
  handleDeleteProductClick,
  handleOpenDeleteProductConfirmationModalClick,
  handleRowClick,
  isDeleteProductConfirmationModalVisible,
  loadProducts,
} = useProducts()

const productsStore = useProductsStore()

const { 
  isProductGettingFetch,
  products
} = storeToRefs(productsStore)

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
        state: 'info',
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