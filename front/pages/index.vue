<script setup lang='ts'>
const { t } = useI18n()

const synthesisSearchDates = ref()

const handleSearchClick = () => {
  console.log('search')
  // loadOrders(ordersSearchDates.value)
}
</script>

<template>
  <div class="w-full max-h-full flex flex-col gap-6">
    <Header />

    <div class="flex gap-4 items-end">
      <DatePicker
        v-model="synthesisSearchDates"
        :label="t('common.dates', 2)"
        range
        theme="light"
      />
      <Button 
        icon="magnifying-glass"
        @click="handleSearchClick"
      />
    </div>

    <SynthesisCards /> 

    <SynthesisProductsTable />

  </div>
</template>
