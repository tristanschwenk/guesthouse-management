<template>
  <div class="booking-calendar">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <div class="flex space-x-2">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-open rounded-full mr-1"></div>
          <span class="text-sm">Available</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-close rounded-full mr-1"></div>
          <span class="text-sm">Booked</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-open-close rounded-full mr-1"></div>
          <span class="text-sm">Check-in</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-close-open rounded-full mr-1"></div>
          <span class="text-sm">Check-out</span>
        </div>
      </div>
    </div>

    <v-calendar
      :attributes="calendarAttributes"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      @dayclick="onDayClick"
      is-expanded
      :masks="{
        title: 'MMMM YYYY',
        weekdays: 'WWW',
        navMonths: 'MMM',
      }"
    >
      <template #day-content="{ day }">
        <DateCell
          :date="day.date"
          :status="getDayStatus(day.date)"
          :booking="getDayBooking(day.date)"
          :show-booking-info="showBookingInfo"
        />
      </template>
    </v-calendar>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from "vue";
import type { DateStatus, Booking } from "~/types";

const props = defineProps<{
  roomId: string;
  title?: string;
  mode?: "admin" | "booking";
  showBookingInfo?: boolean;
  minDate?: Date;
  maxDate?: Date;
  selectedDates?: Date[];
}>();

const emit = defineEmits<{
  (e: "update:selectedDates", dates: Date[]): void;
  (e: "dateStatusToggle", date: Date): void;
}>();

const { disabledDates, roomBookings, getDateStatus, toggleDateStatus, init } =
  useCalendar(props.roomId);

const selectedDatesInternal = ref<Date[]>(props.selectedDates || []);
const isInitialized = ref(false);

// Initialize calendar data
onMounted(async () => {
  await init();
  isInitialized.value = true;
});

// Watch for roomId changes and reinitialize
watch(() => props.roomId, async (newRoomId, oldRoomId) => {
  if (newRoomId !== oldRoomId) {
    await init();
  }
}, { immediate: false });

// Get the status for a specific day
const getDayStatus = (date: Date): DateStatus => {
  return getDateStatus(date);
};

// Get booking for a specific day if it exists
const getDayBooking = (date: Date): Booking | undefined => {
  if (!isInitialized.value || !roomBookings.value) return undefined;
  
  return roomBookings.value.find(
    (booking) =>
      isSameDay(new Date(booking.checkIn), date) ||
      isSameDay(new Date(booking.checkOut), date) ||
      isDateBetween(date, new Date(booking.checkIn), new Date(booking.checkOut))
  );
};

// Calendar attributes for v-calendar
const calendarAttributes = computed(() => {
  if (!isInitialized.value) return [];
  
  const attributes = [];

  // Add attributes for each date status
  for (const booking of roomBookings.value) {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);
    
    // Check-in date (OPEN_CLOSE)
    attributes.push({
      dates: checkIn,
      class: "date-open-close",
    });

    // Check-out date (CLOSE_OPEN)
    attributes.push({
      dates: checkOut,
      class: "date-close-open",
    });

    // Dates between check-in and check-out (CLOSE)
    if (checkOut.getTime() - checkIn.getTime() > 86400000) {
      attributes.push({
        dates: {
          start: new Date(checkIn.getTime() + 86400000),
          end: new Date(checkOut.getTime() - 86400000),
        },
        class: "date-close",
      });
    }
  }

  // Add attributes for manually disabled dates
  for (const date of disabledDates.value) {
    attributes.push({
      dates: date,
      class: "date-close",
    });
  }

  // Add attributes for selected dates
  for (const date of selectedDatesInternal.value) {
    attributes.push({
      dates: date,
      class: "selected-date",
    });
  }

  return attributes;
});

// Handle day click
const onDayClick = (day: { date: Date }) => {
  if (props.mode === "admin") {
    // In admin mode, toggle date status
    toggleDateStatus(day.date);
    emit("dateStatusToggle", day.date);
  } else {
    // In booking mode, select/deselect date
    const index = selectedDatesInternal.value.findIndex((d) =>
      isSameDay(d, day.date)
    );

    if (index !== -1) {
      // Date is already selected, deselect it
      selectedDatesInternal.value.splice(index, 1);
    } else {
      // Date is not selected, select it
      selectedDatesInternal.value.push(day.date);
    }

    // Sort selected dates
    selectedDatesInternal.value.sort((a, b) => a.getTime() - b.getTime());

    // Emit selected dates
    emit("update:selectedDates", selectedDatesInternal.value);
  }
};

// Helper function to check if two dates are the same day
function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

// Helper function to check if a date is between two dates
function isDateBetween(date: Date, start: Date, end: Date): boolean {
  return date > start && date < end;
}
</script>

<style scoped>
.booking-calendar :deep(.vc-container) {
  --vc-accent-600: theme("colors.indigo.600");
  --vc-accent-500: theme("colors.indigo.500");
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
}

.booking-calendar :deep(.vc-day) {
  min-height: 40px;
  position: relative;
}

.booking-calendar :deep(.vc-day-content) {
  width: 100%;
  height: 100%;
}

.booking-calendar :deep(.selected-date) {
  background-color: rgba(79, 70, 229, 0.2);
  border: 2px solid #4f46e5;
}
</style>

