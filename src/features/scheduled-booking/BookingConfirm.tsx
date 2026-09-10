import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getServiceByIdApi } from '../../api/services';
import { Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';

export const BookingConfirm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { serviceId?: string; slot?: string } | null;
  
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!state?.serviceId || !state?.slot) {
      navigate('/home');
      return;
    }
    
    getServiceByIdApi(state.serviceId)
      .then(setService)
      .finally(() => setIsLoading(false));
  }, [state, navigate]);

  if (isLoading) return <div className="p-8 text-center">Loading...</div>;
  if (!service) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Booking Summary</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Review your request</h2>
          
          <div className="space-y-4">
            <div className="flex justify-between border-b pb-4">
              <div>
                <div className="text-sm text-gray-500">Service</div>
                <div className="font-medium text-gray-900">{service.title}</div>
              </div>
            </div>
            
            <div className="flex justify-between border-b pb-4">
              <div>
                <div className="text-sm text-gray-500">Date & Time</div>
                <div className="font-medium text-gray-900">
                  {new Date(state!.slot!).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>

            <div className="flex justify-between border-b pb-4">
              <div>
                <div className="text-sm text-gray-500">Professional</div>
                <div className="font-medium text-gray-900">{service.professional.name}</div>
              </div>
            </div>

            <div className="flex justify-between">
              <div>
                <div className="text-sm text-gray-500">Amount to Pay</div>
                <div className="font-bold text-lg text-gray-900">${service.priceRange.min}</div>
              </div>
            </div>
          </div>
        </Card>

        <div className="bg-blue-50 p-4 rounded-lg flex gap-3 text-blue-800">
          <CheckCircle2 className="w-6 h-6 shrink-0" />
          <p className="text-sm">You won't be charged until the service is completed.</p>
        </div>

        <Button 
          className="w-full" 
          onClick={() => navigate('/book/payment', { state: { serviceId: service.id, slot: state!.slot, price: service.priceRange.min }})}
        >
          Proceed to Payment
        </Button>
      </div>
    </div>
  );
};
