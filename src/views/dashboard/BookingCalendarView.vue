<template>
  <main class="min-h-screen bg-gray-100 overflow-x-auto px-4 py-6">
    <header class="my-7">
      <h1 class="text-4xl font-[700] uppercase">booking calendar</h1>
    </header>
    <div class="min-h-[400px] flex items-center justify-center">
      <span v-if="is_loading" class="block w-10 h-10 mx-auto rounded-full animate-spin border-x-2 border-gray-800"></span>
      <VCalendar v-else @dayclick="handleGetDayBookingRequests" :attributes="attributes" :rows="2"
        class="gap-6 booking_calendar" expanded />
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
console.log("Main dashboard")

const bookingStore = useBookingStore();
const { fetchBookings } = bookingStore;
const { bookedDates, bookings } = storeToRefs(bookingStore);
const bookedDatesArray: Ref<any[]> = ref([]);

const is_loading: Ref<boolean> = ref(false);

const router = useRouter();

const handleGetDayBookingRequests = async (e: any) => {
  const month = e.month.toString().padStart(2, '0');
  const day = e.day.toString().padStart(2, '0');
  const year = e.year;

  const date = `${year}-${month}-${day}`;
  router.push({ name: 'requests', params: { id: date } });
}

const attributes = ref([
  {
    highlight: true,
    dates: [
      ...bookedDatesArray.value,
    ],
  },
]);

watch(bookedDates, (newVal, oldVal) => {
  console.log('bookedDates changed');
  bookedDatesArray.value = newVal;
  const y = bookedDatesArray.value[0];
  console.log(y)
  attributes.value[0].dates = [
    ...bookedDatesArray.value,
  ];
})

onBeforeMount(async () => {
  is_loading.value = true;
  await fetchBookings()
  is_loading.value = false;
  console.log("Booking...")
  console.log(bookings.value)
})
</script>

<style scoped>
/* Track */
.table_container::-webkit-scrollbar {
  height: 5px;
  background-color: #f5f5f5;
  border-radius: 15px;
}

/* Handle */
.table_container::-webkit-scrollbar-thumb {
  background: #888;
  border-radius: 15px;
}

/* Handle on hover */
.table_container::-webkit-scrollbar-thumb:hover {
  background: #666;
}

/* Track on hover */
.table_container::-webkit-scrollbar-track:hover {
  background: #ddd;
}

.vc-container * {
  color: #6366f1;
  border: thin solid red !important;
}

.vc-week,
.weekdays {
  border: thin solid green !important;
}
</style>
