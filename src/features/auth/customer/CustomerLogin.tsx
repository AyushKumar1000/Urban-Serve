import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { MobileShell } from '../../../components/layout/MobileShell';
import { ChevronLeft, User, Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, LogIn, CheckCircle2 } from 'lucide-react';

export const CustomerLogin: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      await login(data.email, data.password, 'customer');
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileShell>
      <div className="p-4 sm:p-5 flex flex-col justify-between min-h-full bg-slate-50 text-slate-900 space-y-4">
        {/* Top Header Nav */}
        <div className="flex items-center justify-between pt-1">
          <button 
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 dashed-circle-border hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-1.5 font-extrabold text-slate-900 text-lg tracking-tight">
            <span>UrbanServe</span>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Welcome Back</span>
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
              <User className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Hero Card Banner */}
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between shadow-xs">
          <div className="space-y-1.5 pr-2">
            <div className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold tracking-wider uppercase">
              <CheckCircle2 className="w-3 h-3 text-indigo-600" />
              <span>VERIFIED LOCAL PROS</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
              Welcome to effortless care.
            </h2>
            <p className="text-xs text-slate-600 leading-snug">
              Top-rated cleaners, handymen & techs on speed dial.
            </p>
          </div>

          <img 
            src="/images/service_pro.png" 
            alt="Service Technician" 
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white shadow-xs shrink-0"
          />
        </div>

        {/* Mode Switcher Tabs */}
        <div className="bg-indigo-100/70 p-1 rounded-2xl flex items-center text-xs font-semibold">
          <button
            type="button"
            onClick={() => navigate('/auth/customer/signup')}
            className="flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all text-slate-600 hover:text-slate-900"
          >
            <User className="w-3.5 h-3.5 text-indigo-600" />
            <span>Sign Up</span>
          </button>
          <button
            type="button"
            className="flex-1 py-2 rounded-xl flex items-center justify-center space-x-1.5 transition-all bg-white text-indigo-950 shadow-xs font-bold"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-600" />
            <span>Log In</span>
          </button>
        </div>

        {/* Title */}
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Customer Login
          </h1>
          <p className="text-xs text-slate-500">
            Sign in to access your bookings and requests.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
            {error}
          </div>
        )}

        {/* Form Fields */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5 flex-1">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-800">Email Address</label>
            <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl px-3 py-2.5 flex items-center space-x-2.5 transition-all">
              <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
              <input 
                type="email" 
                placeholder="alex@example.com"
                className="bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                {...register('email', { required: 'Email is required' })}
              />
            </div>
            {errors.email && <span className="text-[11px] text-red-500">{errors.email.message as string}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-slate-800">Password</label>
            <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 rounded-xl px-3 py-2.5 flex items-center space-x-2.5 transition-all">
              <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="Enter your password"
                className="bg-transparent text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                {...register('password', { required: 'Password is required' })}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Security Card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-3 flex items-center space-x-3 text-xs">
            <div className="w-8 h-8 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <p className="text-slate-700 text-[11px] leading-snug">
              256-bit bank-grade encryption protects your private bookings.
            </p>
          </div>

          {/* Primary Action */}
          <div className="pt-2">
            <div className="p-0.5 rounded-2xl dashed-active-border">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#363BD9] hover:bg-[#282CC2] active:scale-[0.99] text-white py-3.5 px-4 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center space-x-2 transition-all shadow-md disabled:opacity-75"
              >
                <span>{isLoading ? 'Loggin in...' : 'Log In'}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        </form>
      </div>
    </MobileShell>
  );
};
