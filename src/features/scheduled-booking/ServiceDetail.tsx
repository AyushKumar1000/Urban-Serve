import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getServiceByIdApi } from '../../api/services';
import { Service } from '../../types';
import { Button } from '../../components/ui/Button';
import { Star, ArrowLeft, Clock } from 'lucide-react';

export const ServiceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string>('');

  useEffect(() => {
    if (id) {
      getServiceByIdApi(id)
        .then(setService)
        .catch(() => {})
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) return <div className="p-8 text-center text-gray-600">Loading details...</div>;
  if (!service) return <div className="p-8 text-center text-red-500">Service not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Service Details</h1>
      </div>

      <div className="max-w-3xl mx-auto">
        <div className="bg-white p-6 border-b border-gray-100">
          <div className="text-xs font-semibold text-primary-600 mb-2 uppercase tracking-wider">{service.category}</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{service.title}</h2>
          <p className="text-gray-600 mb-6">{service.description}</p>
          
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
              {service.professional.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-bold text-gray-900">{service.professional.name}</h4>
              <div className="flex items-center gap-1 text-sm">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{service.professional.rating}</span>
                <span className="text-gray-500">({service.professional.reviewCount} reviews)</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5" /> Select a Time
          </h3>
          <div className="grid grid-cols-2 gap-3">
            {service.availableSlots.map(slot => (
              <button
                key={slot}
                onClick={() => setSelectedSlot(slot)}
                className={`p-3 text-sm font-medium rounded-lg border text-center transition-colors ${
                  selectedSlot === slot 
                    ? 'border-primary-500 bg-primary-50 text-primary-700 ring-2 ring-primary-500 ring-offset-1' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300'
                }`}
              >
                {new Date(slot).toLocaleString([], { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
              </button>
            ))}
          </div>
        </div>

        {/* Bottom fixed bar */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div>
              <div className="text-sm text-gray-500">Estimated Price</div>
              <div className="text-xl font-bold text-gray-900">${service.priceRange.min} - ${service.priceRange.max}</div>
            </div>
            <Button 
              disabled={!selectedSlot} 
              onClick={() => navigate(`/book/confirm`, { state: { serviceId: service.id, slot: selectedSlot }})}
              className="px-8"
            >
              Continue
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
