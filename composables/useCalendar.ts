import { ref, computed } from "vue";
import type { Booking, CalendarDay } from "~/types";
import { DateStatus } from "~/types";

export const useCalendar = (roomId: string) => {
  const { bookings, fetchBookings, getBookingsByRoom } = useBookings();
  const disabledDates = ref<Date[]>([]);
  const roomBookings = computed(() => getBookingsByRoom(roomId).value);

  // Initialize with some mock disabled dates
  const initMockDisabledDates = () => {
    const today = new Date();

    // Disable some random dates
    for (let i = 0; i < 5; i++) {
      const randomDays = Math.floor(Math.random() * 30) + 1;
      const date = new Date(today);
      date.setDate(date.getDate() + randomDays);
      disabledDates.value.push(date);
    }
  };

  // Get the status of a specific date
  const getDateStatus = (date: Date): DateStatus => {
    // Check if date is manually disabled
    if (disabledDates.value.some((d) => isSameDay(d, date))) {
      return DateStatus.CLOSE;
    }

    // Check if date is part of a booking
    for (const booking of roomBookings.value) {
      // Check if it's the check-in date (OPEN_CLOSE)
      if (isSameDay(booking.checkIn, date)) {
        return DateStatus.OPEN_CLOSE;
      }

      // Check if it's the check-out date (CLOSE_OPEN)
      if (isSameDay(booking.checkOut, date)) {
        return DateStatus.CLOSE_OPEN;
      }

      // Check if it's between check-in and check-out (CLOSE)
      if (isDateBetween(date, booking.checkIn, booking.checkOut)) {
        return DateStatus.CLOSE;
      }
    }

    // If not disabled or part of a booking, it's available (OPEN)
    return DateStatus.OPEN;
  };

  // Get calendar days for a specific month
  const getCalendarDays = (month: number, year: number): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const status = getDateStatus(date);

      // Find booking for this date if it exists
      const booking = roomBookings.value.find(
        (b) =>
          isSameDay(b.checkIn, date) ||
          isSameDay(b.checkOut, date) ||
          isDateBetween(date, b.checkIn, b.checkOut)
      );

      days.push({
        date,
        status,
        booking,
      });
    }

    return days;
  };

  // Disable a specific date
  const disableDate = (date: Date) => {
    if (!disabledDates.value.some((d) => isSameDay(d, date))) {
      disabledDates.value.push(new Date(date));
    }
  };

  // Enable a specific date
  const enableDate = (date: Date) => {
    disabledDates.value = disabledDates.value.filter(
      (d) => !isSameDay(d, date)
    );
  };

  // Toggle date status between enabled and disabled
  const toggleDateStatus = (date: Date) => {
    if (disabledDates.value.some((d) => isSameDay(d, date))) {
      enableDate(date);
    } else {
      disableDate(date);
    }
  };

  // Helper function to check if two dates are the same day
  function isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  // Helper function to check if a date is between two dates
  function isDateBetween(date: Date, start: Date, end: Date): boolean {
    return date > start && date < end;
  }

  // Initialize
  const init = async () => {
    await fetchBookings();
    initMockDisabledDates();
  };

  return {
    disabledDates,
    roomBookings,
    getDateStatus,
    getCalendarDays,
    disableDate,
    enableDate,
    toggleDateStatus,
    init,
  };
};
