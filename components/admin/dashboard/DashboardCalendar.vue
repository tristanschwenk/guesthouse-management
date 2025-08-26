<template>
  <div class="dashboard-calendar">
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">All Room Bookings</h2>
      <p class="text-gray-600">
        Overview of all bookings across all rooms. Different colors represent different booking sources.
      </p>
    </div>
    
    <div class="bg-white rounded-lg shadow p-4">
      <v-calendar
        :attributes="calendarAttributes"
        :min-date="new Date()"
        @update:from-page="updatePage"
      />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <!-- Upcoming Check-ins -->
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-md font-semibold mb-4">Upcoming Check-ins</h3>
        <div v-if="upcomingCheckIns.length === 0" class="text-gray-500">
          No upcoming check-ins.
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="booking in upcomingCheckIns" :key="booking.id" class="py-3">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">{{ booking.guestName }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(booking.checkIn) }}</p>
              </div>
              <div class="text-sm">
                <p>{{ getRoomName(booking.roomId) }}</p>
                <p class="text-gray-500">{{ booking.source || 'Direct' }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <!-- Upcoming Check-outs -->
      <div class="bg-white rounded-lg shadow p-4">
        <h3 class="text-md font-semibold mb-4">Upcoming Check-outs</h3>
        <div v-if="upcomingCheckOuts.length === 0" class="text-gray-500">
          No upcoming check-outs.
        </div>
        <ul v-else class="divide-y divide-gray-200">
          <li v-for="booking in upcomingCheckOuts" :key="booking.id" class="py-3">
            <div class="flex justify-between">
              <div>
                <p class="font-medium">{{ booking.guestName }}</p>
                <p class="text-sm text-gray-500">{{ formatDate(booking.checkOut) }}</p>
              </div>
              <div class="text-sm">
                <p>{{ getRoomName(booking.roomId) }}</p>
                <p class="text-gray-500">{{ booking.source || 'Direct' }}</p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Booking } from '~/types';

const { bookings, fetchBookings } = useBookings();
const { rooms, fetchRooms } = useRooms();

const currentPage = ref(new Date());

// Fetch data on mount
onMounted(async () => {
  await fetchBookings();
  await fetchRooms();
});

// Computed properties for v-calendar
const calendarAttributes = computed(() => {
  const attributes = [];
  
  // Add booking attributes
  for (const booking of bookings.value) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    const roomName = getRoomName(booking.roomId);
    
    // Determine color based on booking source
    let color = 'blue'; // Default color for regular bookings
    
    if (booking.source) {
      switch(booking.source) {
        case 'booking.com':
          color = 'green';
          break;
        case 'disabled':
          color = 'red'; // Only use red for explicitly disabled dates
          break;
        case 'autre':
          color = 'purple';
          break;
        default:
          color = 'blue';
      }
    }
    
    // Add the main booking span
    attributes.push({
      highlight: {
        color: color,
        fillMode: 'light',
      },
      dates: { start: checkInDate, end: checkOutDate },
      popover: {
        label: `${roomName}: ${booking.guestName}${booking.source ? ` (${booking.source})` : ''}`,
      },
    });
    
    // Add check-in indicator
    attributes.push({
      dot: {
        color: 'green',
      },
      dates: checkInDate,
      popover: {
        label: `Check-in: ${booking.guestName} - ${roomName}`,
      },
    });
    
    // Add check-out indicator
    attributes.push({
      dot: {
        color: 'orange',
      },
      dates: checkOutDate,
      popover: {
        label: `Check-out: ${booking.guestName} - ${roomName}`,
      },
    });
  }
  
  return attributes;
});

// Get upcoming check-ins (next 7 days)
const upcomingCheckIns = computed(() => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return bookings.value
    .filter(booking => {
      const checkIn = new Date(booking.checkIn);
      return checkIn >= today && checkIn <= nextWeek;
    })
    .sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
});

// Get upcoming check-outs (next 7 days)
const upcomingCheckOuts = computed(() => {
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  return bookings.value
    .filter(booking => {
      const checkOut = new Date(booking.checkOut);
      return checkOut >= today && checkOut <= nextWeek;
    })
    .sort((a, b) => new Date(a.checkOut).getTime() - new Date(b.checkOut).getTime());
});

// Methods
function updatePage(page: any) {
  currentPage.value = page.firstDate;
}

function getRoomName(roomId: string | number): string {
  const room = rooms.value.find(r => r.id.toString() === roomId.toString());
  return room ? room.name : `Room ${roomId}`;
}

function formatDate(date: Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric'
  });
}
</script>

<style scoped>
/* Override v-calendar styles */
:deep(.vc-container) {
  --vc-accent-50: #eef2ff;
  --vc-accent-100: #e0e7ff;
  --vc-accent-200: #c7d2fe;
  --vc-accent-300: #a5b4fc;
  --vc-accent-400: #818cf8;
  --vc-accent-500: #6366f1;
  --vc-accent-600: #4f46e5;
  --vc-accent-700: #4338ca;
  --vc-accent-800: #3730a3;
  --vc-accent-900: #312e81;
}
</style>

