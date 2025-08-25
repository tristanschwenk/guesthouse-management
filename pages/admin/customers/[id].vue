<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <div>
        <h1 class="text-lg font-medium leading-6 text-gray-900">Customer Details</h1>
        <p class="mt-1 text-sm text-gray-500">
          View and manage customer information
        </p>
      </div>
      <div class="flex space-x-3">
        <NuxtLink to="/admin/customers" class="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Back to Customers
        </NuxtLink>
        <button @click="openCustomerModal()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Edit Customer
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-center py-10">
      <p class="text-gray-500">Loading customer information...</p>
    </div>
    <div v-else-if="!customer" class="text-center py-10">
      <p class="text-gray-500">Customer not found.</p>
    </div>
    <div v-else class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <!-- Customer Information -->
      <div class="lg:col-span-1">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Customer Information</h3>
          </div>
          <div class="border-t border-gray-200 px-4 py-5 sm:p-0">
            <dl class="sm:divide-y sm:divide-gray-200">
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Full name</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.name }}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Email address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.email }}</dd>
              </div>
              <div v-if="customer.phone" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Phone number</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.phone }}</dd>
              </div>
              <div v-if="customer.company" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Company</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.company }}</dd>
              </div>
              <div v-if="customer.address" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Address</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.address }}</dd>
              </div>
              <div class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Created on</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ formatDate(customer.createdAt) }}</dd>
              </div>
              <div v-if="customer.notes" class="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt class="text-sm font-medium text-gray-500">Notes</dt>
                <dd class="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{{ customer.notes }}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      <!-- Customer Bookings -->
      <div class="lg:col-span-2">
        <div class="bg-white shadow overflow-hidden sm:rounded-lg">
          <div class="px-4 py-5 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg leading-6 font-medium text-gray-900">Customer Bookings</h3>
            <NuxtLink to="/admin/bookings" class="text-sm font-medium text-indigo-600 hover:text-indigo-500">
              View All Bookings
            </NuxtLink>
          </div>
          <div class="border-t border-gray-200">
            <div v-if="customerBookings.length === 0" class="text-center py-6">
              <p class="text-gray-500">No bookings found for this customer.</p>
              <NuxtLink to="/admin/bookings" class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Create Booking
              </NuxtLink>
            </div>
            <ul v-else class="divide-y divide-gray-200">
              <li v-for="booking in customerBookings" :key="booking.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50">
                <div class="flex items-center justify-between">
                  <div class="text-sm font-medium text-indigo-600 truncate">
                    {{ getRoomName(booking.roomId) }}
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
                      {{ booking.guestName }}
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
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    <span class="font-medium">Total:</span> ${{ booking.totalPrice }}
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>

    <!-- Customer Edit Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                Edit Customer
              </h3>
              <div class="mt-4">
                <form @submit.prevent="saveCustomer">
                  <div class="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                    <div class="sm:col-span-3">
                      <label for="name" class="block text-sm font-medium text-gray-700">Name</label>
                      <div class="mt-1">
                        <input type="text" id="name" v-model="customerForm.name" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
                      <div class="mt-1">
                        <input type="email" id="email" v-model="customerForm.email" required class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="phone" class="block text-sm font-medium text-gray-700">Phone</label>
                      <div class="mt-1">
                        <input type="text" id="phone" v-model="customerForm.phone" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-3">
                      <label for="company" class="block text-sm font-medium text-gray-700">Company</label>
                      <div class="mt-1">
                        <input type="text" id="company" v-model="customerForm.company" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-6">
                      <label for="address" class="block text-sm font-medium text-gray-700">Address</label>
                      <div class="mt-1">
                        <input type="text" id="address" v-model="customerForm.address" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md">
                      </div>
                    </div>

                    <div class="sm:col-span-6">
                      <label for="notes" class="block text-sm font-medium text-gray-700">Notes</label>
                      <div class="mt-1">
                        <textarea id="notes" v-model="customerForm.notes" rows="3" class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"></textarea>
                      </div>
                    </div>
                  </div>

                  <div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button type="submit" class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm">
                      Update
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
import { ref, reactive, computed, onMounted } from 'vue'
import type { Customer } from '~/types'

definePageMeta({
  layout: 'admin'
})

const route = useRoute()
const customerId = route.params.id as string

const { customers, loading, fetchCustomers, updateCustomer } = useCustomers()
const { rooms, fetchRooms } = useRooms()
const { bookings, fetchBookings } = useBookings()

onMounted(async () => {
  await Promise.all([fetchCustomers(), fetchRooms(), fetchBookings()])
})

const customer = computed(() => {
  return customers.value.find(c => c.id === customerId)
})

const customerBookings = computed(() => {
  return bookings.value.filter(booking => booking.customerId === customerId)
})

const showModal = ref(false)
const customerForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  company: '',
  notes: ''
})

const openCustomerModal = () => {
  if (customer.value) {
    customerForm.name = customer.value.name
    customerForm.email = customer.value.email
    customerForm.phone = customer.value.phone || ''
    customerForm.address = customer.value.address || ''
    customerForm.company = customer.value.company || ''
    customerForm.notes = customer.value.notes || ''
    showModal.value = true
  }
}

const saveCustomer = () => {
  if (customer.value) {
    updateCustomer(customer.value.id, {
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone || undefined,
      address: customerForm.address || undefined,
      company: customerForm.company || undefined,
      notes: customerForm.notes || undefined
    })
    showModal.value = false
  }
}

const formatDate = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const getRoomName = (roomId: string): string => {
  const room = rooms.value.find(r => r.id === roomId)
  return room ? room.name : 'Unknown Room'
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

