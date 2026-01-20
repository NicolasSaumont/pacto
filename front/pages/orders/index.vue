<script setup lang='ts'></script>

<template>
  <div class="w-full h-full flex flex-col gap-12">
    <Header />
    <div class="flex flex-1 gap-4 min-h-0">
      <OrdersForm />
      <OrdersPreview />
    </div>
    <OrdersFooter />
  </div>
</template>