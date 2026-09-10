import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';

export const ForgotPasswordStub: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Link to="/" className="mb-8 text-2xl font-bold text-primary-600">UrbanServe</Link>
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
          <p className="text-sm text-gray-500 mt-1">We'll send you a link to reset it</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="p-4 bg-green-50 text-green-700 rounded-lg">
              If an account exists for that email, a password reset link has been sent.
            </div>
            <Link to="/">
              <Button className="w-full mt-4">Return to Login</Button>
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            <Input label="Email Address" type="email" required />
            <Button type="submit" className="w-full">Send Reset Link</Button>
            <div className="text-center mt-4">
              <Link to="/" className="text-sm text-primary-600 hover:text-primary-500">Back to Login</Link>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
};
