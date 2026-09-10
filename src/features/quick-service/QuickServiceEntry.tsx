import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { createQuickServiceRequestApi } from '../../api/quickservice';
import { getCategoriesApi } from '../../api/services';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { ArrowLeft, Zap } from 'lucide-react';

export const QuickServiceEntry: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [categories, setCategories] = useState<string[]>([]);
  const [serviceType, setServiceType] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    getCategoriesApi().then(setCategories);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !serviceType || !location) return;
    
    setIsSubmitting(true);
    try {
      const req = await createQuickServiceRequestApi(user.id, serviceType, location);
      navigate(`/quick-service/match/${req.id}`);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10 text-white">
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white/20 rounded-full">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold flex items-center gap-2">
          <Zap className="w-5 h-5 fill-white" /> Quick-Service
        </h1>
      </div>

      <div className="p-4 max-w-md mx-auto mt-8">
        <Card className="p-6 border-t-4 border-t-orange-500">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Need it now?</h2>
            <p className="text-sm text-gray-500 mt-1">We'll find an available professional near you immediately.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col w-full">
              <label className="mb-1 text-sm font-medium text-gray-700">What service do you need right now?</label>
              <select 
                className="h-11 rounded-lg border border-gray-300 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={serviceType}
                onChange={(e) => setServiceType(e.target.value)}
                required
              >
                <option value="">Select a service category</option>
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <Input 
              label="Your Location" 
              placeholder="Enter your full address" 
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required 
            />

            <Button 
              type="submit" 
              className="w-full !bg-orange-600 hover:!bg-orange-700 focus:ring-orange-500 shadow-orange-500/30 shadow-lg"
              isLoading={isSubmitting}
            >
              Find a Professional
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};
