<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <h1 class="text-lg font-medium leading-6 text-gray-900">Bookings</h1>
      <button @click="openBookingModal()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Booking
      </button>
    </div>

    <!-- Booking List -->
    <div class="mt-6">
      <div v-if="loading" class="text-center py-4">
        <p class="text-gray-500">Loading bookings...</p>
      </div>
      <div v-else-if="bookings.length === 0" class="text-center py-4">
        <p class="text-gray-500">No bookings found. Add your first booking to get started.</p>
      </div>
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="booking in bookings" :key="booking.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" @click="openBookingModal(booking)">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-indigo-600 truncate">
                {{ booking.guestName }}
              </div>
              <div class="ml-2 flex-shrink-0 flex">
                <p class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="bookingStatusClass(booking.status)">
                  {{ booking.status }}
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
                  </svg>
                  {{ getRoomName(booking.roomId) }}
                </p>
                <p v-if="booking.customerId" class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  {{ getCustomerName(booking.customerId) }}
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <p>
                  {{ formatDate(booking.checkIn) }} - {{ formatDate(booking.checkOut) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Booking Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ editingBooking ? 'Edit Booking' : 'Add New Booking' }}
              </h3>
              <div class="mt-4">
                <form @submit.prevent="saveBooking">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label for="guestName" class="block text-sm font-medium text-gray-700">Guest Name</label>
                      <div class="mt-1">
                        <input type="text" id="guestName" v-model="bookingForm.guestName" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="guestEmail" class="block text-sm font-medium text-gray-700">Guest Email</label>
                      <div class="mt-1">
                        <input type="email" id="guestEmail" v-model="bookingForm.guestEmail" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="roomId" class="block text-sm font-medium text-gray-700">Room</label>
                      <div class="mt-1">
                        <select id="roomId" v-model="bookingForm.roomId" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                          <option value="" disabled>Select a room</option>
                          <option v-for="room in rooms" :key="room.id" :value="room.id">{{ room.name }} - ${{ room.price }}/night</option>
                        </select>
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="customerId" class="block text-sm font-medium text-gray-700">Customer (Optional)</label>
                      <div class="mt-1">
                        <select id="customerId" v-model="bookingForm.customerId" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                          <option value="">No customer</option>
                          <option v-for="customer in customers" :key="customer.id" :value="customer.id">{{ customer.name }} {{ customer.company ? `(${customer.company})` : '' }}</option>
                        </select>
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="checkIn" class="block text-sm font-medium text-gray-700">Check-in Date</label>
                      <div class="mt-1">
                        <input type="date" id="checkIn" v-model="bookingForm.checkIn" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="checkOut" class="block text-sm font-medium text-gray-700">Check-out Date</label>
                      <div class="mt-1">
                        <input type="date" id="checkOut" v-model="bookingForm.checkOut" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="totalPrice" class="block text-sm font-medium text-gray-700">Total Price</label>
                      <div class="mt-1">
                        <input type="number" id="totalPrice" v-model="bookingForm.totalPrice" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="status" class="block text-sm font-medium text-gray-700">Status</label>
                      <div class="mt-1">
                        <select id="status" v-model="bookingForm.status" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                      {{ editingBooking ? 'Update' : 'Create' }}
                    </button>
                    <button type="button" @click="showModal = false" class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { Booking } from '~/types'

definePageMeta({
  layout: 'admin'
})

const { rooms, fetchRooms } = useRooms()
const { bookings, loading, fetchBookings, addBooking, updateBooking } = useBookings()
const { customers, fetchCustomers } = useCustomers()

onMounted(async () => {
  await Promise.all([fetchRooms(), fetchBookings(), fetchCustomers()])
})

const showModal = ref(false)
const editingBooking = ref<Booking | null>(null)
const bookingForm = reactive({
  roomId: '',
  customerId: '',
  guestName: '',
  guestEmail: '',
  checkIn: '',
  checkOut: '',
  totalPrice: 0,
  status: 'pending'
})

const openBookingModal = (booking?: Booking) => {
  if (booking) {
    editingBooking.value = booking
    bookingForm.roomId = booking.roomId
    bookingForm.customerId = booking.customerId || ''
    bookingForm.guestName = booking.guestName
    bookingForm.guestEmail = booking.guestEmail
    bookingForm.checkIn = formatDateForInput(booking.checkIn)
    bookingForm.checkOut = formatDateForInput(booking.checkOut)
    bookingForm.totalPrice = booking.totalPrice
    bookingForm.status = booking.status
  } else {
    editingBooking.value = null
    bookingForm.roomId = ''
    bookingForm.customerId = ''
    bookingForm.guestName = ''
    bookingForm.guestEmail = ''
    bookingForm.checkIn = ''
    bookingForm.checkOut = ''
    bookingForm.totalPrice = 0
    bookingForm.status = 'pending'
  }
  showModal.value = true
}

const saveBooking = () => {
  const bookingData = {
    roomId: bookingForm.roomId,
    customerId: bookingForm.customerId || undefined,
    guestName: bookingForm.guestName,
    guestEmail: bookingForm.guestEmail,
    checkIn: new Date(bookingForm.checkIn),
    checkOut: new Date(bookingForm.checkOut),
    totalPrice: bookingForm.totalPrice,
    status: bookingForm.status as 'confirmed' | 'pending' | 'cancelled'
  }

  if (editingBooking.value) {
    updateBooking(editingBooking.value.id, bookingData)
  } else {
    addBooking(bookingData)
  }
  showModal.value = false
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const formatDateForInput = (date: Date): string => {
  const d = new Date(date)
  let month = '' + (d.getMonth() + 1)
  let day = '' + d.getDate()
  const year = d.getFullYear()

  if (month.length < 2) month = '0' + month
  if (day.length < 2) day = '0' + day

  return [year, month, day].join('-')
}

const getRoomName = (roomId: string): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Room'
}

const getCustomerName = (customerId: string): string => {
  const customer = customers.value.find(c => c.id === customerId)
  return customer ? customer.name : 'Unknown Customer'
}

const bookingStatusClass = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'bg-green-100 text-green-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
</script>

