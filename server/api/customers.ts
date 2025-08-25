import { defineEventHandler } from 'h3'
import customersData from '../data/customers.json'

export default defineEventHandler(() => {
  return customersData.map(customer => ({
    ...customer,
    createdAt: new Date(customer.createdAt)
  }))
})

