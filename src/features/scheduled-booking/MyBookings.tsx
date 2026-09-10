import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getMyBookingsApi } from '../../api/bookings';
import { getServiceByIdApi } from '../../api/services';
import { Booking, Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { ArrowLeft, Calendar } from 'lucide-react';

type BookingWithService = Booking & { serviceData?: Service };

export const MyBookings: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState<BookingWithService[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      getMyBookingsApi(user.id).then(async (data) => {
        const enriched = await Promise.all(
          data.map(async (b) => {
            try {
              const svc = await getServiceByIdApi(b.serviceId);
              return { ...b, serviceData: svc };
            } catch {
              return b;
            }
          })
        );
        setBookings(enriched.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
        setIsLoading(false);
      });
    }
  }, [user]);

  if (isLoading) return <div className="p-8 text-center">Loading bookings...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">My Bookings</h1>
      </div>

      <div className="p-4 max-w-3xl mx-auto space-y-4">
        {bookings.length === 0 ? (
          <div className="text-center p-8 text-gray-500">You have no bookings yet.</div>
        ) : (
          bookings.map(booking => (
            <Card key={booking.id} className="p-4 sm:p-6 cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate(`/my-bookings/${booking.id}`)}>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-gray-900">{booking.serviceData?.title || 'Unknown Service'}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(booking.scheduledTime).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${
                  booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                  booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                  booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {booking.status.replace('_', ' ')}
                </div>
              </div>
              <div className="text-sm font-medium text-gray-900">
                ${booking.price}
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
