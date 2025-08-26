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

    <DatePicker
      class="w-full"
      :columns="2"
      :min-date="minDate"
      :max-date="maxDate"
      :disabled-dates="disabledDates"
      :model-modifiers="{ range: true }"
      :model-value="dateRange"
      @update:model-value="updateValue"
      mode="range"
    
    />
  </div>
</template>

<script setup lang="ts">
import { DatePicker } from "v-calendar";
import { ref, computed, onMounted, watch, inject, type Ref } from "vue";
import type { DateStatus, Booking } from "~/types";
import { DateStatus as DateStatusEnum } from "~/types";

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
const dateRange = ref<{ start: Date; end: Date } | null>(null);

const updateValue = (value: { start: Date; end: Date } | null) => {
  console.log(value);
  if (value) {
    dateRange.value = value;
  }
}


watchEffect(() => {
    if (dateRange.value) {
      console.log(dateRange.value);
    }
  })

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

// Handle day click
const onDayClick = (day: { date: Date }) => {
  // Check if the date is disabled (booked or manually disabled)
  const dateStatus = getDateStatus(day.date);
  if (dateStatus === DateStatusEnum.CLOSE) {
    // Don't allow selection of disabled dates
    return;
  }

  if (props.mode === "admin") {
    // Check if we're in selection mode
    // Use a default value of false if the injection key is not provided
    const parentSelectionMode = inject<Ref<boolean>>('selectionMode', null);
    const isSelectionMode = parentSelectionMode ? parentSelectionMode.value : false;
    
    if (isSelectionMode) {
      // In selection mode, select/deselect date
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
    } else {
      // In toggle mode, toggle date status
      toggleDateStatus(day.date);
      emit("dateStatusToggle", day.date);
    }
  } else {
    // In booking mode (client), select/deselect date
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


