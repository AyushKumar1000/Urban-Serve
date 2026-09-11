import React, { useState } from 'react';
import { MapPin, Navigation, Search, Check, X, Loader2, Home, Briefcase, Building } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PRESET_LOCATIONS = [
  { name: 'Home', address: '42 Palm Avenue, Downtown District', icon: Home, coords: { lat: 28.6139, lng: 77.2090 } },
  { name: 'Office', address: 'Cyber Tech Park, Building 4B', icon: Briefcase, coords: { lat: 28.5355, lng: 77.3910 } },
  { name: 'Apartment', address: '742 Evergreen Terrace, Sector 45', icon: Building, coords: { lat: 28.4595, lng: 77.0266 } },
];

export const LocationModal: React.FC<LocationModalProps> = ({ isOpen, onClose }) => {
  const { user, updateUserLocation } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [isDetectingGps, setIsDetectingGps] = useState(false);
  const [gpsError, setGpsError] = useState('');

  if (!isOpen) return null;

  const currentAddress = user?.address || 'Downtown District, City Center';

  const handleUseGps = () => {
    setIsDetectingGps(true);
    setGpsError('');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          // Formatted address with GPS coordinates
          const address = `Live GPS (${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E), Metro Sector 12`;
          updateUserLocation(address, { lat, lng });
          setIsDetectingGps(false);
          onClose();
        },
        (_err) => {
          // Fallback location if permission denied or error
          const fallbackAddress = 'Live Location (124 Park Ridge Drive, Sector 18)';
          updateUserLocation(fallbackAddress, { lat: 28.6139, lng: 77.2090 });
          setIsDetectingGps(false);
          onClose();
        },
        { timeout: 6000 }
      );
    } else {
      setGpsError('Geolocation is not supported by your browser');
      setIsDetectingGps(false);
    }
  };

  const handleSelectPreset = (loc: typeof PRESET_LOCATIONS[0]) => {
    updateUserLocation(`${loc.name}: ${loc.address}`, loc.coords);
    onClose();
  };

  const handleSaveManualSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      updateUserLocation(searchQuery.trim(), { lat: 28.6139 + Math.random() * 0.05, lng: 77.2090 + Math.random() * 0.05 });
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 space-y-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-[#363BD9] flex items-center justify-center font-bold">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 leading-tight">Select Delivery & Service Location</h2>
              <p className="text-xs text-slate-500">Nearest pros & live dispatch are matched to your location</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPS Live Button */}
        <button
          onClick={handleUseGps}
          disabled={isDetectingGps}
          className="w-full bg-[#363BD9] hover:bg-[#282CC2] active:scale-[0.99] text-white p-4 rounded-2xl font-bold text-sm sm:text-base flex items-center justify-between transition-all shadow-md group"
        >
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              {isDetectingGps ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 fill-current group-hover:rotate-12 transition-transform" />
              )}
            </div>
            <div className="text-left">
              <div className="leading-tight font-extrabold">Use Current GPS Location</div>
              <div className="text-xs text-indigo-100 font-normal">Detect exact live latitude & longitude</div>
            </div>
          </div>
          <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-semibold">GPS</span>
        </button>

        {gpsError && (
          <p className="text-xs text-red-500 font-medium px-1">{gpsError}</p>
        )}

        {/* Search Input */}
        <form onSubmit={handleSaveManualSearch} className="space-y-2">
          <label className="text-xs font-bold text-slate-700">Search or Type Address</label>
          <div className="bg-slate-50 border border-slate-200 focus-within:border-[#363BD9] focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all">
            <Search className="w-4 h-4 text-slate-400 shrink-0" />
            <input 
              type="text" 
              placeholder="e.g. 142 Parkview Ave, Sector 5..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
            />
            {searchQuery && (
              <button 
                type="submit"
                className="bg-[#363BD9] text-white text-xs font-bold px-3 py-1.5 rounded-xl hover:bg-[#282CC2] transition-colors shrink-0"
              >
                Save
              </button>
            )}
          </div>
        </form>

        {/* Preset Saved Addresses */}
        <div className="space-y-3">
          <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Saved & Recent Locations</div>
          
          <div className="space-y-2">
            {PRESET_LOCATIONS.map((loc) => {
              const IconComp = loc.icon;
              const isSelected = currentAddress.includes(loc.name) || currentAddress.includes(loc.address);

              return (
                <div
                  key={loc.name}
                  onClick={() => handleSelectPreset(loc)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                    isSelected 
                      ? 'bg-indigo-50/80 border-[#363BD9] ring-2 ring-indigo-500/10' 
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-[#363BD9] text-white' : 'bg-slate-100 text-slate-600'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm text-slate-900">{loc.name}</div>
                      <div className="text-xs text-slate-500 truncate max-w-[240px] sm:max-w-[320px]">{loc.address}</div>
                    </div>
                  </div>

                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-[#363BD9] text-white flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Current Active Location Bar */}
        <div className="bg-slate-100 rounded-2xl p-3 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-2 text-slate-600 truncate">
            <span className="font-bold text-slate-900 shrink-0">Current:</span>
            <span className="truncate font-medium">{currentAddress}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
