// Google Maps SDK Helper Utility
// Automatically checks for VITE_GOOGLE_MAPS_API_KEY in environment or runtime configuration.

declare global {
  interface Window {
    google?: any;
    initGoogleMaps?: () => void;
  }
}

let loadPromise: Promise<boolean> | null = null;

export const getGoogleMapsApiKey = (): string => {
  return import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';
};

/**
 * Dynamically load Google Maps JavaScript API script if API key is provided
 */
export const loadGoogleMapsScript = (): Promise<boolean> => {
  const apiKey = getGoogleMapsApiKey();

  if (!apiKey) {
    return Promise.resolve(false);
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(true);
  }

  if (loadPromise) {
    return loadPromise;
  }

  loadPromise = new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry,directions`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.head.appendChild(script);
  });

  return loadPromise;
};

/**
 * Real Reverse Geocode: Convert lat/lng coordinates into a real street address
 */
export const reverseGeocodeCoords = async (lat: number, lng: number): Promise<string> => {
  const hasLoaded = await loadGoogleMapsScript();

  if (hasLoaded && window.google && window.google.maps) {
    try {
      const geocoder = new window.google.maps.Geocoder();
      const response = await geocoder.geocode({ location: { lat, lng } });
      if (response.results && response.results[0]) {
        return response.results[0].formatted_address;
      }
    } catch (e) {
      console.warn("Google Maps Geocoding failed, falling back to simulated address:", e);
    }
  }

  // Fallback if no API key or failed
  return `Live GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E), Central Sector`;
};

/**
 * Real Places Autocomplete Search Suggestions
 */
export const fetchPlacePredictions = async (input: string): Promise<Array<{ description: string; placeId: string }>> => {
  if (!input.trim() || input.length < 2) return [];

  const hasLoaded = await loadGoogleMapsScript();

  if (hasLoaded && window.google && window.google.maps && window.google.maps.places) {
    try {
      const service = new window.google.maps.places.AutocompleteService();
      const predictions = await new Promise<any[]>((resolve) => {
        service.getPlacePredictions({ input }, (results: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            resolve(results);
          } else {
            resolve([]);
          }
        });
      });

      return predictions.map((p) => ({
        description: p.description,
        placeId: p.place_id,
      }));
    } catch (e) {
      console.warn("Google Places prediction error:", e);
    }
  }

  return [];
};
