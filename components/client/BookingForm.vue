<template>
  <div class="booking-form">
    <h2 class="text-2xl font-bold mb-4">Book Your Stay</h2>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 class="text-lg font-semibold mb-2">Select Dates</h3>
        <ClientBookingCalendar 
          :bookings="roomBookings"
          @bookingPrepared="handleBookingPrepared"
        />
      </div>
      
      <div v-if="selectedDateRange">
        <h3 class="text-lg font-semibold mb-2">Booking Details</h3>
        <div class="bg-white shadow rounded-lg p-6">
          <div class="mb-4">
            <p class="text-gray-700 font-medium">Selected Dates:</p>
            <p class="text-indigo-600">
              {{ formatDate(selectedDateRange.startDate) }} to {{ formatDate(selectedDateRange.endDate) }}
            </p>
            <p class="text-sm text-gray-500">{{ calculateNights() }} nights</p>
          </div>
          
          <form @submit.prevent="submitBooking" class="space-y-4">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                id="name"
                v-model="bookingForm.name"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                v-model="bookingForm.email"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone"
                v-model="bookingForm.phone"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label for="guests" class="block text-sm font-medium text-gray-700">Number of Guests</label>
              <select
                id="guests"
                v-model="bookingForm.guests"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                required
              >
                <option v-for="i in 4" :key="i" :value="i">{{ i }}</option>
              </select>
            </div>
            
            <div>
              <label for="notes" class="block text-sm font-medium text-gray-700">Special Requests</label>
              <textarea
                id="notes"
                v-model="bookingForm.notes"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              ></textarea>
            </div>
            
            <div class="pt-4">
              <button
                type="submit"
                class="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Complete Booking
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import ClientBookingCalendar from './calendar/ClientBookingCalendar.vue';
import { useBookings } from '~/composables/useBookings';

const props = defineProps<{
  roomId: string;
}>();

const emit = defineEmits(['bookingSubmitted']);

const { bookings } = useBookings();

const roomBookings = computed(() => {
  return bookings.value.filter(booking => booking.roomId.toString() === props.roomId);
});

const selectedDateRange = ref<{ startDate: Date, endDate: Date } | null>(null);

const bookingForm = ref({
  name: '',
  email: '',
  phone: '',
  guests: 1,
  notes: ''
});

const handleBookingPrepared = (dateRange: { startDate: Date, endDate: Date }) => {
  selectedDateRange.value = dateRange;
};

const calculateNights = (): number => {
  if (!selectedDateRange.value) return 0;

  const start = new Date(selectedDateRange.value.startDate);
  const end = new Date(selectedDateRange.value.endDate);

  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const submitBooking = () => {
  if (!selectedDateRange.value) return;
  
  const bookingData = {
    roomId: parseInt(props.roomId),
    guestName: bookingForm.value.name,
    email: bookingForm.value.email,
    phone: bookingForm.value.phone,
    guests: bookingForm.value.guests,
    notes: bookingForm.value.notes,
    checkIn: selectedDateRange.value.startDate,
    checkOut: selectedDateRange.value.endDate,
    status: 'pending'
  };
  
  emit('bookingSubmitted', bookingData);
  
  // Reset form
  bookingForm.value = {
    name: '',
    email: '',
    phone: '',
    guests: 1,
    notes: ''
  };
  
  selectedDateRange.value = null;
};
</script>

