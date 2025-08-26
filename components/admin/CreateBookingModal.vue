<template>
  <div v-if="isOpen" class="fixed inset-0 z-10 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div
        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
              <h3 class="text-lg leading-6 font-medium text-gray-900">
                Create External Booking
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500 mb-4">
                  Create a booking from an external source for
                  {{ formatDateRange(selectedDates) }}
                </p>

                <form @submit.prevent="handleSubmit" class="space-y-4">
                  <div>
                    <label for="guestName" class="block text-sm font-medium text-gray-700">Guest Name</label>
                    <input
                      type="text"
                      id="guestName"
                      v-model="formData.guestName"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label for="guestEmail" class="block text-sm font-medium text-gray-700">Guest Email</label>
                    <input
                      type="email"
                      id="guestEmail"
                      v-model="formData.guestEmail"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>

                  <div>
                    <label for="source" class="block text-sm font-medium text-gray-700">Source</label>
                    <select
                      id="source"
                      v-model="formData.source"
                      required
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    >
                      <option value="booking.com">Booking.com</option>
                      <option value="autre">Autre</option>
                      <option value="disabled">Disabled date</option>
                    </select>
                  </div>

                  <div v-if="formData.source === 'autre'">
                    <label for="sourceDetails" class="block text-sm font-medium text-gray-700">Source Details</label>
                    <input
                      type="text"
                      id="sourceDetails"
                      v-model="formData.sourceDetails"
                      class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            @click="handleSubmit"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Create Booking
          </button>
          <button
            type="button"
            @click="closeModal"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits, watch } from 'vue';
import type { Booking } from '~/types';

const props = defineProps<{
  isOpen: boolean;
  roomId: string;
  selectedDates: Date[];
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', booking: Partial<Booking> & { source: string, sourceDetails?: string }): void;
}>();

const formData = ref({
  guestName: '',
  guestEmail: '',
  source: 'booking.com',
  sourceDetails: '',
});

// Reset form when modal opens
watch(() => props.isOpen, (isOpen) => {
  if (isOpen) {
    formData.value = {
      guestName: '',
      guestEmail: '',
      source: 'booking.com',
      sourceDetails: '',
    };
  }
});

const closeModal = () => {
  emit('close');
};

const handleSubmit = () => {
  if (!formData.value.guestName || !formData.value.guestEmail || !formData.value.source) {
    return;
  }

  if (props.selectedDates.length !== 2) {
    return;
  }

  const bookingData = {
    roomId: props.roomId,
    guestName: formData.value.guestName,
    guestEmail: formData.value.guestEmail,
    checkIn: props.selectedDates[0],
    checkOut: props.selectedDates[1],
    status: 'confirmed' as const,
    source: formData.value.source,
    sourceDetails: formData.value.source === 'autre' ? formData.value.sourceDetails : undefined,
  };

  emit('submit', bookingData);
  closeModal();
};

const formatDateRange = (dates: Date[]): string => {
  if (dates.length !== 2) return '';
  
  return `${formatDate(dates[0])} to ${formatDate(dates[1])}`;
};

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};
</script>
