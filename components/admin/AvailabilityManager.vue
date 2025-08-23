<template>
  <div class="availability-manager">
    <div class="mb-6">
      <h2 class="text-lg font-semibold mb-2">Room Availability</h2>
      <p class="text-gray-600">
        Use the calendar below to manage room availability. Click on dates to
        toggle their status.
      </p>

      <div class="mt-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg
              class="h-5 w-5 text-yellow-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clip-rule="evenodd"
              />
            </svg>
          </div>
          <div class="ml-3">
            <h3 class="text-sm font-medium text-yellow-800">
              Date Status Legend
            </h3>
            <div class="mt-2 text-sm text-yellow-700">
              <ul class="list-disc pl-5 space-y-1">
                <li>
                  <span class="font-semibold">Green (OPEN):</span> Available for
                  booking
                </li>
                <li>
                  <span class="font-semibold">Red (CLOSE):</span> Not available
                  for booking
                </li>
                <li>
                  <span class="font-semibold">Yellow (OPEN_CLOSE):</span>
                  Check-in day (morning available, afternoon booked)
                </li>
                <li>
                  <span class="font-semibold">Blue (CLOSE_OPEN):</span>
                  Check-out day (morning booked, afternoon available)
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>

    <BookingCalendar
      :roomId="roomId"
      :title="calendarTitle"
      mode="admin"
      :show-booking-info="true"
      @dateStatusToggle="handleDateStatusToggle"
    />

    <div class="mt-6">
      <h3 class="text-md font-semibold mb-2">Upcoming Bookings</h3>
      <div v-if="roomBookings.length === 0" class="text-gray-500">
        No upcoming bookings for this room.
      </div>
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li
            v-for="booking in roomBookings"
            :key="booking.id"
            class="px-4 py-4 sm:px-6"
          >
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium text-indigo-600 truncate">
                  {{ booking.guestName }}
                </p>
                <p class="mt-1 text-sm text-gray-500">
                  {{ formatDate(booking.checkIn) }} to
                  {{ formatDate(booking.checkOut) }}
                </p>
              </div>
              <div class="ml-2 flex-shrink-0 flex">
                <p
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="bookingStatusClass(booking.status)"
                >
                  {{ booking.status }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";
import type { DateStatus } from "~/types";

const props = defineProps<{
  roomId: string;
  roomName?: string;
}>();

const { roomBookings, fetchBookings } = useBookings();

const calendarTitle = computed(() => {
  return props.roomName
    ? `${props.roomName} - Availability Calendar`
    : "Room Availability Calendar";
});

onMounted(async () => {
  await fetchBookings();
});

const handleDateStatusToggle = (date: Date) => {
  // This function is called when a date status is toggled in the calendar
  console.log("Date status toggled:", date);
  // In a real app, you would save this change to the backend
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const bookingStatusClass = (status: string): string => {
  switch (status) {
    case "confirmed":
      return "bg-green-100 text-green-800";
    case "pending":
      return "bg-yellow-100 text-yellow-800";
    case "cancelled":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};
</script>
