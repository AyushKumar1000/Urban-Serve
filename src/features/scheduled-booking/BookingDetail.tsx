import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBookingByIdApi, updateBookingStatusApi } from '../../api/bookings';
import { getServiceByIdApi } from '../../api/services';
import { Booking, Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, Clock, MapPin, Phone, Star } from 'lucide-react';

export const BookingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDetails = () => {
    if (id) {
      getBookingByIdApi(id)
        .then(async (b) => {
          setBooking(b);
          try {
            const s = await getServiceByIdApi(b.serviceId);
            setService(s);
          } catch {}
        })
        .finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const simulateProgress = async () => {
    if (!booking) return;
    const nextStatus = booking.status === 'confirmed' ? 'in_progress' : 'completed';
    await updateBookingStatusApi(booking.id, nextStatus);
    fetchDetails();
  };

  if (isLoading) return <div className="p-8 text-center">Loading booking...</div>;
  if (!booking) return <div className="p-8 text-center text-red-500">Booking not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/my-bookings')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Booking #{booking.id}</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{service?.title || 'Unknown Service'}</h2>
              <div className="text-gray-500 text-sm mt-1">{service?.category}</div>
            </div>
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
              booking.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
              booking.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
              booking.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
            }`}>
              {booking.status.replace('_', ' ')}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Clock className="text-primary-500 w-5 h-5" />
              <div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date(booking.scheduledTime).toLocaleString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(booking.scheduledTime).toLocaleString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-primary-500 w-5 h-5" />
              <div className="text-sm font-medium text-gray-900">Customer Location</div>
            </div>
          </div>
        </Card>

        {service && (
          <Card className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Professional Assigned</h3>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                {service.professional.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-gray-900">{service.professional.name}</h4>
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" /> 
                  {service.professional.rating}
                </div>
              </div>
              <Button variant="outline" size="sm">
                <Phone className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        )}

        {booking.review && (
          <Card className="p-6">
             <h3 className="text-lg font-bold text-gray-900 mb-2">Your Review</h3>
             <div className="flex items-center gap-1 mb-2">
               {[1,2,3,4,5].map(star => (
                 <Star key={star} className={`w-5 h-5 ${star <= booking.review!.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
               ))}
             </div>
             {booking.review.comment && <p className="text-gray-600 text-sm mt-2">{booking.review.comment}</p>}
          </Card>
        )}

        {booking.status !== 'completed' && booking.status !== 'cancelled' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto">
              <Button className="w-full" variant="secondary" onClick={simulateProgress}>
                [Demo] Simulate Progress ({booking.status === 'confirmed' ? 'Start Job' : 'Complete Job'})
              </Button>
            </div>
          </div>
        )}

        {booking.status === 'completed' && !booking.review && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto">
              <Button className="w-full" onClick={() => navigate(`/book/rate/${booking.id}`)}>
                Rate & Review Professional
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
