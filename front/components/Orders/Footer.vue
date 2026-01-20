<script setup lang='ts'>
const { t } = useI18n()

const handleDuplicateClick = () => {
  console.log('Duplicate')
}

const handlePrintClick = () => {
  console.log('Print')
}

const handleResetClick = () => {
  console.log('Reset')
}

const handleSaveClick = () => {
  console.log('Save')
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
      icon="arrow-rotate-left"
      :label="t('common.reset')"
      outline
      @click="handleResetClick"
    />
    <Button
      icon="floppy-disk"
      :label="t('common.save')"
      @click="handleSaveClick"
    />
  </div>
</template>
