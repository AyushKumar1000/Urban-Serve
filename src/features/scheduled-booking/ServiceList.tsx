import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { getServicesApi } from '../../api/services';
import { Service } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Star, ArrowLeft } from 'lucide-react';

export const ServiceList: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getServicesApi(query, category)
      .then(setServices)
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [query, category]);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">
          {category ? `${category} Services` : query ? `Search: ${query}` : 'All Services'}
        </h1>
      </div>

      <div className="p-4 max-w-3xl mx-auto mt-4 space-y-4">
        {isLoading ? (
          <div className="text-center p-8">Loading services...</div>
        ) : error ? (
          <div className="text-center p-8 text-red-500">{error}</div>
        ) : services.length === 0 ? (
          <div className="text-center p-8 text-gray-500">
            No services found. Try another search.
            <Button variant="outline" className="mt-4" onClick={() => navigate('/home')}>Go Back</Button>
          </div>
        ) : (
          services.map(service => (
            <Card key={service.id} className="p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate(`/services/${service.id}`)}>
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                  <div className="text-xs font-semibold text-primary-600 mb-1">{service.category}</div>
                  <h3 className="text-lg font-bold text-gray-900">{service.title}</h3>
                  <div className="flex items-center gap-1 mt-1 mb-2">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium text-gray-700">{service.professional.rating}</span>
                    <span className="text-sm text-gray-500">({service.professional.reviewCount} reviews)</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900">${service.priceRange.min}</div>
                  <div className="text-xs text-gray-500">onwards</div>
                  <Button size="sm" className="mt-3">Book</Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
