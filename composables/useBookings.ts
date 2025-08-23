import { ref, computed } from "vue";
import type { Booking, DateStatus } from "~/types";

export const useBookings = () => {
  const bookings = ref<Booking[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  // Mock data for development
  const initMockBookings = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const nextWeekPlusOne = new Date(nextWeek);
    nextWeekPlusOne.setDate(nextWeekPlusOne.getDate() + 1);

    bookings.value = [
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
  };

  const fetchBookings = async () => {
    loading.value = true;
    error.value = null;

    try {
      // In a real app, this would be an API call
      // For now, we'll use mock data
      initMockBookings();
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
    return newBooking;
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    const index = bookings.value.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      bookings.value[index] = { ...bookings.value[index], ...updates };
      return bookings.value[index];
    }
    return null;
  };

  const deleteBooking = (id: string) => {
    const index = bookings.value.findIndex((booking) => booking.id === id);
    if (index !== -1) {
      bookings.value.splice(index, 1);
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
