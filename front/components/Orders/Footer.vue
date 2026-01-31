<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()
const { notify } = useNotify()

const orderStore = useOrdersStore()

const { fillSelects } = orderStore

const {
  originalOrder,
  order,
  selectedCustomerId,
  selectedProducts, 
} = storeToRefs(orderStore)

const handleCancelClick = () => {
  navigateTo(ORDERS_URL)
}

const handleDuplicateClick = () => {
  notify({
    state: 'info',
    title: t('common.duplicate'),
    content: t('common.unavailable-feature'),
  })
}

const handlePrintClick = () => {
  notify({
    state: 'info',
    title: t('common.print'),
    content: t('common.unavailable-feature'),
  })
}

const handleResetClick = () => {
  if (props.mode === ModeEnum.EDITION) {
    order.value = structuredClone(toRaw(originalOrder.value))
    fillSelects()
  }
  else {
    order.value = structuredClone(DEFAULT_ORDER)
    selectedCustomerId.value = null
    selectedProducts.value = []
  }
}

const handleSaveClick = () => {
  notify({
    state: 'info',
    title: t('common.save'),
    content: t('common.unavailable-feature'),
  })
}
</script>

<template>
  <div class="flex gap-4 justify-end">
    <Button
      :color="ButtonColorEnum.SECONDARY"
      icon="copy"
      :label="t('common.duplicate')"
      @click="handleDuplicateClick"
    />
    <Button
      :color="ButtonColorEnum.SECONDARY"
      icon="print"
      :label="t('common.print')"
      @click="handlePrintClick"
    />
    <Button
      :color="ButtonColorEnum.SECONDARY"
      icon="arrow-rotate-left"
      :label="t('common.reset')"
      @click="handleResetClick"
    />
    <Button 
      :label="t('common.cancel')" 
      outline 
      @click="handleCancelClick"
    />
    <Button
      icon="floppy-disk"
      :label="t('common.save')"
      @click="handleSaveClick"
    />
  </div>
</template>
