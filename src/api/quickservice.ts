import { QuickServiceRequest } from "../types";
import { api } from "../lib/api";

/**
 * Create a new quick service request in PostgreSQL
 */
export const createQuickServiceRequestApi = async (
  _customerId: string,
  serviceType: string,
  location: string,
  userCoords?: { lat: number; lng: number }
): Promise<QuickServiceRequest> => {
  return api.post<QuickServiceRequest>('/quick-service', {
    serviceType,
    location,
    lat: userCoords?.lat,
    lng: userCoords?.lng,
  });
};

/**
 * Get a quick service request by ID from PostgreSQL
 */
export const getQuickServiceRequestApi = async (id: string): Promise<QuickServiceRequest> => {
  return api.get<QuickServiceRequest>(`/quick-service/${id}`);
};

/**
 * Simulate matching a professional to the quick service request
 */
export const simulateMatchingApi = async (id: string): Promise<QuickServiceRequest> => {
  return api.post<QuickServiceRequest>(`/quick-service/${id}/match`, {});
};

/**
 * Update quick service request status in PostgreSQL
 */
export const updateQuickServiceStatusApi = async (
  id: string,
  status: QuickServiceRequest["status"]
): Promise<QuickServiceRequest> => {
  return api.put<QuickServiceRequest>(`/quick-service/${id}/status`, { status });
};
