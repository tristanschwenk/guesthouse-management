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
    emit("update:selectedDates", [value.start, value.end]);
  }
}

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
</script>


