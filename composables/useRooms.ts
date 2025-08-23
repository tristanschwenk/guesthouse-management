import { ref, computed } from 'vue'
import { Room } from '~/types'

export const useRooms = () => {
  const rooms = ref<Room[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Mock data for development
  const initMockRooms = () => {
    rooms.value = [
      {
        id: '1',
        name: 'Deluxe Room',
        description: 'A spacious room with a king-size bed and a beautiful view.',
        price: 150,
        images: ['/images/room1.jpg'],
        capacity: 2,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar']
      },
      {
        id: '2',
        name: 'Suite',
        description: 'A luxurious suite with a separate living area and a jacuzzi.',
        price: 250,
        images: ['/images/room2.jpg'],
        capacity: 4,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar', 'Jacuzzi']
      },
      {
        id: '3',
        name: 'Family Room',
        description: 'A comfortable room for families with two queen-size beds.',
        price: 200,
        images: ['/images/room3.jpg'],
        capacity: 4,
        amenities: ['Wi-Fi', 'TV', 'Air Conditioning', 'Mini Bar']
      }
    ]
  }

  const fetchRooms = async () => {
    loading.value = true
    error.value = null
    
    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      initMockRooms()
    } catch (err) {
      error.value = 'Failed to fetch rooms'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const getRoom = (id: string) => {
    return computed(() => rooms.value.find(room => room.id === id))
  }

  const addRoom = (room: Omit<Room, 'id'>) => {
    const newRoom: Room = {
      ...room,
      id: Date.now().toString()
    }
    rooms.value.push(newRoom)
    return newRoom
  }

  const updateRoom = (id: string, updates: Partial<Room>) => {
    const index = rooms.value.findIndex(room => room.id === id)
    if (index !== -1) {
      rooms.value[index] = { ...rooms.value[index], ...updates }
      return rooms.value[index]
    }
    return null
  }

  const deleteRoom = (id: string) => {
    const index = rooms.value.findIndex(room => room.id === id)
    if (index !== -1) {
      rooms.value.splice(index, 1)
      return true
    }
    return false
  }

  return {
    rooms,
    loading,
    error,
    fetchRooms,
    getRoom,
    addRoom,
    updateRoom,
    deleteRoom
  }
}

