import { Booking } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getBookings = (): Booking[] => {
  const str = localStorage.getItem("mock_bookings");
  return str ? JSON.parse(str) : [];
};

const saveBookings = (bookings: Booking[]) => {
  localStorage.setItem("mock_bookings", JSON.stringify(bookings));
};

export const createBookingApi = async (booking: Omit<Booking, "id" | "createdAt" | "status">): Promise<Booking> => {
  await delay(800);
  const newBooking: Booking = {
    ...booking,
    id: Math.random().toString(36).substring(7),
    createdAt: new Date().toISOString(),
    status: "confirmed",
  };
  saveBookings([...getBookings(), newBooking]);
  return newBooking;
};

export const getMyBookingsApi = async (customerId: string): Promise<Booking[]> => {
  await delay(600);
  return getBookings().filter(b => b.customerId === customerId);
};

export const getBookingByIdApi = async (id: string): Promise<Booking> => {
  await delay(400);
  const booking = getBookings().find(b => b.id === id);
  if (!booking) throw new Error("Booking not found");
  return booking;
};

export const rateBookingApi = async (id: string, rating: number, comment?: string): Promise<Booking> => {
  await delay(600);
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) throw new Error("Booking not found");
  
  bookings[index] = {
    ...bookings[index],
    review: { rating, comment },
    status: "completed" // we mark as completed on review just for demo
  };
  
  saveBookings(bookings);
  return bookings[index];
};

export const updateBookingStatusApi = async (id: string, status: Booking["status"]): Promise<Booking> => {
  await delay(600);
  const bookings = getBookings();
  const index = bookings.findIndex(b => b.id === id);
  if (index === -1) throw new Error("Booking not found");
  
  bookings[index] = { ...bookings[index], status };
  saveBookings(bookings);
  return bookings[index];
};
