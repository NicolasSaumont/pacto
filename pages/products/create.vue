<script setup lang='ts'>
const { t } = useI18n()

const productLabel = ref<string>()

const handleResetClick = () => {
  navigateTo(PRODUCTS)
}
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #title>
        {{ t('product.add-product') }}
      </template>
    </Header>

    <Input
      v-model="productLabel"
      :label="t('product.name')"
      theme="light"
    />

    <div class="flex gap-2 mt-6">
      <Button :label="t('common.cancel')" outline @click="handleResetClick"/>
      <Button :label="t('common.save')" />
    </div>
  </div>
</template>
