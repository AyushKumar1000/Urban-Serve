export type UserRole = "customer" | "service_team";

export type AuthUser = {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone: string;
  address?: string;
  coordinates?: { lat: number; lng: number };
  serviceCategory?: string;
  approvalStatus?: "pending" | "approved" | "rejected";
};

export type ProfessionalSummary = {
  id: string;
  name: string;
  rating: number; // 0-5
  reviewCount: number;
  photoUrl?: string;
  distanceKm?: number;
  phone?: string;
  vehicle?: string;
  currentCoords?: { lat: number; lng: number };
};

export type Service = {
  id: string;
  category: string;
  title: string;
  description: string;
  priceRange: { min: number; max: number };
  professional: ProfessionalSummary;
  availableSlots: string[]; // ISO datetime strings
};

export type Booking = {
  id: string;
  serviceId: string;
  professionalId: string;
  customerId: string;
  scheduledTime: string; // ISO datetime
  status: "confirmed" | "in_progress" | "completed" | "cancelled";
  price: number;
  createdAt: string;
  review?: { rating: number; comment?: string };
};

export type QuickServiceRequest = {
  id: string;
  customerId: string;
  serviceType: string;
  location: string;
  locationCoords?: { lat: number; lng: number };
  status: "searching" | "matched" | "no_match" | "en_route" | "in_progress" | "completed" | "cancelled";
  professional?: ProfessionalSummary;
  requestedAt: string;
  matchedAt?: string;
  estimatedArrival?: string;
  distanceKm?: number;
  etaMinutes?: number;
  partnerStartCoords?: { lat: number; lng: number };
  userTargetCoords?: { lat: number; lng: number };
};
