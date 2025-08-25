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
          'selected': isDateInRange(day.date),
          'disabled': day.status === 'disabled',
          'booked': day.status === 'booked',
          'available': day.status === 'available',
        }"
        @click="handleDayClick(day)"
      >
        <span class="day-number">{{ day.dayNumber }}</span>
      </div>
    </div>

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
import { ref, computed, onMounted, watch } from "vue";
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
const currentDate = ref(new Date());
const selectedStartDate = ref<Date | null>(null);
const selectedEndDate = ref<Date | null>(null);
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

function isDateInRange(date: Date): boolean {
  if (!selectedStartDate.value) return false;
  if (!selectedEndDate.value) return isSameDay(date, selectedStartDate.value);
  
  return (
    date >= selectedStartDate.value && 
    date <= selectedEndDate.value
  );
}

function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
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
  if (!day.isCurrentMonth || day.status === 'disabled' || day.status === 'booked') {
    return;
  }
  
  const clickedDate = new Date(day.date);
  
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
  
  for (const day of calendarDays.value) {
    const dayTime = day.date.getTime();
    if (
      dayTime >= startTime && 
      dayTime <= endTime && 
      day.status === 'booked'
    ) {
      // Found a booked date in the range, don't allow selection
      return;
    }
  }
  
  // Set end date
  selectedEndDate.value = clickedDate;
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
    
    // Don't allow booking dates in the past
    if (currentDay < new Date(today.setHours(0, 0, 0, 0))) {
      status = DateStatusEnum.DISABLED;
    } else {
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
  @apply bg-red-100 text-red-800 cursor-not-allowed;
}

.available {
  @apply bg-green-100 text-green-800 hover:bg-green-200;
}
</style>

