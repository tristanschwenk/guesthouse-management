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
    
    <!-- Stats Cards -->
    <div class="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      <!-- Total Revenue -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Revenue</p>
              <p class="text-3xl font-semibold text-gray-900">${{ totalRevenue.toLocaleString() }}</p>
              <p class="mt-1 text-sm text-green-600">
                <span class="font-medium">+{{ revenueGrowth }}%</span>
                <span class="text-gray-500 ml-1">This month</span>
              </p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Active Bookings -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Active Bookings</p>
              <p class="text-3xl font-semibold text-gray-900">{{ activeBookings.length }}</p>
              <p class="mt-1 text-sm text-green-600">
                <span class="font-medium">+{{ activeBookingsGrowth }}</span>
                <span class="text-gray-500 ml-1">Currently checked in</span>
              </p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Occupancy Rate -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Occupancy Rate</p>
              <p class="text-3xl font-semibold text-gray-900">{{ occupancyRate }}%</p>
              <p class="mt-1 text-sm text-red-600">
                <span class="font-medium">-{{ occupancyRateChange }}%</span>
                <span class="text-gray-500 ml-1">This week</span>
              </p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <!-- Total Customers -->
      <div class="bg-white overflow-hidden shadow rounded-lg">
        <div class="px-4 py-5 sm:p-6">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500">Total Customers</p>
              <p class="text-3xl font-semibold text-gray-900">{{ totalCustomers }}</p>
              <p class="mt-1 text-sm text-green-600">
                <span class="font-medium">+{{ totalCustomersGrowth }}</span>
                <span class="text-gray-500 ml-1">All time</span>
              </p>
            </div>
            <div class="text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Charts Section -->
    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Revenue Trend Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Revenue Trend</h2>
        <p class="text-sm text-gray-500 mb-4">Monthly revenue over the last 6 months</p>
        <div class="h-64">
          <apexchart
            type="bar"
            height="100%"
            :options="revenueChartOptions"
            :series="revenueChartSeries"
          ></apexchart>
        </div>
      </div>

      <!-- Weekly Occupancy Chart -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-4">Weekly Occupancy</h2>
        <p class="text-sm text-gray-500 mb-4">Occupancy rate by day of the week</p>
        <div class="h-64">
          <apexchart
            type="line"
            height="100%"
            :options="occupancyChartOptions"
            :series="occupancyChartSeries"
          ></apexchart>
        </div>
      </div>
    </div>

    <!-- Bottom Section -->
    <div class="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
      <!-- Room Type Distribution -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Room Type Distribution</h2>
        <p class="text-sm text-gray-500 mb-4">Bookings by room type</p>
        <div class="h-64">
          <apexchart
            type="pie"
            height="100%"
            :options="roomDistributionChartOptions"
            :series="roomDistributionSeries"
          ></apexchart>
        </div>
      </div>

      <!-- Recent Bookings -->
      <div class="bg-white p-6 rounded-lg shadow">
        <h2 class="text-lg font-medium text-gray-900 mb-2">Recent Bookings</h2>
        <p class="text-sm text-gray-500 mb-4">Latest booking requests</p>
        <div class="space-y-4">
          <div v-for="(booking, index) in recentBookings" :key="index" class="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
            <div class="flex justify-between items-start">
              <div>
                <p class="font-medium text-gray-900">{{ booking.guestName }}</p>
                <p class="text-sm text-gray-500">{{ getRoomName(booking.roomId) }}</p>
                <div class="flex items-center text-sm text-gray-500 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{{ booking.location }}</span>
                  <span class="mx-2">•</span>
                  <span>Check-in: {{ formatDate(booking.checkIn) }}</span>
                </div>
              </div>
              <div>
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" 
                  :class="bookingStatusClass(booking.status)">
                  {{ booking.status }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const { rooms, fetchRooms } = useRooms()
const { bookings, fetchBookings } = useBookings()
const { getRevenueChartOptions, getOccupancyChartOptions, getRoomDistributionChartOptions } = useCharts()


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


onMounted(async () => {
  await Promise.all([fetchRooms(), fetchBookings()])
})

// Mock data for statistics
const totalRevenue = 24580
const revenueGrowth = 12.5
const occupancyRate = 78
const occupancyRateChange = 2.1
const totalCustomers = 1247
const totalCustomersGrowth = 23
const activeBookingsGrowth = 8

// Revenue data for chart
const revenueData = [
  { label: 'Jan', value: 18000 },
  { label: 'Feb', value: 21500 },
  { label: 'Mar', value: 19800 },
  { label: 'Apr', value: 24000 },
  { label: 'May', value: 21000 },
  { label: 'Jun', value: 26000 }
]

// Revenue Chart Configuration
const revenueChartOptions = computed(() => getRevenueChartOptions(revenueData))
const revenueChartSeries = ref([
  {
    name: 'Revenue',
    data: revenueData.map(item => item.value)
  }
])

// Weekly occupancy data for chart
const weeklyOccupancyData = [
  { label: 'Mon', value: 65 },
  { label: 'Tue', value: 72 },
  { label: 'Wed', value: 68 },
  { label: 'Thu', value: 78 },
  { label: 'Fri', value: 82 },
  { label: 'Sat', value: 93 },
  { label: 'Sun', value: 88 }
]

// Occupancy Chart Configuration
const occupancyChartOptions = computed(() => getOccupancyChartOptions(weeklyOccupancyData))
const occupancyChartSeries = ref([
  {
    name: 'Occupancy',
    data: weeklyOccupancyData.map(item => item.value)
  }
])

// Room distribution data
const roomDistributionData = [
  { label: 'Deluxe Suite', value: 35 },
  { label: 'Standard Room', value: 28 },
  { label: 'Executive Suite', value: 15 },
  { label: 'Family Lodge', value: 22 }
]

// Room Distribution Chart Configuration
const roomDistributionChartOptions = computed(() => getRoomDistributionChartOptions(roomDistributionData))
const roomDistributionSeries = ref(roomDistributionData.map(item => item.value))
</script>

