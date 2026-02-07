<script setup lang='ts'>
const props = defineProps<{
  mode: ModeEnum
}>()

const { t } = useI18n()

const {
  printOrder,
  sendOrderToCreate,
  sendOrderToEdit,
} = useOrders()

const orderStore = useOrdersStore()

const { fillSelects } = orderStore

const {
  isConfirmButtonDisabled,
  isDuplicationWanted,
  isOrderSaving,
  originalOrder,
  order,
  selectedCustomerId,
  selectedProducts, 
} = storeToRefs(orderStore)

const handleCancelClick = () => {
  navigateTo(ORDERS_URL)
}

const handlePrintClick = () => {
  if (!order.value.id) return
  printOrder(order.value.id)
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

const handleSaveClick = () => saveOrder()
const handleSaveDuplicateClick = () => saveOrder(true)

const saveByMode = async () => {
  if (props.mode === ModeEnum.CREATION) {
    return sendOrderToCreate(order.value)
  }

  if (props.mode === ModeEnum.EDITION) {
    return sendOrderToEdit(order.value)
  }
}

const saveOrder = async (duplication = false) => {
  if (!order.value) return

  isOrderSaving.value = true

  try {
    if (!isConfirmButtonDisabled.value) {
      await saveByMode()
    }

    if (duplication) isDuplicationWanted.value = true

    navigateTo(duplication ? ORDERS_CREATE_URL : ORDERS_URL)
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
      @click="handleSaveDuplicateClick"
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
