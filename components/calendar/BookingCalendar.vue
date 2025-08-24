<template>
  <div class="booking-calendar">
    <div class="mb-4 flex justify-between items-center">
      <h2 class="text-lg font-semibold">{{ title }}</h2>
      <div class="flex space-x-2">
        <div class="flex items-center">
          <div class="w-4 h-4 bg-green-500 rounded-full mr-1"></div>
          <span class="text-sm">Available</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-red-500 rounded-full mr-1"></div>
          <span class="text-sm">Booked</span>
        </div>
        <div class="flex items-center">
          <div class="w-4 h-4 bg-orange-400 rounded-full mr-1"></div>
          <span class="text-sm">Check-in/out</span>
        </div>
      </div>
    </div>

    <v-calendar
      class="w-full"
      :attributes="calendarAttributes"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      @dayclick="onDayClick"
      :is-expanded="true"
      :is-range="true"
      :select-attribute="selectAttribute"
      :masks="{
        title: 'MMMM YYYY',
        weekdays: 'WWW',
        navMonths: 'MMM',
      }"
    />
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
watch(
  () => props.roomId,
  async (newRoomId, oldRoomId) => {
    if (newRoomId !== oldRoomId) {
      await init();
    }
  },
  { immediate: false }
);

// Watch for selectedDates prop changes
watch(
  () => props.selectedDates,
  (newDates) => {
    if (newDates) {
      selectedDatesInternal.value = [...newDates];
    }
  }
);

// Selection attribute for date range
const selectAttribute = computed(() => {
  if (selectedDatesInternal.value.length === 0) return null;

  if (selectedDatesInternal.value.length === 1) {
    return {
      key: "selection",
      dates: selectedDatesInternal.value[0],
      highlight: {
        backgroundColor: "#4f46e5",
        borderRadius: "0",
        borderWidth: "2px",
        borderColor: "#4f46e5",
      },
      contentStyle: {
        color: "white",
      },
    };
  }

  return {
    key: "selection",
    dates: {
      start: selectedDatesInternal.value[0],
      end: selectedDatesInternal.value[1],
    },
    highlight: {
      startStyle: {
        backgroundColor: "#4f46e5",
        borderRadius: "0",
      },
      endStyle: {
        backgroundColor: "#4f46e5",
        borderRadius: "0",
      },
      baseStyle: {
        backgroundColor: "rgba(79, 70, 229, 0.2)",
        borderRadius: "0",
      },
    },
    contentStyle: {
      color: "white",
    },
  };
});

// Calendar attributes for v-calendar
const calendarAttributes = computed(() => {
  if (!isInitialized.value) return [];

  const attributes = [];

  // Add attributes for each date status
  for (const booking of roomBookings.value) {
    const checkIn = new Date(booking.checkIn);
    const checkOut = new Date(booking.checkOut);

    // Check-in date (OPEN_CLOSE) and Check-out date (CLOSE_OPEN) - both orange
    attributes.push({
      key: `checkin-${booking.id}`,
      dates: checkIn,
      highlight: {
        backgroundColor: "#fb923c", // orange-400
        borderRadius: "0",
      },
      popover: {
        label: `Check-in: ${booking.guestName}`,
        visibility: props.showBookingInfo ? "hover" : "hidden",
      },
    });

    attributes.push({
      key: `checkout-${booking.id}`,
      dates: checkOut,
      highlight: {
        backgroundColor: "#fb923c", // orange-400
        borderRadius: "0",
      },
      popover: {
        label: `Check-out: ${booking.guestName}`,
        visibility: props.showBookingInfo ? "hover" : "hidden",
      },
    });

    // Dates between check-in and check-out (CLOSE) - red
    if (checkOut.getTime() - checkIn.getTime() > 86400000) {
      attributes.push({
        key: `booked-${booking.id}`,
        dates: {
          start: new Date(checkIn.getTime() + 86400000),
          end: new Date(checkOut.getTime() - 86400000),
        },
        highlight: {
          backgroundColor: "#ef4444", // red-500
          borderRadius: "0",
        },
        popover: {
          label: `Booked: ${booking.guestName}`,
          visibility: props.showBookingInfo ? "hover" : "hidden",
        },
      });
    }
  }

  // Add attributes for manually disabled dates - red
  for (const date of disabledDates.value) {
    attributes.push({
      key: `disabled-${date.getTime()}`,
      dates: date,
      highlight: {
        backgroundColor: "#ef4444", // red-500
        borderRadius: "0",
      },
      popover: {
        label: "Not available",
        visibility: "hover",
      },
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
      if (selectedDatesInternal.value.length >= 2) {
        // If already have 2 dates, reset selection
        selectedDatesInternal.value = [day.date];
      } else {
        // Add to selection
        selectedDatesInternal.value.push(day.date);
      }
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
  border-radius: 0.5rem;
  border: 1px solid #e5e7eb;
  width: 100%;
}

.booking-calendar :deep(.vc-day) {
  min-height: 40px;
  position: relative;
}

.booking-calendar :deep(.vc-day-content) {
  width: 100%;
  height: 100%;
}
</style>
