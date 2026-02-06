<template>
  <main class="p-10">
    <slot />
  </main>
</template>

<style scoped>
@media print {
  @page {
    size: portrait;
    margin: 10mm;
  }

  body {
    -webkit-print-color-adjust: exact;
    color-adjust: exact;
  }
}
</style>