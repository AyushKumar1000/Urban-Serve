import { Service } from "../types";
import { api } from "../lib/api";

/**
 * Get all services from PostgreSQL, with optional search and category filter
 */
export const getServicesApi = async (query?: string, category?: string): Promise<Service[]> => {
  const params = new URLSearchParams();
  if (query) params.set('query', query);
  if (category) params.set('category', category);

  const queryString = params.toString();
  const endpoint = queryString ? `/services?${queryString}` : '/services';

  return api.get<Service[]>(endpoint);
};

/**
 * Get a single service by ID from PostgreSQL
 */
export const getServiceByIdApi = async (id: string): Promise<Service> => {
  return api.get<Service>(`/services/${id}`);
};

/**
 * Get all service categories from PostgreSQL
 */
export const getCategoriesApi = async (): Promise<string[]> => {
  return api.get<string[]>('/services/categories');
};
