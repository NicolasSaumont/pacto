<script setup lang="ts"></script>

<template>
  <div class="flex bg-gray-900 p-6 rounded-2xl border border-gray-600">
    <!-- COLONNE GAUCHE -->
    <div class="flex-1 text-center border-r border-gray-600">
      <!-- Titre -->
      <div class="h-5 w-1/2 mx-auto mb-4 rounded bg-gray-700 animate-pulse" />

      <!-- Lignes -->
      <div
        v-for="row in SKELETON_ROWS"
        :key="'left-' + row"
        class="bg-gray-800 m-4 ml-0 py-2 px-3 rounded-lg border border-gray-600"
      >
        <div
          class="h-4 rounded bg-gray-700 animate-pulse"
          :class="row % 2 === 0 ? 'w-3/4 mx-auto' : 'w-2/3 mx-auto'"
        />
      </div>
    </div>

    <!-- COLONNE DROITE -->
    <div class="flex-1 text-center">
      <!-- Titre -->
      <div class="h-5 w-1/2 mx-auto mb-4 rounded bg-gray-700 animate-pulse" />

      <!-- Lignes -->
      <div
        v-for="row in SKELETON_ROWS"
        :key="'right-' + row"
        class="bg-gray-800 m-4 mr-0 py-2 px-3 rounded-lg border border-gray-600"
      >
        <div
          class="h-4 rounded bg-gray-700 animate-pulse"
          :class="row % 2 === 0 ? 'w-2/3 mx-auto' : 'w-3/4 mx-auto'"
        />
      </div>
    </div>
  </div>
</template>
