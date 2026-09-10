import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { Card } from '../../../components/ui/Card';

export const ServiceTeamLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password, 'service_team');
      navigate('/service-dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link to="/" className="mb-8 text-2xl font-bold text-orange-600">UrbanServe for Pros</Link>
      <Card className="w-full max-w-md p-8 border-t-4 border-t-orange-500">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Professional Login</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your service requests</p>
        </div>
        
        {error && <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm rounded-lg">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input 
            label="Email Address" 
            type="email" 
            {...register('email', { required: 'Email is required' })}
            error={errors.email?.message as string}
          />
          <Input 
            label="Password" 
            type="password" 
            {...register('password', { required: 'Password is required' })}
            error={errors.password?.message as string}
          />
          
          <div className="flex items-center justify-end">
            <Link to="/auth/forgot-password" className="text-sm font-medium text-orange-600 hover:text-orange-500">
              Forgot your password?
            </Link>
          </div>

          <Button type="submit" className="w-full !bg-orange-600 hover:!bg-orange-700 focus:ring-orange-500" isLoading={isLoading}>
            Log In
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Want to join our team?{' '}
          <Link to="/auth/service-team/signup" className="font-medium text-orange-600 hover:text-orange-500">
            Apply now
          </Link>
        </p>
      </Card>
    </div>
  );
};
