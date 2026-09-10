import { QuickServiceRequest } from "../types";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getQuickServices = (): QuickServiceRequest[] => {
  const str = localStorage.getItem("mock_quick_services");
  return str ? JSON.parse(str) : [];
};

const saveQuickServices = (reqs: QuickServiceRequest[]) => {
  localStorage.setItem("mock_quick_services", JSON.stringify(reqs));
};

export const createQuickServiceRequestApi = async (customerId: string, serviceType: string, location: string): Promise<QuickServiceRequest> => {
  await delay(800);
  const newReq: QuickServiceRequest = {
    id: Math.random().toString(36).substring(7),
    customerId,
    serviceType,
    location,
    status: "searching",
    requestedAt: new Date().toISOString(),
  };
  saveQuickServices([...getQuickServices(), newReq]);
  return newReq;
};

export const getQuickServiceRequestApi = async (id: string): Promise<QuickServiceRequest> => {
  await delay(400);
  const req = getQuickServices().find(r => r.id === id);
  if (!req) throw new Error("Request not found");
  return req;
};

export const simulateMatchingApi = async (id: string): Promise<QuickServiceRequest> => {
  await delay(2500); 
  const reqs = getQuickServices();
  const index = reqs.findIndex(r => r.id === id);
  if (index === -1) throw new Error("Request not found");
  
  // 80% chance to match
  const isMatch = Math.random() > 0.2;
  
  if (isMatch) {
    reqs[index] = {
      ...reqs[index],
      status: "matched",
      matchedAt: new Date().toISOString(),
      estimatedArrival: new Date(Date.now() + 1800000).toISOString(),
      professional: {
        id: "p4",
        name: "Elena Rodriguez",
        rating: 4.7,
        reviewCount: 95
      }
    };
  } else {
    reqs[index] = { ...reqs[index], status: "no_match" };
  }
  
  saveQuickServices(reqs);
  return reqs[index];
};

export const updateQuickServiceStatusApi = async (id: string, status: QuickServiceRequest["status"]): Promise<QuickServiceRequest> => {
  await delay(500);
  const reqs = getQuickServices();
  const index = reqs.findIndex(r => r.id === id);
  if (index === -1) throw new Error("Request not found");
  
  reqs[index] = { ...reqs[index], status };
  saveQuickServices(reqs);
  return reqs[index];
};
