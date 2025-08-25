import { ref, computed } from "vue";
import type { Booking } from "~/types";

export const useBookings = () => {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const storage = useStorage();
  const STORAGE_KEY = 'guesthouse_bookings';

  // Initialize with default bookings if none exist in storage
  const initDefaultBookings = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextWeekPlusOne = new Date(nextWeek);
    nextWeekPlusOne.setDate(nextWeekPlusOne.getDate() + 1);

    const defaultBookings: Booking[] = [
      {
        id: "1",
        roomId: "1",
        guestName: "John Doe",
        guestEmail: "john@example.com",
        checkIn: tomorrow,
        checkOut: nextWeek,
        totalPrice: 1050,
        status: "confirmed",
        createdAt: today,
      },
      {
        id: "2",
        roomId: "2",
        guestName: "Jane Smith",
        guestEmail: "jane@example.com",
        checkIn: nextWeek,
        checkOut: nextWeekPlusOne,
        totalPrice: 250,
        status: "confirmed",
        createdAt: today,
      },
    ];
    
    return defaultBookings;
  };

  // Helper function to convert date strings back to Date objects
  const parseDates = (bookingsData: any[]): Booking[] => {
    return bookingsData.map(booking => ({
      ...booking,
      checkIn: new Date(booking.checkIn),
      checkOut: new Date(booking.checkOut),
      createdAt: new Date(booking.createdAt)
    }));
  };

  // Save bookings to localStorage
  const saveBookings = () => {
    // Make sure we're saving the full array of bookings, not replacing it
    storage.setItem(STORAGE_KEY, bookings.value);
  };

  const fetchBookings = async () => {
    loading.value = true;
    error.value = null;

    try {
      // Get bookings from localStorage or use default if none exist
      const storedBookings = storage.getItem<any[]>(STORAGE_KEY, []);
      
      if (storedBookings.length === 0) {
        // Initialize with default bookings if storage is empty
        bookings.value = initDefaultBookings();
        saveBookings(); // Save default bookings to storage
      } else {
        // Parse dates from stored bookings
        bookings.value = parseDates(storedBookings);
      }
    } catch (err) {
      error.value = "Failed to fetch bookings";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const getBookingsByRoom = (roomId: string) => {
    return computed(() =>
      bookings.value.filter((booking) => booking.roomId === roomId)
    );
  };

  const addBooking = (booking: Omit<Booking, "id" | "createdAt">) => {
    const newBooking: Booking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date(),
    };
    bookings.value.push(newBooking);
    saveBookings(); // Save to localStorage
    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const index = bookings.value.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      bookings.value[index] = { ...bookings.value[index], ...updates };
      saveBookings(); // Save to localStorage
      return bookings.value[index];
    }
    return null;
  };

  const deleteBooking = (id: string) => {
    const index = bookings.value.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      bookings.value.splice(index, 1);
      saveBookings(); // Save to localStorage
      return true;
    }
    return false;
  };

  return {
    bookings,
    loading,
    error,
    fetchBookings,
    getBookingsByRoom,
    addBooking,
    updateBooking,
    deleteBooking,
  };
};
