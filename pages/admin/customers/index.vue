<template>
  <div>
    <div class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center">
      <h1 class="text-lg font-medium leading-6 text-gray-900">Customers</h1>
      <button @click="openCustomerModal()" class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
        Add Customer
      </button>
    </div>

    <!-- Customer List -->
    <div class="mt-6">
      <div v-if="loading" class="text-center py-4">
        <p class="text-gray-500">Loading customers...</p>
      </div>
      <div v-else-if="customers.length === 0" class="text-center py-4">
        <p class="text-gray-500">No customers found. Add your first customer to get started.</p>
      </div>
      <div v-else class="bg-white shadow overflow-hidden sm:rounded-md">
        <ul class="divide-y divide-gray-200">
          <li v-for="customer in customers" :key="customer.id" class="px-4 py-4 sm:px-6 hover:bg-gray-50 cursor-pointer" @click="navigateToCustomer(customer.id)">
            <div class="flex items-center justify-between">
              <div class="text-sm font-medium text-indigo-600 truncate">
                {{ customer.name }}
              </div>
              <div class="ml-2 flex-shrink-0 flex">
                <p v-if="customer.company" class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  {{ customer.company }}
                </p>
              </div>
            </div>
            <div class="mt-2 sm:flex sm:justify-between">
              <div class="sm:flex">
                <p class="flex items-center text-sm text-gray-500">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  {{ customer.email }}
                </p>
                <p v-if="customer.phone" class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                  <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  {{ customer.phone }}
                </p>
              </div>
              <div class="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                <svg class="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd" />
                </svg>
                <p>
                  Added {{ formatDate(customer.createdAt) }}
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Customer Modal -->
    <div v-if="showModal" class="fixed z-10 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" @click="showModal = false"></div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
        <div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div>
            <div class="mt-3 text-center sm:mt-0 sm:text-left">
              <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                {{ editingCustomer ? 'Edit Customer' : 'Add New Customer' }}
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
                      {{ editingCustomer ? 'Update' : 'Create' }}
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
import type { Customer } from '~/types'

definePageMeta({
  layout: 'admin'
})

const { customers, loading, fetchCustomers, addCustomer, updateCustomer } = useCustomers()

onMounted(async () => {
  await fetchCustomers()
})

const showModal = ref(false)
const editingCustomer = ref<Customer | null>(null)
const customerForm = reactive({
  name: '',
  email: '',
  phone: '',
  address: '',
  company: '',
  notes: ''
})

const openCustomerModal = (customer?: Customer) => {
  if (customer) {
    editingCustomer.value = customer
    customerForm.name = customer.name
    customerForm.email = customer.email
    customerForm.phone = customer.phone || ''
    customerForm.address = customer.address || ''
    customerForm.company = customer.company || ''
    customerForm.notes = customer.notes || ''
  } else {
    editingCustomer.value = null
    customerForm.name = ''
    customerForm.email = ''
    customerForm.phone = ''
    customerForm.address = ''
    customerForm.company = ''
    customerForm.notes = ''
  }
  showModal.value = true
}

const navigateToCustomer = (id: string) => {
  navigateTo(`/admin/customers/${id}`)
}

const saveCustomer = () => {
  if (editingCustomer.value) {
    updateCustomer(editingCustomer.value.id, {
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone || undefined,
      address: customerForm.address || undefined,
      company: customerForm.company || undefined,
      notes: customerForm.notes || undefined
    })
  } else {
    addCustomer({
      name: customerForm.name,
      email: customerForm.email,
      phone: customerForm.phone || undefined,
      address: customerForm.address || undefined,
      company: customerForm.company || undefined,
      notes: customerForm.notes || undefined
    })
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
</script>
