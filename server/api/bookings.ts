import { defineEventHandler } from 'h3'
import bookingsData from '../data/bookings.json'

export default defineEventHandler(() => {
  return bookingsData.map(booking => ({
    ...booking,
    checkIn: new Date(booking.checkIn),
    checkOut: new Date(booking.checkOut),
    createdAt: new Date(booking.createdAt)
  }))
})

