<template>
  <form @submit.prevent="submitForm" class="space-y-6">
    <div>
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Room Name</label
      >
      <input
        type="text"
        id="name"
        v-model="form.name"
        required
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label for="description" class="block text-sm font-medium text-gray-700"
        >Description</label
      >
      <textarea
        id="description"
        v-model="form.description"
        rows="3"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      ></textarea>
    </div>

    <div>
      <label for="price" class="block text-sm font-medium text-gray-700"
        >Price per Night</label
      >
      <div class="mt-1 relative rounded-md shadow-sm">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <span class="text-gray-500 sm:text-sm">$</span>
        </div>
        <input
          type="number"
          id="price"
          v-model="form.price"
          required
          min="0"
          class="pl-7 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
        />
      </div>
    </div>

    <div>
      <label for="capacity" class="block text-sm font-medium text-gray-700"
        >Capacity</label
      >
      <input
        type="number"
        id="capacity"
        v-model="form.capacity"
        required
        min="1"
        class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Amenities</label>
      <div class="mt-2 space-y-2">
        <div
          v-for="(amenity, index) in amenities"
          :key="index"
          class="flex items-center"
        >
          <input
            type="checkbox"
            :id="'amenity-' + index"
            v-model="form.amenities"
            :value="amenity"
            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label
            :for="'amenity-' + index"
            class="ml-2 block text-sm text-gray-700"
            >{{ amenity }}</label
          >
        </div>
      </div>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Images</label>
      <div
        class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
      >
        <div class="space-y-1 text-center">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
            aria-hidden="true"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <div class="flex text-sm text-gray-600">
            <label
              for="file-upload"
              class="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
            >
              <span>Upload a file</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                class="sr-only"
                multiple
                @change="handleFileUpload"
              />
            </label>
            <p class="pl-1">or drag and drop</p>
          </div>
          <p class="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>
      <div v-if="form.images.length > 0" class="mt-4 grid grid-cols-3 gap-4">
        <div
          v-for="(image, index) in form.images"
          :key="index"
          class="relative"
        >
          <img
            :src="image"
            alt="Room image"
            class="h-24 w-full object-cover rounded-md"
          />
          <button
            type="button"
            @click="removeImage(index)"
            class="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div class="flex justify-end">
      <button
        type="button"
        @click="$emit('cancel')"
        class="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Save
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import type { Room } from "~/types";

const props = defineProps<{
  room?: Room;
}>();

const emit = defineEmits<{
  (e: "submit", room: Omit<Room, "id">): void;
  (e: "cancel"): void;
}>();

const amenities = [
  "Wi-Fi",
  "TV",
  "Air Conditioning",
  "Mini Bar",
  "Jacuzzi",
  "Kitchen",
  "Balcony",
  "Sea View",
  "Mountain View",
];

const form = reactive<Omit<Room, "id">>({
  name: "",
  description: "",
  price: 0,
  images: [],
  capacity: 1,
  amenities: [],
});

onMounted(() => {
  if (props.room) {
    form.name = props.room.name;
    form.description = props.room.description;
    form.price = props.room.price;
    form.images = [...props.room.images];
    form.capacity = props.room.capacity;
    form.amenities = [...props.room.amenities];
  }
});

const handleFileUpload = (event: Event) => {
  const input = event.target as HTMLInputElement;
  if (input.files) {
    for (let i = 0; i < input.files.length; i++) {
      const file = input.files[i];
      const reader = new FileReader();

      reader.onload = (e) => {
        if (e.target?.result) {
          form.images.push(e.target.result as string);
        }
      };

      reader.readAsDataURL(file);
    }
  }
};

const removeImage = (index: number) => {
  form.images.splice(index, 1);
};

const submitForm = () => {
  emit("submit", { ...form });
};
</script>
