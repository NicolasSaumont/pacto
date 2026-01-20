<script setup lang='ts'>
const { t } = useI18n()

const { loadCustomer } = useCustomers()
const { loadProducts } = useProducts()

onMounted( () => {
  loadCustomer()
  loadProducts()
})
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-12">
    <Header>
      <template #title>
        {{ t('customer.edit') }}
      </template>
    </Header>

    <CustomersForm :mode="ModeEnum.EDITION" />
  </div>
</template>
