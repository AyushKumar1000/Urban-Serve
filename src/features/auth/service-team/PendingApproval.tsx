import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Clock } from 'lucide-react';

export const PendingApproval: React.FC = () => {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="max-w-md w-full p-8 text-center border-t-4 border-t-orange-500">
        <div className="flex justify-center mb-6">
          <div className="bg-orange-100 p-4 rounded-full animate-pulse">
            <Clock className="w-12 h-12 text-orange-600" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Under Review</h2>
        <p className="text-gray-600 mb-8">
          Thank you for applying to be a service professional! Our team is currently reviewing your profile. 
          We'll notify you once you're approved.
        </p>
        <Button onClick={logout} variant="outline" className="w-full">
          Log Out
        </Button>
      </Card>
    </div>
  );
};
