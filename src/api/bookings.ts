import { Booking } from "../types";
import { api } from "../lib/api";

/**
 * Create a new booking in PostgreSQL
 */
export const createBookingApi = async (
  booking: Omit<Booking, "id" | "createdAt" | "status">
): Promise<Booking> => {
  return api.post<Booking>('/bookings', {
    serviceId: booking.serviceId,
    professionalId: booking.professionalId,
    scheduledTime: booking.scheduledTime,
    price: booking.price,
  });
};

/**
 * Get bookings for the authenticated customer from PostgreSQL
 */
export const getMyBookingsApi = async (_customerId: string): Promise<Booking[]> => {
  // customerId is now derived from JWT on the server side
  return api.get<Booking[]>('/bookings/my');
};

/**
 * Get a single booking by ID from PostgreSQL
 */
export const getBookingByIdApi = async (id: string): Promise<Booking> => {
  return api.get<Booking>(`/bookings/${id}`);
};

/**
 * Rate a completed booking in PostgreSQL
 */
export const rateBookingApi = async (
  id: string,
  rating: number,
  comment?: string
): Promise<Booking> => {
  return api.put<Booking>(`/bookings/${id}/rate`, { rating, comment });
};

/**
 * Update booking status in PostgreSQL
 */
export const updateBookingStatusApi = async (
  id: string,
  status: Booking["status"]
): Promise<Booking> => {
  return api.put<Booking>(`/bookings/${id}/status`, { status });
};
