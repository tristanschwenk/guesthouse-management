<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <div>
        <h1 class="text-lg font-medium leading-6 text-gray-900">Room Calendar</h1>
        <p class="mt-1 text-sm text-gray-500">
          {{ room ? room.name : 'Loading...' }}
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
    
    <div v-else-if="!room" class="mt-8 text-center text-gray-500">
      Room not found.
    </div>
    
    <div v-else class="mt-8">
      <AvailabilityManager :roomId="roomId" :roomName="room.name" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const roomId = computed(() => route.params.roomId as string)

const { rooms, loading, error, fetchRooms } = useRooms()
const room = computed(() => rooms.value.find(r => r.id === roomId.value))

onMounted(async () => {
  await fetchRooms()
})
</script>

