import { ref, computed } from "vue";
import type { Room } from "~/types";

export const useRooms = () => {
  const rooms = ref<Room[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const storage = useStorage();
  const STORAGE_KEY = 'guesthouse_rooms';

  // Initialize with default rooms if none exist in storage
  const initDefaultRooms = () => {
    const defaultRooms: Room[] = [
      {
        id: "1",
        name: "Deluxe Room",
        description:
          "A spacious room with a king-size bed and a beautiful view.",
        price: 150,
        images: ["/images/room1.jpg"],
        capacity: 2,
        amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
      },
      {
        id: "2",
        name: "Suite",
        description:
          "A luxurious suite with a separate living area and a jacuzzi.",
        price: 250,
        images: ["/images/room2.jpg"],
        capacity: 4,
        amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi"],
      },
      {
        id: "3",
        name: "Family Room",
        description:
          "A comfortable room for families with two queen-size beds.",
        price: 200,
        images: ["/images/room3.jpg"],
        capacity: 4,
        amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
      },
    ];
    
    return defaultRooms;
  };

  // Save rooms to localStorage
  const saveRooms = () => {
    storage.setItem(STORAGE_KEY, rooms.value);
  };

  const fetchRooms = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Get rooms from localStorage or use default if none exist
      const storedRooms = storage.getItem<Room[]>(STORAGE_KEY, []);
      
      if (storedRooms.length === 0) {
        // Initialize with default rooms if storage is empty
        rooms.value = initDefaultRooms();
        saveRooms(); // Save default rooms to storage
      } else {
        rooms.value = storedRooms;
      }
    } catch (err) {
      error.value = "Failed to fetch rooms";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getRoom = (id: string) => {
    return computed(() => rooms.value.find((room) => room.id === id));
  };

  const addRoom = (room: Omit<Room, "id">) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString(),
    };
    rooms.value.push(newRoom);
    saveRooms(); // Save to localStorage
    return newRoom;
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    const index = rooms.value.findIndex((room) => room.id === id);
    if (index !== -1) {
      rooms.value[index] = { ...rooms.value[index], ...updates };
      saveRooms(); // Save to localStorage
      return rooms.value[index];
    }
    return null;
  };

  const deleteRoom = (id: string) => {
    const index = rooms.value.findIndex((room) => room.id === id);
    if (index !== -1) {
      rooms.value.splice(index, 1);
      saveRooms(); // Save to localStorage
      return true;
    }
    return false;
  };

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    getRoom,
    addRoom,
    updateRoom,
    deleteRoom,
  };
};

