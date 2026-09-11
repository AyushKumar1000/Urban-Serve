import { QuickServiceRequest, ProfessionalSummary } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const MOCK_PROS: ProfessionalSummary[] = [
  {
    id: "p1",
    name: "Elena Rodriguez",
    rating: 4.9,
    reviewCount: 340,
    phone: "+1 (555) 234-9871",
    vehicle: "Honda Activa Pro • EV-842",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80",
    distanceKm: 0.8,
  },
  {
    id: "p2",
    name: "Marcus Vance",
    rating: 4.8,
    reviewCount: 185,
    phone: "+1 (555) 892-1243",
    vehicle: "Ford Transit Custom • US-901",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    distanceKm: 1.4,
  },
  {
    id: "p3",
    name: "Sarah Jenkins",
    rating: 4.95,
    reviewCount: 420,
    phone: "+1 (555) 431-7788",
    vehicle: "Toyota Electric Van • EV-109",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
    distanceKm: 2.1,
  },
];

const getQuickServices = (): QuickServiceRequest[] => {
  const str = localStorage.getItem("mock_quick_services");
  return str ? JSON.parse(str) : [];
};

const saveQuickServices = (reqs: QuickServiceRequest[]) => {
  localStorage.setItem("mock_quick_services", JSON.stringify(reqs));
};

export const createQuickServiceRequestApi = async (
  customerId: string, 
  serviceType: string, 
  location: string,
  userCoords?: { lat: number; lng: number }
): Promise<QuickServiceRequest> => {
  await delay(600);
  const targetCoords = userCoords || { lat: 28.6139, lng: 77.2090 };

  const newReq: QuickServiceRequest = {
    id: Math.random().toString(36).substring(7),
    customerId,
    serviceType,
    location: location || "Live GPS Location, City Center",
    locationCoords: targetCoords,
    status: "searching",
    requestedAt: new Date().toISOString(),
    userTargetCoords: targetCoords,
  };

  saveQuickServices([...getQuickServices(), newReq]);
  return newReq;
};

export const getQuickServiceRequestApi = async (id: string): Promise<QuickServiceRequest> => {
  await delay(300);
  const reqs = getQuickServices();
  let req = reqs.find(r => r.id === id);

  // Fallback demo request if accessing directly with active/demo id
  if (!req && id === 'active') {
    const demoReq: QuickServiceRequest = {
      id: "active",
      customerId: "cust_1",
      serviceType: "Deep Apartment Cleaning",
      location: "Live GPS (28.6139° N, 77.2090° E), Metro Sector 12",
      status: "en_route",
      requestedAt: new Date().toISOString(),
      matchedAt: new Date(Date.now() - 300000).toISOString(),
      estimatedArrival: new Date(Date.now() + 720000).toISOString(),
      distanceKm: 1.4,
      etaMinutes: 12,
      userTargetCoords: { lat: 28.6139, lng: 77.2090 },
      partnerStartCoords: { lat: 28.6310, lng: 77.2280 },
      professional: MOCK_PROS[0],
    };
    return demoReq;
  }

  if (!req) throw new Error("Request not found");
  return req;
};

export const simulateMatchingApi = async (id: string): Promise<QuickServiceRequest> => {
  await delay(2200); 
  const reqs = getQuickServices();
  const index = reqs.findIndex(r => r.id === id);
  if (index === -1) throw new Error("Request not found");
  
  // Pick nearest partner (Elena Rodriguez - 0.8 km away)
  const nearestPro = MOCK_PROS[0];
  const targetCoords = reqs[index].userTargetCoords || { lat: 28.6139, lng: 77.2090 };
  const partnerStartCoords = { lat: targetCoords.lat + 0.015, lng: targetCoords.lng + 0.018 };

  reqs[index] = {
    ...reqs[index],
    status: "matched",
    matchedAt: new Date().toISOString(),
    estimatedArrival: new Date(Date.now() + 720000).toISOString(),
    distanceKm: 0.8,
    etaMinutes: 12,
    partnerStartCoords,
    userTargetCoords: targetCoords,
    professional: nearestPro,
  };
  
  saveQuickServices(reqs);
  return reqs[index];
};

export const updateQuickServiceStatusApi = async (id: string, status: QuickServiceRequest["status"]): Promise<QuickServiceRequest> => {
  await delay(400);
  const reqs = getQuickServices();
  const index = reqs.findIndex(r => r.id === id);
  if (index === -1 && id === 'active') {
    return {
      id: "active",
      customerId: "cust_1",
      serviceType: "Deep Apartment Cleaning",
      location: "Live GPS Location, Metro Sector 12",
      status,
      requestedAt: new Date().toISOString(),
      professional: MOCK_PROS[0],
    };
  }

  if (index === -1) throw new Error("Request not found");
  
  reqs[index] = { ...reqs[index], status };
  saveQuickServices(reqs);
  return reqs[index];
};
