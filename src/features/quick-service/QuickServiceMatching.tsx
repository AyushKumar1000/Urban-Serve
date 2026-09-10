import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuickServiceRequestApi, simulateMatchingApi } from '../../api/quickservice';
import { QuickServiceRequest } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Zap, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';

export const QuickServiceMatching: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<QuickServiceRequest | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    
    getQuickServiceRequestApi(id).then(req => {
      setRequest(req);
      if (req.status === 'searching') {
        simulateMatchingApi(id)
          .then(setRequest)
          .catch(e => setError(e.message));
      }
    }).catch(e => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 text-center border-t-4 border-t-red-500">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <Button onClick={() => navigate('/quick-service')} className="w-full">Try Again</Button>
        </Card>
      </div>
    );
  }

  if (!request || request.status === 'searching') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="relative">
          <div className="absolute inset-0 bg-orange-200 rounded-full animate-ping opacity-75"></div>
          <div className="relative bg-orange-100 p-6 rounded-full">
            <Zap className="w-12 h-12 text-orange-600 fill-orange-600 animate-pulse" />
          </div>
        </div>
        <h2 className="text-xl font-bold mt-8 mb-2 text-gray-900">Looking for nearby professionals...</h2>
        <p className="text-gray-500 flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> This usually takes a few moments
        </p>
      </div>
    );
  }

  if (request.status === 'no_match') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <Card className="max-w-md w-full p-8 text-center border-t-4 border-t-yellow-500">
          <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2 text-gray-900">No Match Found</h2>
          <p className="text-gray-600 mb-6">
            We couldn't find an available professional near you at this exact moment. 
            Would you like to schedule it instead?
          </p>
          <div className="space-y-3">
            <Button onClick={() => navigate('/home')} className="w-full">Book for Later</Button>
            <Button onClick={() => navigate('/quick-service')} variant="outline" className="w-full">Try Again</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center border-t-4 border-t-green-500">
        <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-gray-900">Professional Matched!</h2>
        <p className="text-gray-600 mb-6">
          {request.professional?.name} has accepted your request and is getting ready.
        </p>

        <div className="bg-gray-50 p-4 rounded-xl mb-6 text-left flex items-center gap-4">
          <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
            {request.professional?.name.charAt(0)}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{request.professional?.name}</h4>
            <div className="text-sm text-gray-500">{request.professional?.rating} ★</div>
          </div>
        </div>

        <Button 
          onClick={() => navigate(`/quick-service/track/${request.id}`)} 
          className="w-full !bg-orange-600 hover:!bg-orange-700"
        >
          Track Live Status
        </Button>
      </Card>
    </div>
  );
};
