<template>
  <div class="admin-booking-calendar">
    <DatePicker
      :attributes="calendarAttributes"
      :min-date="new Date()"
      :is-range-mode="isSelectionMode"
      :select-attribute="selectAttribute"
      :model-value="dateRange"
      :model-modifiers="{ range: true }"
      @update:model-value="updateValue"
      @update:from-page="updatePage"
    />

    <div v-if="isSelectionMode && selectedDates.length > 0" class="mt-4 p-4 bg-indigo-50 rounded-md">
      <div class="flex justify-between items-center">
        <p class="text-sm font-medium text-indigo-800">
          Selected: {{ formatDateRange(selectedDates) }}
        </p>
        <button 
          @click="$emit('openBookingModal', selectedDates)" 
          class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Booking
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { DateStatus, Booking } from "~/types";
import { DateStatus as DateStatusEnum } from "~/types";
import { DatePicker } from "v-calendar";

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
const dateRange = ref<{ start: Date; end: Date } | null>(null);

const updateValue = (value: { start: Date; end: Date } | null) => {
  if (value) {
    dateRange.value = value;
    emit("openBookingModal", [value.start, value.end]);
  }
}

// Computed properties for v-calendar
const calendarAttributes = computed(() => {
  const attributes = [];
  
  // Add booking attributes
  for (const booking of props.bookings) {
    const checkInDate = new Date(booking.checkIn);
    const checkOutDate = new Date(booking.checkOut);
    
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
        fillMode: 'solid',
      },
      dates: { start: checkInDate, end: checkOutDate },
      popover: {
        label: booking.source === 'disabled' 
          ? 'Disabled date' 
          : `Booked: ${booking.guestName}${booking.source ? ` (${booking.source})` : ''}`,
      },
    });
    
    // Add check-in indicator
    attributes.push({
      dot: {
        color: 'green',
        class: 'opacity-75',
      },
      dates: checkInDate,
      popover: {
        label: `Check-in: ${booking.guestName}`,
      },
    });
    
    // Add check-out indicator
    attributes.push({
      dot: {
        color: 'orange',
        class: 'opacity-75',
      },
      dates: checkOutDate,
      popover: {
        label: `Check-out: ${booking.guestName}`,
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
