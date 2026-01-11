<script setup lang='ts'>
const { t } = useI18n()
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #title>
        {{ t('product.add') }}
      </template>
    </Header>

    <ProductsForm />

    <ProductsFooter :mode="ModeEnum.CREATION"/>
  </div>
</template>
