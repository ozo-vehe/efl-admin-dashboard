<template>
  <main class="min-h-screen bg-gray-100 border overflow-x-auto px-4 py-6">
    <header class="my-8">
      <h1 class="text-3xl font-[500] capitalize">booking request list</h1>
    </header>
    <div class="">
      <VCalendar @dayclick="handleGetDayBookingRequests" :attributes="attributes" :rows="2" class="gap-6 booking_calendar" expanded />
    </div>
    <!-- <div class="table_container overflow-x-auto">
      <table class="min-w-full divide-y divide-gray-200 rounded-[12px] bg-gray-50">
        <thead class="border">
          <tr class="h-16 bg-gray-200 rounded-[12px]">
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              S/No.
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Fullname
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Phone No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Command
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              BL No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Container No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Invoice No
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Date
            </th>
            <th scope="col" class="px-6 py-3 text-left text-[14px] font-[600] text-gray-700">
              Status
            </th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody v-if="filteredBookings" class="divide-y divide-gray-200 bg-gray-50 border">
          <tr v-for="(request, index) in filteredBookings" :key="request.id" class="hover:bg-gray-100">
            <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
              {{ index + 1 }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
              {{ request.agencyName }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
              {{ request.phone }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px] text-gray-900">
              {{ request.command }}
            </td>
            <td class="whitespace-nowrap truncate px-6 py-4 text-[14px] text-gray-900">
              {{ request.blNumber }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px]">
              {{ request.containerNumber }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px]">
              {{ request.invoiceNumber }}
            </td>
            <td class="whitespace-nowrap px-6 py-4 text-[14px]">
              {{ formatDateTime(request.day) }}
            </td>
            <td class="whitespace-nowrap px-6 py-4">
              <span
                :class="[request.status === 'pending' ? 'bg-yellow-100 text-yellow-900' : 'bg-green-100 text-green-900', 'px-2 py-1 rounded-full capitalize text-xs']">
                {{ request.status }}
              </span>
            </td>
            <td v-if="request.status === 'pending'" class="whitespace-nowrap px-6 py-4 flex items-center justify-center gap-4">
              <span v-if="is_loading && request.id === approving_id" class="block w-4 h-4 border-x border-blue-900 rounded-full animate-spin"></span>
              <button v-if="!is_loading" @click="handleBookingRequest(request.id, 'approved')"
                class='bg-blue-100 text-blue-900 px-2 py-1 rounded-full capitalize text-xs'>
                approve
              </button>
              <button v-if="!is_loading" @click="handleBookingRequest(request.id, 'rejected')"
                class='bg-red-100 text-red-900 px-2 py-1 rounded-full capitalize text-xs'>
                reject
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div> -->
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, watch, type Ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
console.log("Main dashboard")

const bookingStore = useBookingStore();
const { filteredBookings, bookedDates, bookings } = storeToRefs(bookingStore);
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

const formatDateTime = (isoString: string | Date) => {
  const date = new Date(isoString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const handleBookingRequest = async (id: string, status: string) => {
  if (status === '') {
    return;
  }
  approving_id.value = id;
  is_loading.value = true;
  console.log('rejectBookingRequest', id)
  try {
    const res = await assignBookingStatus(id, status)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      alert('Successfully assigned status' + status);
      console.log(res);
      is_loading.value = false;
    }
  } catch (error) {
    console.log(error);
    is_loading.value = false;
  }
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
