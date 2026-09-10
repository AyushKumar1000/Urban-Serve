import React from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CheckCircle } from 'lucide-react';

export const BookingSuccess: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { bookingId?: string } | null;

  if (!state?.bookingId) {
    return <div className="p-8 text-center text-red-500">Invalid state</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="w-20 h-20 text-green-500" />
        </div>
        
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
        <p className="text-gray-600 mb-6">
          Your service has been successfully booked. Our professional will arrive at the scheduled time.
        </p>

        <div className="bg-gray-50 rounded-lg p-4 mb-8">
          <div className="text-sm text-gray-500 uppercase tracking-wide font-semibold">Booking ID</div>
          <div className="text-lg font-mono font-medium text-gray-900">{state.bookingId}</div>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => navigate(`/my-bookings/${state.bookingId}`)}>
            Track Booking
          </Button>
          <Button variant="outline" className="w-full" onClick={() => navigate('/home')}>
            Back to Home
          </Button>
        </div>
      </Card>
    </div>
  );
};
