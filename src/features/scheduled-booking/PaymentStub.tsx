import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createBookingApi } from '../../api/bookings';
import { getServiceByIdApi } from '../../api/services';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Lock, ArrowLeft } from 'lucide-react';

export const PaymentStub: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const state = location.state as { serviceId?: string; slot?: string; price?: number } | null;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  if (!state?.serviceId || !state?.slot || !user) {
    return <div className="p-8 text-center text-red-500">Invalid booking state</div>;
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    try {
      const service = await getServiceByIdApi(state.serviceId!);
      const booking = await createBookingApi({
        serviceId: service.id,
        professionalId: service.professional.id,
        customerId: user.id,
        scheduledTime: state.slot!,
        price: state.price!,
      });
      navigate('/book/success', { state: { bookingId: booking.id } });
    } catch (err: any) {
      setError(err.message || "Payment failed");
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Payment</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto mt-4 space-y-4">
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Total to Pay</h2>
            <div className="text-2xl font-bold text-primary-600">${state.price}</div>
          </div>

          {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

          <form onSubmit={handlePayment} className="space-y-4">
            <Input label="Card Number" placeholder="**** **** **** ****" required />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Expiry Date" placeholder="MM/YY" required />
              <Input label="CVC" placeholder="***" type="password" required />
            </div>
            <Input label="Name on Card" placeholder="John Doe" required />

            <div className="flex items-center gap-2 text-sm text-gray-500 mt-4 mb-6">
              <Lock className="w-4 h-4" />
              This is a secure mock payment. No real card needed.
            </div>

            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" isLoading={isProcessing}>
              Pay ${state.price} & Book
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
