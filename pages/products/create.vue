<script setup lang='ts'>
const { t } = useI18n()

const productLabel = ref<string>()
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
      theme="light"
      :label="t('product.name')"
    />
  </div>
</template>
