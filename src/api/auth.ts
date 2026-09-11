import { AuthUser, UserRole } from "../types";
import { api, setToken } from "../lib/api";

/**
 * Sign up a new user via PostgreSQL backend
 */
export const signupApi = async (
  data: Partial<AuthUser> & { password: string },
  role: UserRole
): Promise<{ user: AuthUser; token: string }> => {
  const response = await api.post<{ user: AuthUser; token: string }>('/auth/signup', {
    name: data.name,
    email: data.email,
    password: data.password,
    phone: data.phone,
    role,
    serviceCategory: data.serviceCategory,
  });

  // Store the JWT token
  setToken(response.token);
  return response;
};

/**
 * Log in an existing user via PostgreSQL backend
 */
export const loginApi = async (
  email: string,
  password: string,
  role: UserRole
): Promise<{ user: AuthUser; token: string }> => {
  const response = await api.post<{ user: AuthUser; token: string }>('/auth/login', {
    email,
    password,
    role,
  });

  // Store the JWT token
  setToken(response.token);
  return response;
};

/**
 * Update user's location
 */
export const updateLocationApi = async (
  userId: string,
  address: string,
  lat?: number,
  lng?: number
): Promise<AuthUser> => {
  return api.put<AuthUser>('/auth/location', {
    userId,
    address,
    lat,
    lng,
  });
};
