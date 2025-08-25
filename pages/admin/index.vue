<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h1 class="text-lg font-medium leading-6 text-gray-900">Admin Dashboard</h1>
    </div>
    
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Dashboard Cards -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-indigo-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Total Rooms</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ rooms.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/rooms" class="font-medium text-indigo-600 hover:text-indigo-500">
              View all<span class="sr-only"> rooms</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-green-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Active Bookings</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ activeBookings.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/calendar" class="font-medium text-indigo-600 hover:text-indigo-500">
              View calendar<span class="sr-only"> bookings</span>
            </NuxtLink>
          </div>
        </div>
      </div>
      
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center">
            <div class="flex-shrink-0 bg-yellow-500 rounded-md p-3">
              <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div class="ml-5 w-0 flex-1">
              <dl>
                <dt class="text-sm font-medium text-gray-500 truncate">Upcoming Check-ins</dt>
                <dd>
                  <div class="text-lg font-medium text-gray-900">{{ upcomingCheckIns.length }}</div>
                </dd>
              </dl>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-4 sm:px-6">
          <div class="text-sm">
            <NuxtLink to="/admin/bookings" class="font-medium text-indigo-600 hover:text-indigo-500">
              View all<span class="sr-only"> check-ins</span>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Dashboard Calendar -->
    <div class="mt-8">
      <DashboardCalendar />
    </div>
    
    <!-- Recent Bookings -->
    <div class="mt-8">
      <h2 class="text-lg leading-6 font-medium text-gray-900">Recent Bookings</h2>
      <div class="mt-2 bg-white shadow overflow-hidden sm:rounded-md">
        <ul v-if="bookings.length > 0" class="divide-y divide-gray-200">
          <li v-for="booking in recentBookings" :key="booking.id">
            <div class="px-4 py-4 sm:px-6">
              <div class="flex items-center justify-between">
                <div class="text-sm font-medium text-indigo-600 truncate">
                  {{ booking.guestName }}
                </div>
                <div class="ml-2 flex-shrink-0 flex">
                  <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="bookingStatusClass(booking.status)">
                    {{ booking.status }}
                  </p>
                </div>
              </div>
              <div class="mt-2 sm:flex sm:justify-between">
                <div class="sm:flex">
                  <p class="flex items-center text-sm text-gray-500">
                    <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                    </svg>
                    {{ getRoomName(booking.roomId) }}
                  </p>
                </div>
                <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                  </svg>
                  <p>
                    {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                  </p>
                </div>
              </div>
            </div>
          </li>
        </ul>
        <div v-else class="px-4 py-5 sm:p-6 text-center text-gray-500">
          No bookings found.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import DashboardCalendar from '~/components/admin/dashboard/DashboardCalendar.vue'

definePageMeta({
  layout: 'admin'
})

const { rooms, fetchRooms } = useRooms()
const { bookings, fetchBookings } = useBookings()

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchBookings()])
})

// Get active bookings (confirmed bookings that haven't ended yet)
const activeBookings = computed(() => {
  const today = new Date()
  return bookings.value.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.checkOut) >= today
  )
})

// Get upcoming check-ins (confirmed bookings with check-in date in the future)
const upcomingCheckIns = computed(() => {
  const today = new Date()
  return bookings.value.filter(booking => 
    booking.status === 'confirmed' && new Date(booking.checkIn) >= today
  )
})

// Get recent bookings (last 5 bookings)
const recentBookings = computed(() => {
  return [...bookings.value]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)
})

// Format date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  })
}

// Get room name by ID
const getRoomName = (roomId: string): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Room'
}

// Get booking status class
const bookingStatusClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>
