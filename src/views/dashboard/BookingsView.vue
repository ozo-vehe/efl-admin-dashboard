<template>
  <main class="min-h-screen bg-gray-100 border overflow-x-auto px-4 py-6">
    <header class="my-7">
      <h1 class="text-4xl font-[700] uppercase">bookings</h1>
      <div class="mt-8 flex flex-wrap gap-4 items-center">
        <div class="booking_filter border border-gray-400 outline-none w-fit pr-3 h-[40px] rounded-[8px]">
          <select name="filter" id="filter" class="w-[150px] h-full pl-2 bg-gray-100 rounded-[8px] outline-none"
            v-model="filter_value" @change="handleFilter">
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <button aria-label="download button" type="button"
          class="border bg-gray-700 text-gray-50 px-3 h-[40px] rounded-[8px] capitalize hover:bg-gray-800 transition-all duration-300 font-bold flex items-center justify-center gap-2 min-w-[130px]"
          @click="handleBookingDownload()">
          <span v-if="is_download_loading"
            class="block w-4 h-4 border-x border-gray-50 animate-spin rounded-full"></span>
          <span v-else class="flex items-center gap-2">
            download
            <img class="w-5" src="https://img.icons8.com/forma-bold/f9fafb/24/download.png" alt="download" />
          </span>
        </button>
      </div>
    </header>
    <div class="table_container overflow-x-auto">
      <span v-if="is_table_loading"
        class="block animate-spin w-8 h-8 mx-auto border-x border-gray-700 rounded-full"></span>
      <table v-else class="min-w-full divide-y divide-gray-200 rounded-[12px] bg-gray-50">
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
                <span class="block mb-1" v-for="(container, index) in request.containers" :key="index">{{ container.containerNumber }}</span>
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
import { onBeforeMount, ref, type Ref, watch } from 'vue'
import { useBookingStore } from '@/stores/booking'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'

const bookingStore = useBookingStore();
const { bookings } = storeToRefs(bookingStore);
const { assignBookingStatus, fetchBookings, downloadBooking } = bookingStore;
const route = useRoute();

const filter_value: Ref<string> = ref("all");
const is_loading = ref(false);
const is_table_loading = ref(true);
const is_download_loading = ref(false)
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

const handleBookingDownload = async () => {
  const date = route.params.id;
  if (!date) return;
  if (date == "all") return;
  is_download_loading.value = true;
  await downloadBooking();
  is_download_loading.value = false;
}

const handleBookingRequest = async (id: string, status: string) => {
  if (!status) return;

  approving_id.value = id;
  is_loading.value = true;

  try {
    const res = await assignBookingStatus(id, status)
    if (res.statusCode >= 200 && res.statusCode < 300) {
      alert(`Successfully assigned status: ${status}`);
      await fetchBookings();
      await handleFilter();
      is_loading.value = false;
    }
  } catch (error) {
    console.log(error);
    is_loading.value = false;
  }
}

const handleFilter = () => {
  const bookings_copy = [...allFilteredBookings.value];

  if (filter_value.value === "all") {
    filteredBookings.value = bookings_copy;
  } else if (["pending", "approved", "rejected"].includes(filter_value.value)) {
    filteredBookings.value = bookings_copy.filter((booking: any) => booking.status === filter_value.value);
  } else {
    filteredBookings.value = [];
  }
}

const filterBookingsByDay = () => {
  is_table_loading.value = true;
  if (route.params.id === "all") {
    filteredBookings.value = [...bookings.value];
    allFilteredBookings.value = [...bookings.value];
    is_table_loading.value = false;
    return;
  }

  filteredBookings.value = bookings.value.filter((booking: any) => booking.day === route.params.id);
  allFilteredBookings.value = [...filteredBookings.value];
  is_table_loading.value = false;
}

watch(() => route.params.id, filterBookingsByDay);

onBeforeMount(async () => {
  await fetchBookings();
  filterBookingsByDay();
});
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
