<template>
  <main class="min-h-screen bg-gray-100 border overflow-x-auto px-4 py-6">
    <header class="my-7">
      <h1 class="text-4xl font-[700] uppercase">booking calendar</h1>
      <div class="booking_filter border border-gray-400 outline-none w-fit pr-3 h-[40px] rounded-[8px] mt-8">
        <select name="filter" id="filter" class="w-[150px] h-full pl-2 bg-gray-100 rounded-[8px] outline-none"
          v-model="filter_value" @change="handleFilter">
          <option value="all">All</option>
          <option value="approved">Approved</option>
          <option value="pending">Pending</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </header>
    <div class="table_container overflow-x-auto">
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
              <span :class="[
                request.status === 'pending' ? 'bg-yellow-100 text-yellow-900' :
                  request.status === 'approved' ? 'bg-green-100 text-green-900' :
                    'bg-red-100 text-red-900',
                'px-2 py-1 rounded-full capitalize text-xs'
              ]">
                {{ request.status }}
              </span>
            </td>
            <td v-if="request.status === 'pending'"
              class="whitespace-nowrap px-6 py-4 flex items-center justify-center gap-4">
              <span v-if="is_loading && request.id === approving_id"
                class="block w-4 h-4 border-x border-blue-900 rounded-full animate-spin"></span>
              <button v-if="!is_loading" @click="handleBookingRequest(request.id, 'approved')"
                class='bg-blue-100 rounded-full capitalize w-[30px] h-[30px] p-2'>
                <img class="w-full h-full object-contain"
                  src="https://img.icons8.com/ios-filled/1e3a8a/50/checkmark--v1.png" alt="checkmark--v1" />
              </button>
              <button v-if="!is_loading" @click="handleBookingRequest(request.id, 'rejected')"
                class='bg-red-100 p-2 w-[30px] h-[30px] rounded-full capitalize'>
                <img class="w-full h-full object-contain"
                  src="https://img.icons8.com/material-rounded/7f1d1d/24/delete-sign.png" alt="delete-sign" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onBeforeMount, ref, type Ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
console.log("Main dashboard")

const bookingStore = useBookingStore();
const { bookings } = storeToRefs(bookingStore);
const { assignBookingStatus } = bookingStore;

const route = useRoute();

console.log(route.params.id)

const filter_value: Ref<string> = ref("all");
const is_loading = ref(false);
const approving_id = ref('');
const allFilteredBookings: Ref<any[]> = ref([]);
const filteredBookings: Ref<any[]> = ref([]);

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

const handleFilter = () => {
  console.log("Filter changing");
  console.log(filter_value.value)
  const bookings_copy = [...allFilteredBookings.value]
  console.log(bookings_copy);

  if (filter_value.value === "all") filteredBookings.value = [...bookings_copy];
  else if (filter_value.value === "pending") {
    filteredBookings.value = bookings_copy.filter((booking: any) => booking.status === filter_value.value);
  } else if (filter_value.value === "approved") {
    filteredBookings.value = bookings_copy.filter((booking: any) => booking.status === filter_value.value);
    console.log(filteredBookings.value)
  } else {
    filteredBookings.value = []
    return;
  }

}

onBeforeMount(() => {
  console.log("On before mount")
  if (route.params.id === "all") {
    filteredBookings.value = [...bookings.value];
    allFilteredBookings.value = [...bookings.value];
    return;
  }

  filteredBookings.value = bookings.value.filter((booking: any) => {
    return booking.day === route.params.id
  });
  allFilteredBookings.value = [...filteredBookings.value];
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
</style>
