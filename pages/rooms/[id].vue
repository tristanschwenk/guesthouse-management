<template>
  <div>
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
    
    <div v-else>
      <div class="bg-white">
        <div class="max-w-2xl mx-auto py-8 px-4 sm:py-12 sm:px-6 lg:max-w-7xl lg:px-8">
          <div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <!-- Image gallery -->
            <div class="flex flex-col-reverse">
              <div class="w-full aspect-w-1 aspect-h-1">
                <img 
                  v-if="room.images.length > 0" 
                  :src="room.images[0]" 
                  :alt="room.name" 
                  class="w-full h-96 object-cover object-center rounded-lg"
                />
                <div v-else class="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
                  <svg class="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Room details -->
            <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">{{ room.name }}</h1>
              
              <div class="mt-3">
                <h2 class="sr-only">Room information</h2>
                <p class="text-3xl text-gray-900">${{ room.price }} <span class="text-base font-medium text-gray-500">/ night</span></p>
              </div>

              <div class="mt-6">
                <h3 class="sr-only">Description</h3>
                <div class="text-base text-gray-700 space-y-6">
                  <p>{{ room.description }}</p>
                </div>
              </div>

              <div class="mt-6">
                <div class="flex items-center">
                  <svg class="flex-shrink-0 h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
                  </svg>
                  <p class="ml-2 text-sm text-gray-500">Capacity: {{ room.capacity }} {{ room.capacity === 1 ? 'guest' : 'guests' }}</p>
                </div>
              </div>

              <div class="mt-6">
                <h3 class="text-sm font-medium text-gray-900">Amenities</h3>
                <div class="mt-2">
                  <ul class="pl-4 list-disc text-sm space-y-2">
                    <li v-for="(amenity, index) in room.amenities" :key="index" class="text-gray-500">
                      {{ amenity }}
                    </li>
                  </ul>
                </div>
              </div>

              <div class="mt-8">
                <NuxtLink 
                  :to="`/booking/${room.id}`" 
                  class="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Book Now
                </NuxtLink>
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

const route = useRoute()
const roomId = computed(() => route.params.id as string)

const { rooms, loading, error, fetchRooms } = useRooms()
const room = computed(() => rooms.value.find(r => r.id === roomId.value))

onMounted(async () => {
  await fetchRooms()
})
</script>

