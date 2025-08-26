<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <h1 class="text-lg font-medium leading-6 text-gray-900">Bookings Management</h1>
    </div>
    
    <div v-if="loading" class="flex justify-center mt-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="error" class="mt-8 bg-red-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg class="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>
    
    <div v-else class="mt-8">
      <!-- Filter Controls -->
      <div class="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div class="md:grid md:grid-cols-4 md:gap-6">
          <div class="md:col-span-1">
            <h3 class="text-lg font-medium leading-6 text-gray-900">Filter Bookings</h3>
          </div>
          <div class="mt-5 md:mt-0 md:col-span-3">
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
              <div>
                <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                <select
                  id="status"
                  v-model="filterStatus"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Statuses</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="pending">Pending</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div>
                <label for="room" class="block text-sm font-medium text-gray-700">Room</label>
                <select
                  id="room"
                  v-model="filterRoomId"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Rooms</option>
                  <option v-for="room in rooms" :key="room.id" :value="room.id">
                    {{ room.name }}
                  </option>
                </select>
              </div>
              
              <div>
                <label for="dateRange" class="block text-sm font-medium text-gray-700">Date Range</label>
                <select
                  id="dateRange"
                  v-model="filterDateRange"
                  class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                >
                  <option value="">All Dates</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                  <option value="current">Current Stay</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Bookings Table -->
      <div class="flex flex-col">
        <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Guest
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Room
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Dates
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="relative px-6 py-3">
                      <span class="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody v-if="filteredBookings.length > 0" class="bg-white divide-y divide-gray-200">
                  <tr v-for="booking in filteredBookings" :key="booking.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div>
                          <div class="text-sm font-medium text-gray-900">
                            {{ booking.guestName }}
                          </div>
                          <div class="text-sm text-gray-500">
                            {{ booking.guestEmail }}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ getRoomName(booking.roomId) }}</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="text-sm text-gray-900">{{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}</div>
                      <div class="text-sm text-gray-500">{{ calculateNights(booking.checkIn, booking.checkOut) }} nights</div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="bookingStatusClass(booking.status)">
                        {{ booking.status }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button class="text-indigo-600 hover:text-indigo-900 mr-4">View</button>
                      <button 
                        v-if="booking.status === 'pending'" 
                        class="text-green-600 hover:text-green-900 mr-4"
                      >
                        Confirm
                      </button>
                      <button 
                        v-if="booking.status !== 'cancelled'" 
                        class="text-red-600 hover:text-red-900"
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                </tbody>
                <tbody v-else>
                  <tr>
                    <td colspan="5" class="px-6 py-4 text-center text-gray-500">
                      No bookings found matching your filters.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const { rooms, fetchRooms } = useRooms()
const { bookings, loading, error, fetchBookings } = useBookings()

// Filter states
const filterStatus = ref('')
const filterRoomId = ref('')
const filterDateRange = ref('')

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchBookings()])
})

// Filtered bookings based on selected filters
const filteredBookings = computed(() => {
  let result = [...bookings.value]
  
  // Filter by status
  if (filterStatus.value) {
    result = result.filter(booking => booking.status === filterStatus.value)
  }
  
  // Filter by room
  if (filterRoomId.value) {
    result = result.filter(booking => booking.roomId === filterRoomId.value)
  }
  
  // Filter by date range
  if (filterDateRange.value) {
    const today = new Date()
    
    if (filterDateRange.value === 'upcoming') {
      result = result.filter(booking => new Date(booking.checkIn) > today)
    } else if (filterDateRange.value === 'past') {
      result = result.filter(booking => new Date(booking.checkOut) < today)
    } else if (filterDateRange.value === 'current') {
      result = result.filter(booking => 
        new Date(booking.checkIn) <= today && new Date(booking.checkOut) >= today
      )
    }
  }
  
  return result
})

// Format date
const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

// Calculate number of nights
const calculateNights = (checkIn: Date, checkOut: Date): number => {
  const start = new Date(checkIn)
  const end = new Date(checkOut)
  const diffTime = Math.abs(end.getTime() - start.getTime())
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
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

