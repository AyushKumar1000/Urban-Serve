import React from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

export const ServiceTeamDashboardPlaceholder: React.FC = () => {
  const { user, logout } = useAuth();

  if (user?.approvalStatus === 'pending') {
    // This should ideally be handled by a router guard, but added here as a fallback
    return <div className="p-8 text-center text-red-500">Access Denied: Pending Approval</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 border-l-4 border-l-orange-500">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Welcome, {user?.name}</h1>
            <p className="text-sm text-gray-500">{user?.serviceCategory} Professional</p>
          </div>
          <Button onClick={logout} variant="outline" size="sm">Log Out</Button>
        </div>

        <Card className="p-12 text-center bg-white border-dashed border-2 border-gray-200">
          <h2 className="text-2xl font-medium text-gray-700 mb-2">Service Dashboard Coming Soon</h2>
          <p className="text-gray-500">Managing jobs, schedules, and earnings is not part of this MVP phase.</p>
        </Card>
      </div>
    </div>
  );
};
