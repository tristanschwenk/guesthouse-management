<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <div>
        <h1 class="text-lg font-medium leading-6 text-gray-900">Room Calendar</h1>
        <p class="mt-1 text-sm text-gray-500">
          Select a room to view its calendar
        </p>
      </div>
      <NuxtLink 
        to="/admin/rooms" 
        class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Back to Rooms
      </NuxtLink>
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
    
    <div v-else-if="rooms.length === 0" class="mt-8 text-center text-gray-500">
      No rooms available. Please add rooms first.
    </div>
    
    <div v-else class="mt-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div v-for="room in rooms" :key="room.id" class="bg-white overflow-hidden shadow rounded-lg">
          <div class="px-4 py-5 sm:p-6">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-10 w-10">
                <img v-if="room.images.length > 0" class="h-10 w-10 rounded-full object-cover" :src="room.images[0]" alt="" />
                <div v-else class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <svg class="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div class="ml-4">
                <div class="text-sm font-medium text-gray-900">
                  {{ room.name }}
                </div>
                <div class="text-sm text-gray-500">
                  {{ room.capacity }} {{ room.capacity === 1 ? 'guest' : 'guests' }} • ${{ room.price }}/night
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-4 sm:px-6">
            <div class="text-sm">
              <NuxtLink :to="`/admin/calendar/${room.id}`" class="font-medium text-indigo-600 hover:text-indigo-500">
                View Calendar <span aria-hidden="true">&rarr;</span>
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

definePageMeta({
  layout: 'admin'
})

const { rooms, loading, error, fetchRooms } = useRooms()

onMounted(async () => {
  await fetchRooms()
})
</script>

