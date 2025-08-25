<template>
  <div class="admin-booking-calendar">
    <v-calendar
      :attributes="calendarAttributes"
      :min-date="new Date()"
      :is-range-mode="isSelectionMode"
      :select-attribute="selectAttribute"
      @dayclick="handleDayClick"
      @update:from-page="updatePage"
    />

    <div v-if="isSelectionMode && selectedDates.length > 0" class="mt-4">
      <p class="text-sm">
        Selected: {{ formatDateRange(selectedDates) }}
      </p>
      <button 
        @click="$emit('openBookingModal', selectedDates)" 
        class="btn btn-primary btn-sm mt-2"
      >
        Create Booking
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
  },
  isSelectionMode: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['dateToggled', 'openBookingModal']);

// Calendar state
const selectedDates = ref<Date[]>([]);
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
        label: `Booked: ${booking.guestName}`,
      },
    });
  }
  
  return attributes;
});

const selectAttribute = computed(() => {
  if (!props.isSelectionMode || selectedDates.value.length === 0) {
    return null;
  }
  
  // Sort dates
  const sortedDates = [...selectedDates.value].sort((a, b) => a.getTime() - b.getTime());
  
  if (sortedDates.length === 1) {
    return {
      highlight: {
        color: 'blue',
        fillMode: 'solid',
      },
      dates: sortedDates[0],
    };
  }
  
  return {
    highlight: {
      color: 'blue',
      fillMode: 'solid',
    },
    dates: {
      start: sortedDates[0],
      end: sortedDates[sortedDates.length - 1],
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

function formatDateRange(dates: Date[]): string {
  if (!dates.length) return '';
  
  if (dates.length === 1) {
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric' 
    }).format(dates[0]);
  }
  
  // Sort dates
  const sortedDates = [...dates].sort((a, b) => a.getTime() - b.getTime());
  
  return `${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(sortedDates[0])} - ${new Intl.DateTimeFormat('en-US', { 
    month: 'short', 
    day: 'numeric' 
  }).format(sortedDates[sortedDates.length - 1])}`;
}

function handleDayClick(day: any) {
  const clickedDate = new Date(day.id);
  
  // Don't allow interaction with booked dates
  if (isDateBooked(clickedDate)) {
    return;
  }

  if (props.isSelectionMode) {
    // In selection mode, select/deselect date
    const index = selectedDates.value.findIndex((d) => 
      isSameDay(d, clickedDate)
    );
    
    if (index !== -1) {
      // Deselect date
      selectedDates.value.splice(index, 1);
    } else {
      // Select date
      selectedDates.value.push(clickedDate);
    }
  } else {
    // In toggle mode, toggle date status
    emit('dateToggled', clickedDate);
  }
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Clear selection when selection mode changes
watch(() => props.isSelectionMode, (newValue) => {
  if (!newValue) {
    selectedDates.value = [];
  }
});
</script>

<style scoped>
.admin-booking-calendar {
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
