<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()
const { notify } = useNotify()

const {
  sendOrderToCreate,
  sendOrderToEdit,
} = useOrders()

const orderStore = useOrdersStore()

const { fillSelects } = orderStore

const {
  isConfirmButtonDisabled,
  isOrderSaving,
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

const handleSaveClick = async () => {
  if (!order.value) return

  isOrderSaving.value = true

  try {
    if (props.mode === ModeEnum.CREATION) await sendOrderToCreate(order.value)
    else if (props.mode === ModeEnum.EDITION) await sendOrderToEdit(order.value)

    await navigateTo(ORDERS_URL)
  } catch {
    // IMPORTANT: on consomme l'erreur pour éviter le warning Vue
    // la notif est déjà affichée dans withNotify
    return
  } finally {
    isOrderSaving.value = false
  }
}
</script>

<template>
  <div class="flex gap-4 justify-end">
    <Button
      :color="ButtonColorEnum.SECONDARY"
      icon="copy"
      :label="t('common.save-duplicate')"
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
      :disabled="isConfirmButtonDisabled"
      icon="floppy-disk"
      :label="t('common.save')"
      @click="handleSaveClick"
    />
  </div>
</template>
