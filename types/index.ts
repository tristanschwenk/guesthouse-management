export enum DateStatus {
  OPEN = 'OPEN',
  CLOSE = 'CLOSE',
  OPEN_CLOSE = 'OPEN_CLOSE',
  CLOSE_OPEN = 'CLOSE_OPEN'
}

export interface Room {
  id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  capacity: number;
  amenities: string[];
}

export interface DateAvailability {
  date: Date;
  status: DateStatus;
}

export interface Booking {
  id: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
  status: 'confirmed' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface CalendarDay {
  date: Date;
  status: DateStatus;
  booking?: Booking;
}

