<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue';
import { RouterView } from 'vue-router';
</script>

<template>
  <main class="flex min-h-screen w-full">
    <SidebarComponent />
    <RouterView class="flex-1" />
  </main>
</template>
