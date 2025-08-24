<template>
  <div>
    <div
      class="bg-white px-4 py-5 border-b border-gray-200 sm:px-6 flex justify-between items-center"
    >
      <h1 class="text-lg font-medium leading-6 text-gray-900">
        Rooms Management
      </h1>
      <button
        @click="showAddRoomForm = true"
        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Add Room
      </button>
    </div>

    <div v-if="loading" class="flex justify-center mt-8">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"
      ></div>
    </div>

    <div v-else-if="error" class="mt-8 bg-red-50 p-4 rounded-md">
      <div class="flex">
        <div class="flex-shrink-0">
          <svg
            class="h-5 w-5 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">{{ error }}</h3>
        </div>
      </div>
    </div>

    <div v-else-if="rooms.length === 0" class="mt-8 text-center text-gray-500">
      No rooms available. Click "Add Room" to create your first room.
    </div>

    <div v-else class="mt-8 flex flex-col">
      <div class="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
        <div class="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
          <div
            class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg"
          >
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Room
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Price
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Capacity
                  </th>
                  <th
                    scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Amenities
                  </th>
                  <th scope="col" class="relative px-6 py-3">
                    <span class="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="room in rooms" :key="room.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-10 w-10">
                        <img
                          v-if="room.images.length > 0"
                          class="h-10 w-10 rounded-full object-cover"
                          :src="room.images[0]"
                          alt=""
                        />
                        <div
                          v-else
                          class="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center"
                        >
                          <svg
                            class="h-6 w-6 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              stroke-linecap="round"
                              stroke-linejoin="round"
                              stroke-width="2"
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900">
                          {{ room.name }}
                        </div>
                        <div class="text-sm text-gray-500 truncate max-w-xs">
                          {{ room.description }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">${{ room.price }}</div>
                    <div class="text-sm text-gray-500">per night</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900">
                      {{ room.capacity }}
                      {{ room.capacity === 1 ? "guest" : "guests" }}
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div class="flex flex-wrap gap-1">
                      <span
                        v-for="(amenity, index) in room.amenities.slice(0, 3)"
                        :key="index"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {{ amenity }}
                      </span>
                      <span
                        v-if="room.amenities.length > 3"
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        +{{ room.amenities.length - 3 }} more
                      </span>
                    </div>
                  </td>
                  <td
                    class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                  >
                    <div class="flex space-x-2 justify-end">
                      <NuxtLink
                        :to="`/admin/calendar/${room.id}`"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Calendar
                      </NuxtLink>
                      <button
                        @click="editRoom(room)"
                        class="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit
                      </button>
                      <button
                        @click="confirmDeleteRoom(room)"
                        class="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- Add/Edit Room Modal -->
    <div
      v-if="showAddRoomForm || showEditRoomForm"
      class="fixed inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="closeRoomForm"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {{ showEditRoomForm ? "Edit Room" : "Add New Room" }}
                </h3>
                <div class="mt-4">
                  <RoomForm
                    :room="selectedRoom"
                    @submit="handleRoomFormSubmit"
                    @cancel="closeRoomForm"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div
      v-if="showDeleteConfirmation"
      class="fixed inset-0 overflow-y-auto"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0"
      >
        <div
          class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          @click="showDeleteConfirmation = false"
        ></div>
        <span
          class="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
          >&#8203;</span
        >
        <div
          class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
        >
          <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
              >
                <svg
                  class="h-6 w-6 text-red-600"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  class="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Delete Room
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">
                    Are you sure you want to delete the room "{{
                      selectedRoom?.name
                    }}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              @click="deleteRoom"
              class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Delete
            </button>
            <button
              type="button"
              @click="showDeleteConfirmation = false"
              class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { Room } from "~/types";

definePageMeta({
  layout: "admin",
});

const {
  rooms,
  loading,
  error,
  fetchRooms,
  addRoom,
  updateRoom,
  deleteRoom: removeRoom,
} = useRooms();

const showAddRoomForm = ref(false);
const showEditRoomForm = ref(false);
const showDeleteConfirmation = ref(false);
const selectedRoom = ref<Room | null>(null);

onMounted(async () => {
  await fetchRooms();
});

const editRoom = (room: Room) => {
  selectedRoom.value = { ...room };
  showEditRoomForm.value = true;
};

const confirmDeleteRoom = (room: Room) => {
  selectedRoom.value = room;
  showDeleteConfirmation.value = true;
};

const deleteRoom = () => {
  if (selectedRoom.value) {
    removeRoom(selectedRoom.value.id);
    showDeleteConfirmation.value = false;
    selectedRoom.value = null;
  }
};

const closeRoomForm = () => {
  showAddRoomForm.value = false;
  showEditRoomForm.value = false;
  selectedRoom.value = null;
};

const handleRoomFormSubmit = (roomData: Omit<Room, "id">) => {
  if (showEditRoomForm.value && selectedRoom.value) {
    // Update existing room
    updateRoom(selectedRoom.value.id, roomData);
  } else {
    // Add new room
    addRoom(roomData);
  }

  closeRoomForm();
};
</script>

