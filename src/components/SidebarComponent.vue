<template>
  <div class="min-h-screen flex flex-col bg-gray-800 text-gray-50 transition-all duration-300 w-64 lg:relative md:relative absolute" :class="{ 'lg:w-0 md:w-0 w-0': isSidebarCollapsed }">
    <div class="fixed flex flex-col top-0 left-0 w-64 bg-gray-800 h-full border-r transition-all duration-300" :class="{ 'lg:w-0 md:w-0 w-0': isSidebarCollapsed }">
      <div class="flex items-center justify-center h-14 border-b border-gray-500 relative">
        <h1 class="text-[18px] font-bold uppercase">EFL Admin</h1>

        <button class="sidebar_arrow absolute border bg-white rounded-[8px] w-[35px] h-[35px] p-2 -right-4 shadow-md top-0 bottom-0 my-auto cursor-pointer transition-all duration-300" @click="toggleSidebar" :class="{ '-right-8': isSidebarCollapsed }">
          <img v-if="isSidebarCollapsed" width="50" height="50" src="https://img.icons8.com/fluency-systems-regular/50/long-arrow-right.png" alt="long-arrow-left"/>
          <img v-else width="50" height="50" src="https://img.icons8.com/fluency-systems-regular/50/long-arrow-left.png" alt="long-arrow-left"/>
        </button>
      </div>
      <div class="overflow-y-auto overflow-x-hidden flex-grow">
        <ul class="flex flex-col gap-2 py-4">
          <li class="flex items-center justify-center" v-for="(link, index) in sidebarLinks" :key="index">
            <button @click="handleFilter(link.id)" :aria-label="`${link.name} button`" :class="{'bg-gray-500': active_link == link.id}" class="relative flex flex-row items-center min-w-40 h-11 focus:outline-none hover:bg-gray-500 text-gray-50 font-[500] uppercase transition-all duration-300 rounded-md px-2">
              <span class="text-sm tracking-wide truncate">{{ link.name }}</span>
            </button>
          </li>
        </ul>

        <button @click="handleLogout" aria-label="Log out button" class="relative flex flex-row items-center min-w-40 h-11 focus:outline-none hover:bg-gray-500 text-gray-50 font-[500] uppercase transition-all duration-300 rounded-md px-2 text-center mx-auto text-sm">Log out</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import {type Ref, ref} from 'vue';
import { useBookingStore } from '@/stores/booking';

// STORES DECLARATIONS
const bookingStore = useBookingStore();
const { filterBookings, userLogout } = bookingStore;

// INTERFACES DECLARATIONS
interface SidebarLink {
  id: string,
  name: string;
  icon: string;
}

const active_link: Ref<string> = ref('all');

const sidebarLinks: Ref<SidebarLink[]> = ref([
  { id: "all", name: 'All requests', icon: 'home' },
  { id: "pending", name: 'Pending requests', icon: 'inbox' },
  { id: "approved", name: 'Approved requests', icon: 'user' },
]);

// VARIABLES DECLARATIONS
const isSidebarCollapsed: Ref<boolean> = ref(false);

// FUNCTIONS DECLARATIONS
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value;
};

const handleFilter = (id: string) => {
  active_link.value = id;
  filterBookings(id);
};

const handleLogout = async() => {
  await userLogout();
  console.log('Logout clicked');
};

</script>
