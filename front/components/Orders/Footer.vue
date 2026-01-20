<script setup lang='ts'>
const { t } = useI18n()

const { notify } = useNotify()

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
  notify({
    state: 'info',
    title: t('common.reset'),
    content: t('common.unavailable-feature'),
  })
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
