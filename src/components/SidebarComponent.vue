<template>
  <div class="min-h-screen w-64 bg-gray-800 text-gray-50 transition-all duration-300 lg:relative md:relative absolute"
    :class="{ 'lg:w-0 md:w-0 w-0': isSidebarCollapsed }">
    <div class="fixed flex flex-col top-0 left-0 w-64 bg-gray-800 h-full border-r transition-all duration-300"
      :class="{ 'lg:w-0 md:w-0 w-0': isSidebarCollapsed }">
      <div class="flex items-center justify-center h-14 border-b border-gray-500 relative">
        <h1 class="text-[18px] font-bold uppercase">EFL Admin</h1>

        <button
          class="sidebar_arrow absolute border bg-white rounded-[8px] w-[35px] h-[35px] p-2 -right-4 shadow-md top-0 bottom-0 my-auto cursor-pointer transition-all duration-300"
          @click="toggleSidebar" :class="{ '-right-8': isSidebarCollapsed }">
          <img v-if="isSidebarCollapsed" width="50" height="50"
            src="https://img.icons8.com/fluency-systems-regular/50/long-arrow-right.png" alt="long-arrow-left" />
          <img v-else width="50" height="50" src="https://img.icons8.com/fluency-systems-regular/50/long-arrow-left.png"
            alt="long-arrow-left" />
        </button>
      </div>
      <div class="overflow-y-auto overflow-x-hidden flex-grow">
        <ul class="flex flex-col gap-2 py-4">
          <li class="flex items-center px-5" v-for="(link, index) in sidebarLinks" :key="index">
            <RouterLink :to="link.path" exactActiveClass="bg-gray-500" @click="handleFilter(link.id)" :aria-label="`${link.name} button`"
              class="relative flex items-center min-w-40 h-11 focus:outline-none hover:bg-gray-500 text-gray-50 font-[500] uppercase transition-all duration-300 rounded-md px-2">
              <img class="w-6 mr-2" :src="link.icon" :alt="link.name">
              <span class="text-sm tracking-wide truncate">{{ link.name }}</span>
            </RouterLink>
          </li>
        </ul>

        <div @click="handleLogout" aria-label="Log out button"
          class="relative flex items-center min-w-40 h-11 font-[500] uppercase transition-all duration-300 rounded-md px-5 text-center text-sm w-full">
          <button class="relative flex items-center min-w-40 h-11 focus:outline-none hover:bg-gray-500 text-gray-50 font-[500] uppercase transition-all duration-300 rounded-md px-2 text-center text-sm">
            <img class="w-6 mr-2" src="https://img.icons8.com/forma-bold/f7f7f7/24/exit.png" alt="logout" />
            <span>Log out</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type Ref, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { useBookingStore } from '@/stores/booking';

// STORES DECLARATIONS
const bookingStore = useBookingStore();
const { filterBookings, userLogout } = bookingStore;

// INTERFACES DECLARATIONS
interface SidebarLink {
  id: string,
  name: string;
  icon: string;
  path: string;
}

const active_link: Ref<string> = ref('calendar');

const sidebarLinks: Ref<SidebarLink[]> = ref([
  { id: "calendar", name: 'booking calendar', icon: 'https://img.icons8.com/ios-filled/f7f7f7/50/calendar--v1.png', path: '/dashboard' },
  { id: "requests", name: 'Requests', icon: 'https://img.icons8.com/material-rounded/f7f7f7/24/event-accepted.png', path: '/dashboard/requests/all' },
  { id: "downloads", name: 'Downloads', icon: 'https://img.icons8.com/material-rounded/f7f7f7/24/downloads.png', path: '/dashboard/downloads' },
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

const handleLogout = async () => {
  await userLogout();
  window.location.reload();
  console.log('Logout clicked');
};

</script>
