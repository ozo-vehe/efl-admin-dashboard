<template>
  <main class="min-h-screen bg-gray-100 overflow-x-auto px-4 py-6">
    <header class="my-7">
      <h1 class="text-4xl font-[700] uppercase">booking calendar</h1>
    </header>
    <div class="h-[500px] max-w-[700px] mx-auto">
      <span v-if="is_loading"
        class="block w-10 h-10 mx-auto rounded-full animate-spin border-x-2 border-gray-800"></span>
      <vue-cal v-else hide-view-selector xsmall :disable-views="['week']" events-count-on-year-view active-view="month" class="vuecal--green-theme"
        :events="events" @cell-click="handleGetDayBookingRequests">
      </vue-cal>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'

console.log("Main dashboard")

const bookingStore = useBookingStore();
const { fetchBookings } = bookingStore;
const { bookedDates, bookings } = storeToRefs(bookingStore);
const booked_dates_array: Ref<any[]> = ref([]);

const is_loading: Ref<boolean> = ref(false);
const events: Ref<any[]> = ref([]);

const router = useRouter();

const handleGetDayBookingRequests = async (e: any) => {
  const date = e.toISOString().split('T')[0];
  if(booked_dates_array.value.includes(date)) {
    console.log('date is booked');
    router.push({ name: 'requests', params: { id: date } });
  }
}

onBeforeMount(async () => {
  is_loading.value = true;
  await fetchBookings()
  is_loading.value = false;;
  bookings.value.forEach((booking: any) => {
    booked_dates_array.value.push(booking.day);
    console.log(booked_dates_array.value)
    events.value.push({
      start: `${booking.day} 12:00`,
      end: `${booking.day} 12:00`
    });

  });
})
</script>

<style scoped>
.vuecal__cell-events-count {
  width: 18px;
  height: 2px;
  color: transparent;
}

/* Dot indicator */
.vuecal__cell-events-count {
  width: 4px;
  min-width: 0;
  height: 4px;
  padding: 0;
  color: transparent;
}

/* Cell background indicator */
.vuecal__cell--has-events {background-color: #fffacd;}
.vuecal__cell-events-count {display: none;}
</style>
