import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuickServiceRequestApi, updateQuickServiceStatusApi } from '../../api/quickservice';
import { QuickServiceRequest } from '../../types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ArrowLeft, CheckCircle2, Navigation, Loader2 } from 'lucide-react';

export const QuickServiceTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<QuickServiceRequest | null>(null);

  const fetchRequest = () => {
    if (id) {
      getQuickServiceRequestApi(id).then(setRequest);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const simulateProgress = async () => {
    if (!request) return;
    let nextStatus: QuickServiceRequest["status"];
    if (request.status === 'matched') nextStatus = 'en_route';
    else if (request.status === 'en_route') nextStatus = 'in_progress';
    else if (request.status === 'in_progress') nextStatus = 'completed';
    else return;
    
    await updateQuickServiceStatusApi(request.id, nextStatus);
    fetchRequest();
  };

  if (!request) return <div className="p-8 text-center text-gray-500">Loading tracking data...</div>;

  const statuses = ['matched', 'en_route', 'in_progress', 'completed'];
  const currentIndex = statuses.indexOf(request.status);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="bg-white p-4 shadow-sm flex items-center gap-4 sticky top-0 z-10">
        <button onClick={() => navigate('/home')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-900">Live Tracking</h1>
      </div>

      <div className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        <div className="bg-orange-100 rounded-xl p-8 flex items-center justify-center text-orange-600 mb-6">
          <Navigation className="w-16 h-16 animate-bounce" />
        </div>

        <Card className="p-6 relative">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Status Timeline</h2>
          
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-300 before:to-transparent">
            
            {statuses.map((status, index) => {
              const isCompleted = currentIndex >= index;
              const isCurrent = currentIndex === index;
              
              let Icon = CheckCircle2;
              if (isCurrent && status !== 'completed') Icon = Loader2;
              
              const labels = {
                matched: "Professional Assigned",
                en_route: "On the way to your location",
                in_progress: "Service in progress",
                completed: "Service Completed"
              };

              return (
                <div key={status} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white z-10 shadow shrink-0 ${isCompleted ? 'bg-orange-500 text-white' : 'bg-gray-200 text-gray-500'}`}>
                    <Icon className={`w-5 h-5 ${isCurrent && status !== 'completed' ? 'animate-spin' : ''}`} />
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl shadow-sm bg-white border border-gray-100">
                    <h3 className={`font-bold ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                      {labels[status as keyof typeof labels]}
                    </h3>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        {request.status !== 'completed' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto">
              <Button className="w-full" variant="secondary" onClick={simulateProgress}>
                [Demo] Simulate Progress
              </Button>
            </div>
          </div>
        )}

        {request.status === 'completed' && (
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-200">
            <div className="max-w-lg mx-auto">
              <Button className="w-full !bg-orange-600 hover:!bg-orange-700" onClick={() => navigate('/home')}>
                Return to Home
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
