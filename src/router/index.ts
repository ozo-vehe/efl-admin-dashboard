import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '@/views/DashboardView.vue'
import LoginView from '@/views/LoginView.vue'
import BookingCalendarView from '@/views/dashboard/BookingCalendarView.vue'
import BookingsView from '@/views/dashboard/BookingsView.vue'
import DownloadsView from '@/views/dashboard/DownloadsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/booking_calendar',
      name: 'booking_calendar',
      component: BookingCalendarView,
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      children: [
        {
          path: '/dashboard',
          name: 'booking_calendar',
          component: BookingCalendarView
        },
        {
          path: '/dashboard/requests/:id',
          name: 'requests',
          component: BookingsView
        },
        {
          path: '/dashboard/downloads',
          name: 'downloads',
          component: DownloadsView
        }
      ]
    }
  ],
})

export default router
