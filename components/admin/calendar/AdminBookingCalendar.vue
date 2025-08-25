<template>
  <div class="calendar-container">
    <div class="calendar-header">
      <h3 class="text-xl font-semibold">{{ currentMonthName }} {{ currentYear }}</h3>
      <div class="flex gap-2">
        <button @click="prevMonth" class="btn btn-sm">
          <span class="i-heroicons-chevron-left-20-solid"></span>
        </button>
        <button @click="nextMonth" class="btn btn-sm">
          <span class="i-heroicons-chevron-right-20-solid"></span>
        </button>
      </div>
    </div>

    <div class="calendar-days">
      <div v-for="day in daysOfWeek" :key="day" class="day-name">
        {{ day }}
      </div>
    </div>

    <div class="calendar-grid">
      <div
        v-for="(day, index) in calendarDays"
        :key="index"
        class="calendar-day"
        :class="{
          'inactive': !day.isCurrentMonth,
          'today': day.isToday,
          'selected': isDateSelected(day.date),
          'disabled': day.status === 'disabled',
          'booked': day.status === 'booked',
          'available': day.status === 'available',
        }"
        @click="handleDayClick(day)"
      >
        <span class="day-number">{{ day.dayNumber }}</span>
      </div>
    </div>

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
import { ref, computed, onMounted, watch, type Ref } from "vue";
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
const currentDate = ref(new Date());
const selectedDates = ref<Date[]>([]);
const calendarDays = ref<any[]>([]);

// Computed properties
const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate.value);
});

const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const daysOfWeek = computed(() => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
});

// Methods
function prevMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
}

function nextMonth() {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
}

function isDateSelected(date: Date): boolean {
  return selectedDates.value.some(d => isSameDay(d, date));
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
  if (!day.isCurrentMonth || day.status === 'disabled') {
    return;
  }

  if (props.isSelectionMode) {
    // In selection mode, select/deselect date
    const index = selectedDates.value.findIndex((d) =>
      isSameDay(d, day.date)
    );
    
    if (index !== -1) {
      // Deselect date
      selectedDates.value.splice(index, 1);
    } else {
      // Select date
      selectedDates.value.push(new Date(day.date));
    }
  } else {
    // In toggle mode, toggle date status
    emit('dateToggled', day.date);
  }
}

function generateCalendar() {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  
  // Start from the previous month's days that appear in the first week
  const daysFromPrevMonth = firstDay.getDay();
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - daysFromPrevMonth);
  
  const days = [];
  const today = new Date();
  
  // Generate 6 weeks (42 days) to ensure we cover the entire month view
  for (let i = 0; i < 42; i++) {
    const currentDay = new Date(startDate);
    currentDay.setDate(startDate.getDate() + i);
    
    const isCurrentMonth = currentDay.getMonth() === month;
    const isToday = isSameDay(currentDay, today);
    
    // Determine day status based on bookings
    let status: DateStatus = DateStatusEnum.AVAILABLE;
    
    // Check if the day is in any booking
    for (const booking of props.bookings) {
      const checkInDate = new Date(booking.checkIn);
      const checkOutDate = new Date(booking.checkOut);
      
      if (
        currentDay >= checkInDate &&
        currentDay <= checkOutDate
      ) {
        status = DateStatusEnum.BOOKED;
        break;
      }
    }
    
    days.push({
      date: new Date(currentDay),
      dayNumber: currentDay.getDate(),
      isCurrentMonth,
      isToday,
      status,
    });
  }
  
  calendarDays.value = days;
}

// Watch for changes in current date or bookings
watch([currentDate, () => props.bookings], () => {
  generateCalendar();
}, { immediate: true });

// Clear selection when selection mode changes
watch(() => props.isSelectionMode, (newValue) => {
  if (!newValue) {
    selectedDates.value = [];
  }
});

onMounted(() => {
  generateCalendar();
});
</script>

<style scoped>
.calendar-container {
  @apply bg-white rounded-lg shadow p-4 w-full;
}

.calendar-header {
  @apply flex justify-between items-center mb-4;
}

.calendar-days {
  @apply grid grid-cols-7 gap-1 mb-2;
}

.day-name {
  @apply text-center text-sm font-medium text-gray-500;
}

.calendar-grid {
  @apply grid grid-cols-7 gap-1;
}

.calendar-day {
  @apply aspect-square flex items-center justify-center rounded-md relative cursor-pointer text-sm;
}

.day-number {
  @apply z-10;
}

.inactive {
  @apply text-gray-300;
}

.today {
  @apply font-bold;
}

.selected {
  @apply bg-blue-100 text-blue-800;
}

.disabled {
  @apply bg-gray-200 text-gray-400 cursor-not-allowed;
}

.booked {
  @apply bg-red-100 text-red-800;
}

.available {
  @apply bg-green-100 text-green-800 hover:bg-green-200;
}
</style>

