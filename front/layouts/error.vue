<template>
  <div class="h-screen bg-gray-800 text-gray-100 flex">
    <NavBar />
    <div class="p-10 w-full h-full flex flex-col min-h-0">
      <slot />
    </div>
  </div>
</template>
