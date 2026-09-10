import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { MobileShell } from '../../../components/layout/MobileShell';
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, LogIn, CheckCircle2 } from 'lucide-react';

export const CustomerSignup: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const passwordVal = watch('password') || '';

  const calculatePasswordStrength = (pass: string) => {
    let score = 0;
    if (pass.length >= 6) score++;
    if (pass.length >= 8) score++;
    if (/\d/.test(pass)) score++;
    if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score++;
    return score;
  };

  const strengthScore = calculatePasswordStrength(passwordVal);

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      if (isLoginMode) {
        await login(data.email, data.password, 'customer');
      } else {
        await signup(data, 'customer');
      }
      navigate('/home');
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileShell>
      {/* Top Website Navigation */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/')}
            className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-slate-700 dashed-circle-border hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-xl tracking-tight">
            <div className="w-8 h-8 rounded-xl bg-[#363BD9] flex items-center justify-center text-white text-sm font-bold shadow-xs">
              U
            </div>
            <span>UrbanServe</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
          <span className="text-slate-600 hidden sm:inline">{isLoginMode ? "Don't have an account?" : "Already registered?"}</span>
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {isLoginMode ? 'Sign Up' : 'Log In'}
          </button>
        </div>
      </header>

      {/* Main Full-Width Section */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hero Feature & Social Proof */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold tracking-wider uppercase">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>VERIFIED LOCAL PROS</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Welcome to effortless care.
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Top-rated cleaners, handymen & techs on speed dial. Book trusted local services in seconds.
              </p>

              <div className="pt-2 flex items-center justify-center">
                <img 
                  src="/images/service_pro.png" 
                  alt="Service Technician" 
                  className="w-full max-w-[280px] h-64 rounded-2xl object-cover border-4 border-white shadow-md"
                />
              </div>

              <div className="bg-white/90 backdrop-blur-xs rounded-2xl p-4 border border-indigo-100 flex items-center space-x-3 text-xs">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center font-bold text-base shrink-0">
                  🛡️
                </div>
                <div>
                  <div className="font-bold text-slate-900">256-bit Encryption</div>
                  <div className="text-slate-500">Bank-grade security protects your bookings</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form Container */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Mode Switcher Tabs */}
            <div className="bg-indigo-100/70 p-1.5 rounded-2xl flex items-center text-xs sm:text-sm font-semibold max-w-sm">
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  !isLoginMode ? 'bg-white text-indigo-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-4 h-4 text-indigo-600" />
                <span>Sign Up</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`flex-1 py-2.5 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  isLoginMode ? 'bg-white text-indigo-950 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <LogIn className="w-4 h-4 text-indigo-600" />
                <span>Log In</span>
              </button>
            </div>

            {/* Form Titles */}
            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLoginMode ? 'Customer Login' : 'Create Customer Account'}
              </h1>
              <p className="text-sm text-slate-500">
                {isLoginMode ? 'Sign in to access your bookings and instant requests.' : 'Find and book top-rated local services in seconds.'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-900">Full Name</label>
                  <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all">
                    <User className="w-5 h-5 text-indigo-600 shrink-0" />
                    <input 
                      type="text" 
                      placeholder="e.g. Alex Morgan"
                      className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                      {...register('name', { required: !isLoginMode ? 'Name is required' : false })}
                    />
                  </div>
                  {errors.name && <span className="text-xs text-red-500">{errors.name.message as string}</span>}
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-900">Email Address</label>
                <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                  <input 
                    type="email" 
                    placeholder="alex@example.com"
                    className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
                {errors.email && <span className="text-xs text-red-500">{errors.email.message as string}</span>}
              </div>

              {!isLoginMode && (
                <div className="space-y-1.5">
                  <label className="text-xs sm:text-sm font-bold text-slate-900">Phone Number</label>
                  <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl p-2 flex items-center space-x-2 transition-all">
                    <div className="flex items-center space-x-1 bg-white border border-indigo-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                      <Phone className="w-4 h-4 text-slate-500" />
                      <span>+1</span>
                      <span className="text-[10px] text-slate-400">▼</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="(555) 000-0000"
                      className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium px-2"
                      {...register('phone', { required: !isLoginMode ? 'Phone number required' : false })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs sm:text-sm font-bold text-slate-900">Password</label>
                <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] focus-within:ring-2 focus-within:ring-indigo-500/20 rounded-2xl px-4 py-3 flex items-center space-x-3 transition-all">
                  <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create a secure password"
                    className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                    {...register('password', { required: 'Password is required' })}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {!isLoginMode && (
                <div className="space-y-1.5 pt-1">
                  <div className="grid grid-cols-4 gap-2">
                    {[1, 2, 3, 4].map((level) => (
                      <div 
                        key={level}
                        className={`h-2 rounded-full transition-all ${
                          strengthScore >= level 
                            ? (strengthScore >= 3 ? 'bg-[#363BD9]' : 'bg-amber-500') 
                            : 'bg-indigo-100'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">At least 8 characters & a number</p>
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4">
                <div className="p-1 rounded-3xl dashed-active-border">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#363BD9] hover:bg-[#282CC2] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
                  >
                    <span>{isLoading ? 'Processing...' : (isLoginMode ? 'Log In' : 'Create Account')}</span>
                    <ArrowRight className="w-5 h-5 stroke-[2.5]" />
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </main>
    </MobileShell>
  );
};
