<script setup lang="ts">
import SidebarComponent from '@/components/SidebarComponent.vue';
import MainDashboardComponent from '@/components/MainDashboardComponent.vue';
</script>

<template>
  <main class="flex min-h-screen w-full">
    <SidebarComponent />
    <MainDashboardComponent class="flex-1" />
  </main>
</template>
