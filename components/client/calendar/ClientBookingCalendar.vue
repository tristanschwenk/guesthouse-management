<template>
  <div class="client-booking-calendar">
    <v-calendar
      :min-date="new Date()"
      :disabled-dates="disabledDates"
      color="blue"
      is-range
      v-model.range="selectedRange"
      @update:from-page="updatePage"
    />

    <div v-if="selectedRange.start && selectedRange.end" class="mt-4 p-4 bg-blue-50 rounded-md">
      <div class="flex justify-between items-center">
        <p class="text-sm font-medium text-blue-800">
          Selected: {{ formatDateRange() }}
        </p>
        <button 
          @click="$emit('bookingPrepared', { startDate: selectedRange.start, endDate: selectedRange.end })" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Proceed to Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { DateStatus, Booking } from "~/types";
import { DateStatus as DateStatusEnum } from "~/types";

const props = defineProps({
  bookings: {
    type: Array as () => Booking[],
    default: () => [],
  }
});

const emit = defineEmits(['bookingPrepared']);

// Calendar state
const selectedRange = ref({ start: null, end: null });
const currentPage = ref(new Date());

// Computed properties for v-calendar
const disabledDates = computed(() => {
  const dates = [];
  
  // Add past dates
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dates.push({
    start: null,
    end: new Date(today.getTime() - 86400000) // yesterday
  });
  
  // Add booked dates
  for (const booking of props.bookings) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
    dates.push({
      start: checkInDate,
      end: checkOutDate
    });
  }
  
  return dates;
});

// Methods
function updatePage(page: any) {
  currentPage.value = page.firstDate;
}

function isDateBooked(date: Date): boolean {
  return props.bookings.some(booking => {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    return date >= checkInDate && date <= checkOutDate;
  });
}

function formatDateRange(): string {
  if (!selectedRange.value.start) return '';
  
  if (!selectedRange.value.end || isSameDay(selectedRange.value.start, selectedRange.value.end)) {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(selectedRange.value.start);
  }
  
  return `${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(selectedRange.value.start)} - ${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(selectedRange.value.end)}`;
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}
</script>

<style scoped>
.client-booking-calendar {
  @apply bg-white rounded-lg shadow p-4 w-full;
}

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
