<template>
  <main class="min-h-screen bg-gray-100 border overflow-x-auto px-4 py-6">
    <header class="my-8">
      <h1 class="text-3xl font-[500] capitalize">booking request list</h1>
    </header>
    <div class="">
      <VCalendar @dayclick="handleGetDayBookingRequests" :attributes="attributes" :rows="2" class="gap-6 booking_calendar" expanded />
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, watch, type Ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
console.log("Main dashboard")

const bookingStore = useBookingStore();
const { bookedDates, bookings } = storeToRefs(bookingStore);
const { assignBookingStatus } = bookingStore;

const is_loading = ref(false);
const approving_id = ref('');
const bookedDatesArray: Ref<any[]> = ref([]);

const handleGetDayBookingRequests = async (e: any) => {
  const month = e.month.toString().padStart(2, '0');
  const day = e.day.toString().padStart(2, '0');
  const year = e.year;

  const date = `${year}-${month}-${day}`;
  console.log('handleGetDayRequests', date);
  const x = bookings.value.filter((booking: any) => booking.day === date);

  console.log(x);
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
  // console.log(bookedDatesArray.value);
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
.vc-week, .weekdays {
  border: thin solid green !important;
}
</style>
