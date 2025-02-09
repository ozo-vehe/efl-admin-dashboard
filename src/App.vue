<script setup lang="ts">
import { RouterView } from 'vue-router';
import { onMounted } from 'vue';
import { useBookingStore } from './stores/booking';

const bookingStore = useBookingStore();
const { fetchBookings } = bookingStore;

onMounted(async () => {
  console.log('App mounted');
  await fetchBookings();
  // const req = await fetch("http://booking-prototype.efl.africa/api/auth/admin/register", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     "Accept": "application/json",
  //   },
  //   body: JSON.stringify({
  //     email: "admin@efl.africa",
  //     password: "Admin@efl2025",
  //     name: "admin",
  //     phone: "08123456789",
  //   })
  // })
  // console.log(req);
  // const res = await req.json();
  // console.log(res);
})
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
