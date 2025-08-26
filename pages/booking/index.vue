<template>
  <div>
    <div class="bg-white shadow">
      <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <h1 class="text-2xl font-bold text-gray-900">Book Your Stay</h1>
        <p class="mt-2 text-sm text-gray-500">Please select a room to book</p>
      </div>
    </div>
    
    <div v-if="loading" class="flex justify-center mt-8">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
    </div>
    
    <div v-else-if="error" class="mt-8 bg-red-50 p-4 rounded-md max-w-7xl mx-auto">
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
    
    <div v-else-if="rooms.length === 0" class="mt-8 text-center text-gray-500">
      No rooms available for booking at the moment.
    </div>
    
    <div v-else class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="room in rooms" :key="room.id" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="h-48 w-full object-cover">
            <img v-if="room.images.length > 0" :src="room.images[0]" :alt="room.name" class="h-full w-full object-cover" />
            <div v-else class="h-full w-full bg-gray-200 flex items-center justify-center">
              <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <div class="px-4 py-5 sm:p-6">
            <h3 class="text-lg font-medium text-gray-900">{{ room.name }}</h3>
            <p class="mt-1 text-sm text-gray-500">{{ room.description }}</p>
            <div class="mt-4">
              <span class="text-lg font-semibold text-gray-900">${{ room.price }}</span>
              <span class="text-sm text-gray-500"> / night</span>
            </div>
            <div class="mt-2 flex items-center text-sm text-gray-500">
              <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {{ room.capacity }} {{ room.capacity === 1 ? 'guest' : 'guests' }}
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="flex justify-between">
              <NuxtLink :to="`/rooms/${room.id}`" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                View Details
              </NuxtLink>
              <NuxtLink :to="`/booking/${room.id}`" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                Book Now <span aria-hidden="true">&rarr;</span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { rooms, loading, error, fetchRooms } = useRooms()

onMounted(async () => {
  await fetchRooms()
})
</script>

