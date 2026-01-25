<script setup lang='ts'>
const { t } = useI18n()
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-12">
    <Header>
      <template #title>
        <span>{{ t('product.add') }}</span>
      </template>
    </Header>

    <ProductsForm :mode="ModeEnum.CREATION" />
  </div>
</template>
