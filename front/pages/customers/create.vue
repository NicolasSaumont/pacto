<script setup lang='ts'>
const { t } = useI18n()

const { loadProducts } = useProducts()

onMounted( () => {
  loadProducts()
})
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-12">
    <Header>
      <template #title>
        <span>{{ t('customer.add') }}</span>
      </template>
    </Header>

    <CustomersForm :mode="ModeEnum.CREATION" />
  </div>
</template>
