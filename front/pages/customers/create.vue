<script setup lang='ts'>
const { t } = useI18n()

const { loadProducts } = useProducts()

onMounted( () => {
  loadProducts()
})
</script>

<template>
  <div class="w-full flex-1 min-h-0 flex flex-col gap-6">
    <Header>
      <template #title>
        {{ t('customer.add') }}
      </template>
    </Header>

    <CustomersForm :mode="ModeEnum.CREATION" />
  </div>
</template>
