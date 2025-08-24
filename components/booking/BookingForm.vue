<template>
  <div class="booking-form">
    <div v-if="step === 1" class="date-selection">
      <h2 class="text-lg font-semibold mb-4">Select Your Dates</h2>

      <div class="mb-4">
        <p class="text-gray-600">
          Please select your check-in and check-out dates from the calendar
          below.
        </p>
      </div>

      <BookingCalendar
        :roomId="roomId"
        mode="booking"
        v-model:selectedDates="selectedDates"
        :min-date="today"
        title="Select Check-in and Check-out Dates"
      />

      <div
        v-if="selectedDates.length === 2"
        class="mt-6 bg-gray-50 p-4 rounded-md"
      >
        <div class="flex justify-between mb-2">
          <span class="font-medium">Check-in:</span>
          <span>{{ formatDate(selectedDates[0]) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Check-out:</span>
          <span>{{ formatDate(selectedDates[1]) }}</span>
        </div>
        <div class="flex justify-between mb-2">
          <span class="font-medium">Number of nights:</span>
          <span>{{ calculateNights() }}</span>
        </div>
        <div class="flex justify-between font-semibold">
          <span>Total price:</span>
          <span>${{ calculateTotalPrice() }}</span>
        </div>
      </div>

      <div class="mt-6 flex justify-end">
        <button
          @click="goToStep(2)"
          :disabled="selectedDates.length !== 2"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continue to Guest Information
        </button>
      </div>
    </div>

    <div v-if="step === 2" class="guest-information">
      <h2 class="text-lg font-semibold mb-4">Guest Information</h2>

      <form @submit.prevent="goToStep(3)" class="space-y-4">
        <div>
          <label for="guestName" class="block text-sm font-medium text-gray-700"
            >Full Name</label
          >
          <input
            type="text"
            id="guestName"
            v-model="guestInfo.name"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            for="guestEmail"
            class="block text-sm font-medium text-gray-700"
            >Email Address</label
          >
          <input
            type="email"
            id="guestEmail"
            v-model="guestInfo.email"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            for="guestPhone"
            class="block text-sm font-medium text-gray-700"
            >Phone Number</label
          >
          <input
            type="tel"
            id="guestPhone"
            v-model="guestInfo.phone"
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            for="specialRequests"
            class="block text-sm font-medium text-gray-700"
            >Special Requests (Optional)</label
          >
          <textarea
            id="specialRequests"
            v-model="guestInfo.specialRequests"
            rows="3"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div class="mt-6 flex justify-between">
          <button
            type="button"
            @click="goToStep(1)"
            class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Back to Dates
          </button>
          <button
            type="submit"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Continue to Review
          </button>
        </div>
      </form>
    </div>

    <div v-if="step === 3" class="booking-review">
      <h2 class="text-lg font-semibold mb-4">Review Your Booking</h2>

      <div class="bg-gray-50 p-4 rounded-md mb-6">
        <h3 class="font-medium text-gray-900 mb-2">Booking Details</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-500">Check-in:</div>
          <div>{{ formatDate(selectedDates[0]) }}</div>
          <div class="text-gray-500">Check-out:</div>
          <div>{{ formatDate(selectedDates[1]) }}</div>
          <div class="text-gray-500">Number of nights:</div>
          <div>{{ calculateNights() }}</div>
          <div class="text-gray-500">Total price:</div>
          <div class="font-semibold">${{ calculateTotalPrice() }}</div>
        </div>
      </div>

      <div class="bg-gray-50 p-4 rounded-md mb-6">
        <h3 class="font-medium text-gray-900 mb-2">Guest Information</h3>
        <div class="grid grid-cols-2 gap-2 text-sm">
          <div class="text-gray-500">Name:</div>
          <div>{{ guestInfo.name }}</div>
          <div class="text-gray-500">Email:</div>
          <div>{{ guestInfo.email }}</div>
          <div class="text-gray-500">Phone:</div>
          <div>{{ guestInfo.phone }}</div>
          <div v-if="guestInfo.specialRequests" class="text-gray-500">
            Special Requests:
          </div>
          <div v-if="guestInfo.specialRequests">
            {{ guestInfo.specialRequests }}
          </div>
        </div>
      </div>

      <div class="mt-6 flex justify-between">
        <button
          type="button"
          @click="goToStep(2)"
          class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Back to Guest Information
        </button>
        <button
          type="button"
          @click="confirmBooking"
          class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Confirm Booking
        </button>
      </div>
    </div>

    <div v-if="step === 4" class="booking-confirmation">
      <div class="text-center">
        <div
          class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100"
        >
          <svg
            class="h-6 w-6 text-green-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 class="mt-3 text-lg font-medium text-gray-900">
          Booking Confirmed!
        </h2>
        <p class="mt-2 text-sm text-gray-500">
          Thank you for your booking. We've sent a confirmation email to
          {{ guestInfo.email }}.
        </p>
        <div class="mt-6">
          <button
            type="button"
            @click="$emit('bookingComplete')"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Return to Room Details
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import type { Room } from "~/types";
import BookingCalendar from "../calendar/BookingCalendar.vue";

const props = defineProps<{
  roomId: string;
  room?: Room;
}>();

const emit = defineEmits<{
  (e: "bookingComplete"): void;
}>();

const { addBooking } = useBookings();

const step = ref(1);
const selectedDates = ref<Date[]>([]);
const today = new Date();

const guestInfo = ref({
  name: "",
  email: "",
  phone: "",
  specialRequests: "",
});

const roomPrice = computed(() => {
  return props.room?.price || 100; // Default price if room not provided
});

// Watch for changes in selectedDates
watch(selectedDates, (newDates) => {
  console.log('Selected dates changed:', newDates);
}, { deep: true });

const goToStep = (newStep: number) => {
  step.value = newStep;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateNights = (): number => {
  if (selectedDates.value.length !== 2) return 0;

  const checkIn = new Date(selectedDates.value[0]);
  const checkOut = new Date(selectedDates.value[1]);

  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

const calculateTotalPrice = (): number => {
  return calculateNights() * roomPrice.value;
};

const confirmBooking = () => {
  if (selectedDates.value.length !== 2) return;

  // Create a new booking
  const newBooking = {
    roomId: props.roomId,
    guestName: guestInfo.value.name,
    guestEmail: guestInfo.value.email,
    checkIn: selectedDates.value[0],
    checkOut: selectedDates.value[1],
    totalPrice: calculateTotalPrice(),
    status: "confirmed" as const,
  };

  // Add the booking
  addBooking(newBooking);

  // Move to confirmation step
  goToStep(4);
};
</script>

