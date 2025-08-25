<template>
  <div class="client-booking-calendar">
    <v-calendar
      :attributes="calendarAttributes"
      :min-date="new Date()"
      is-range-mode
      :disabled-dates="disabledDates"
      :select-attribute="selectAttribute"
      @dayclick="handleDayClick"
      @update:from-page="updatePage"
    />

    <div v-if="selectedStartDate && selectedEndDate" class="mt-4">
      <p class="text-sm">
        Selected: {{ formatDateRange() }}
      </p>
      <button 
        @click="$emit('bookingPrepared', { startDate: selectedStartDate, endDate: selectedEndDate })" 
        class="btn btn-primary btn-sm mt-2"
      >
        Proceed to Booking
      </button>
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
const selectedStartDate = ref<Date | null>(null);
const selectedEndDate = ref<Date | null>(null);
const currentPage = ref(new Date());

// Computed properties for v-calendar
const calendarAttributes = computed(() => {
  const attributes = [];
  
  // Add booking attributes
  for (const booking of props.bookings) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
    attributes.push({
      highlight: {
        color: 'red',
        fillMode: 'solid',
      },
      dates: { start: checkInDate, end: checkOutDate },
      popover: {
        label: 'Not available',
      },
    });
  }
  
  return attributes;
});

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

const selectAttribute = computed(() => {
  if (!selectedStartDate.value) {
    return null;
  }
  
  if (!selectedEndDate.value) {
    return {
      highlight: {
        color: 'blue',
        fillMode: 'solid',
      },
      dates: selectedStartDate.value,
    };
  }
  
  return {
    highlight: {
      color: 'blue',
      fillMode: 'solid',
    },
    dates: {
      start: selectedStartDate.value,
      end: selectedEndDate.value,
    },
  };
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
  if (!selectedStartDate.value) return '';
  
  if (!selectedEndDate.value || isSameDay(selectedStartDate.value, selectedEndDate.value)) {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(selectedStartDate.value);
  }
  
  return `${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(selectedStartDate.value)} - ${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(selectedEndDate.value)}`;
}

function handleDayClick(day: any) {
  const clickedDate = new Date(day.id);
  
  // Don't allow interaction with booked dates
  if (isDateBooked(clickedDate)) {
    return;
  }
  
  // If no start date is selected or if both dates are already selected, set start date
  if (!selectedStartDate.value || (selectedStartDate.value && selectedEndDate.value)) {
    selectedStartDate.value = clickedDate;
    selectedEndDate.value = null;
    return;
  }
  
  // If clicked date is before start date, swap them
  if (clickedDate < selectedStartDate.value) {
    selectedEndDate.value = selectedStartDate.value;
    selectedStartDate.value = clickedDate;
    return;
  }
  
  // Check if any date in the range is booked
  const startTime = selectedStartDate.value.getTime();
  const endTime = clickedDate.getTime();
  
  for (const booking of props.bookings) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
    // Check if booking overlaps with selected range
    if (
      (checkInDate >= selectedStartDate.value && checkInDate <= clickedDate) ||
      (checkOutDate >= selectedStartDate.value && checkOutDate <= clickedDate) ||
      (checkInDate <= selectedStartDate.value && checkOutDate >= clickedDate)
    ) {
      // Found a booked date in the range, don't allow selection
      return;
    }
  }
  
  // Set end date
  selectedEndDate.value = clickedDate;
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
