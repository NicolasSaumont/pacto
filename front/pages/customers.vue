<script setup lang='ts'>
const { t } = useI18n()

const { withNotify } = useNotifyAction()

interface IProduct {
  id: number
  name: string
  date: string
  products: number
  total: string
}

const columns: IColumn<IProduct>[] = [
  {
    header: 'Client',
    key: 'name',
  },
  {
    header: 'Date',
    key: 'date',
  },
  {
    header: 'Produits',
    key: 'products',
  },
  {
    header: 'Total',
    key: 'total',
  },
]

const data: IProduct[] = [
  {
    id: 1,
    name: 'Boucherie Martin',
    date: '05/01/2026',
    products: 8,
    total: '42 kg',
  },
  {
    id: 2,
    name: 'Boucherie Dupont',
    date: '10/01/2026',
    products: 5,
    total: '30 kg',
  },
  {
    id: 3,
    name: 'Boucherie Bernard',
    date: '15/01/2026',
    products: 12,
    total: '60 kg',
  },
]

const {
  // columns,
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
          :label="t('customers.add-customer')" 
          @click="navigateTo(CUSTOMERS_CREATE)"
        />
      </template>
    </Header>
    
    <!-- <Table 
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
    </Table> -->

    <!-- <Modal 
      v-model="isDeleteProductConfirmationModalVisible"
      :description="t('product.delete.confirmation')"
      is-confirmation-modal
      :title="t('product.delete')"
      @confirm="handleDeleteProductClick"
    /> -->
  </div>
</template>