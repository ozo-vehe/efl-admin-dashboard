<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useBookingStore } from './stores/booking';

const bookingStore = useBookingStore();
const { fetchBookings } = bookingStore;

onMounted(async () => {
  console.log('App mounted');
  await fetchBookings();
})
</script>

<template>
  <RouterView />
</template>

<style scoped>
</style>
