<script setup lang='ts'>
const { t } = useI18n()

const { loadProduct } = useProducts()

onMounted(loadProduct)
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-12">
    <Header>
      <template #title>
        {{ t('product.edit') }}
      </template>
    </Header>

    <ProductsForm :mode="ModeEnum.EDITION" />
  </div>
</template>
