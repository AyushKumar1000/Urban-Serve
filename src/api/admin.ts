import { api } from "../lib/api";

/**
 * Admin API — Service Team Dashboard Data from PostgreSQL
 */

export type DashboardStats = {
  totalCustomers: number;
  totalBookings: number;
  completedBookings: number;
  totalQuickRequests: number;
  totalRevenue: number;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  coordinates: { lat: number; lng: number } | null;
  createdAt: string;
};

export type AdminBooking = {
  id: string;
  serviceTitle: string;
  serviceCategory: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  professionalName: string | null;
  scheduledTime: string;
  status: string;
  price: number;
  reviewRating: number | null;
  reviewComment: string | null;
  createdAt: string;
};

export type AdminQuickRequest = {
  id: string;
  serviceType: string;
  location: string;
  status: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  professionalName: string | null;
  requestedAt: string;
  matchedAt: string | null;
  distanceKm: number | null;
  etaMinutes: number | null;
};

export type CustomerDetail = {
  customer: AdminCustomer;
  bookings: Array<{
    id: string;
    serviceTitle: string;
    serviceCategory: string;
    scheduledTime: string;
    status: string;
    price: number;
    reviewRating: number | null;
    createdAt: string;
  }>;
  quickRequests: Array<{
    id: string;
    serviceType: string;
    location: string;
    status: string;
    requestedAt: string;
    matchedAt: string | null;
  }>;
};

/**
 * Get dashboard stats
 */
export const getDashboardStatsApi = async (): Promise<DashboardStats> => {
  return api.get<DashboardStats>('/admin/stats');
};

/**
 * Get all customers with optional search
 */
export const getAllCustomersApi = async (search?: string): Promise<AdminCustomer[]> => {
  const params = search ? `?search=${encodeURIComponent(search)}` : '';
  return api.get<AdminCustomer[]>(`/admin/customers${params}`);
};

/**
 * Get single customer with their booking history
 */
export const getCustomerDetailApi = async (customerId: string): Promise<CustomerDetail> => {
  return api.get<CustomerDetail>(`/admin/customers/${customerId}`);
};

/**
 * Get all bookings with optional filters
 */
export const getAllBookingsApi = async (status?: string, search?: string): Promise<AdminBooking[]> => {
  const params = new URLSearchParams();
  if (status) params.set('status', status);
  if (search) params.set('search', search);
  const queryString = params.toString();
  return api.get<AdminBooking[]>(`/admin/bookings${queryString ? `?${queryString}` : ''}`);
};

/**
 * Get all quick service requests
 */
export const getAllQuickRequestsApi = async (): Promise<AdminQuickRequest[]> => {
  return api.get<AdminQuickRequest[]>('/admin/quick-requests');
};
