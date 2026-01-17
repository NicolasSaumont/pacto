<script setup lang='ts'>
const { t } = useI18n()

const { loadCustomers } = useCustomers()

onMounted(loadCustomers)
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header>
      <template #title>
        {{ t('customer.edit') }}
      </template>
    </Header>

    <CustomersForm :mode="ModeEnum.EDITION" />
  </div>
</template>
