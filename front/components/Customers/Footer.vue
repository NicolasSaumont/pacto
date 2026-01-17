<script setup lang='ts'>
const { t } = useI18n()

const customersStore = useCustomersStore()

const { 
  isConfirmButtonDisabled,
  isCustomerSaving,
} = storeToRefs(customersStore)
</script>

<template>
  <div class="flex gap-2 mt-6">
    <Button 
      type="reset"
      :label="t('common.cancel')" 
      outline 
    />
    <Button 
      type="submit"
      :disabled="isConfirmButtonDisabled"
      :label="t('common.save')" 
      :loading="isCustomerSaving"
    />
  </div>
</template>
