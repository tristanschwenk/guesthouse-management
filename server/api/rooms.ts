import { defineEventHandler } from 'h3'
import roomsData from '../data/rooms.json'

export default defineEventHandler(() => {
  return roomsData
})

