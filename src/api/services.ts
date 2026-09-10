import { Service } from "../types";

const mockServices: Service[] = [
  {
    id: "s1",
    category: "Cleaning",
    title: "Deep Home Cleaning",
    description: "Complete deep cleaning of your home including bathrooms, kitchen, and living areas.",
    priceRange: { min: 99, max: 299 },
    professional: {
      id: "p1",
      name: "Alice Johnson",
      rating: 4.8,
      reviewCount: 124,
    },
    availableSlots: [
      new Date(Date.now() + 86400000).toISOString(),
      new Date(Date.now() + 172800000).toISOString(),
    ],
  },
  {
    id: "s2",
    category: "Home Repair",
    title: "Plumbing Service",
    description: "Fix leaks, unclog drains, and install new fixtures.",
    priceRange: { min: 50, max: 150 },
    professional: {
      id: "p2",
      name: "Bob Smith",
      rating: 4.5,
      reviewCount: 89,
    },
    availableSlots: [
      new Date(Date.now() + 43200000).toISOString(),
      new Date(Date.now() + 86400000).toISOString(),
    ],
  },
  {
    id: "s3",
    category: "Personal Care",
    title: "Men's Haircut & Grooming",
    description: "Professional haircut, beard styling, and facial massage at home.",
    priceRange: { min: 30, max: 60 },
    professional: {
      id: "p3",
      name: "David Lee",
      rating: 4.9,
      reviewCount: 210,
    },
    availableSlots: [
      new Date(Date.now() + 3600000).toISOString(),
      new Date(Date.now() + 7200000).toISOString(),
    ],
  }
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getServicesApi = async (query?: string, category?: string): Promise<Service[]> => {
  await delay(600);
  let results = [...mockServices];
  
  if (category) {
    results = results.filter(s => s.category === category);
  }
  
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(s => s.title.toLowerCase().includes(q) || s.description.toLowerCase().includes(q));
  }
  
  return results;
};

export const getServiceByIdApi = async (id: string): Promise<Service> => {
  await delay(500);
  const service = mockServices.find(s => s.id === id);
  if (!service) throw new Error("Service not found");
  return service;
};

export const getCategoriesApi = async (): Promise<string[]> => {
  await delay(300);
  return ["Cleaning", "Home Repair", "Personal Care", "Appliance Repair"];
};
