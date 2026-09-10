import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../../context/AuthContext';
import { MobileShell } from '../../../components/layout/MobileShell';
import { ChevronLeft, User, Mail, Phone, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, LogIn, CheckCircle2 } from 'lucide-react';

const TRADE_CATEGORIES = [
  { id: 'Home Cleaning', label: 'Home Cleaning', icon: '🧹' },
  { id: 'Plumbing & Heating', label: 'Plumbing & Heating', icon: '🔧' },
  { id: 'Electrical', label: 'Electrical', icon: '⚡' },
  { id: 'Moving & Lifting', label: 'Moving & Lifting', icon: '🚚' },
  { id: 'Appliance Repair', label: 'Appliance Repair', icon: '🔧' },
  { id: 'Gardening / Yard', label: 'Gardening / Yard', icon: '🪴' },
];

export const ServiceTeamSignup: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      serviceCategory: 'Home Cleaning'
    }
  });
  const { signup, login } = useAuth();
  const navigate = useNavigate();
  const [isLoginMode, setIsLoginMode] = useState(false);
  const [selectedTrade, setSelectedTrade] = useState('Home Cleaning');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTradeSelect = (tradeId: string) => {
    setSelectedTrade(tradeId);
    setValue('serviceCategory', tradeId);
  };

  const onSubmit = async (data: any) => {
    try {
      setIsLoading(true);
      setError('');
      if (isLoginMode) {
        await login(data.email, data.password, 'service_team');
      } else {
        await signup({ ...data, serviceCategory: selectedTrade }, 'service_team');
      }
      navigate('/service-dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MobileShell>
      {/* Top Navigation */}
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
            <span>UrbanServe Pros</span>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold">
          <span className="text-slate-600 hidden sm:inline">{isLoginMode ? "Need to register?" : "Already a partner?"}</span>
          <button
            onClick={() => setIsLoginMode(!isLoginMode)}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            {isLoginMode ? 'Apply Now' : 'Log In'}
          </button>
        </div>
      </header>

      {/* Main Full-Width Content */}
      <main className="flex-1 w-full max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Hero Partner Highlights */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
              <div className="flex flex-wrap gap-2">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600" />
                  <span>UrbanServe Pro Partner</span>
                </div>

                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span>Live Onboarding</span>
                </div>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                Join the Service Team
              </h2>

              <p className="text-sm text-slate-600 leading-relaxed">
                Connect with thousands of local clients looking for your trade. Get instant booking dispatch, flexible hours, and weekly payouts.
              </p>

              <div className="bg-white/90 rounded-2xl p-4 border border-indigo-100 space-y-3">
                <div className="flex items-center space-x-3 text-xs">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-base shrink-0">
                    ⚡
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Avg. $1,420 / week</div>
                    <div className="text-slate-500">Keep 100% of tips + fast payouts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Service Team Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/90 shadow-sm space-y-6">
            {/* Mode Switcher */}
            <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm font-semibold max-w-sm">
              <button
                type="button"
                onClick={() => setIsLoginMode(false)}
                className={`py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  !isLoginMode ? 'bg-[#363BD9] text-white shadow-md font-bold' : 'bg-indigo-100/70 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                <User className="w-4 h-4" />
                <span>Sign Up</span>
              </button>
              <button
                type="button"
                onClick={() => setIsLoginMode(true)}
                className={`py-2.5 px-4 rounded-xl flex items-center justify-center space-x-2 transition-all ${
                  isLoginMode ? 'bg-[#363BD9] text-white shadow-md font-bold' : 'bg-indigo-100/70 text-indigo-900 hover:bg-indigo-100'
                }`}
              >
                <LogIn className="w-4 h-4" />
                <span>Log In</span>
              </button>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                {isLoginMode ? 'Service Team Login' : 'Partner Sign Up'}
              </h1>
              <p className="text-sm text-slate-500">
                {isLoginMode ? 'Log in to view incoming job leads and manage schedule.' : 'Fill in your details and select your primary trade.'}
              </p>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-sm rounded-2xl">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {!isLoginMode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="font-bold text-slate-900">Full Name</label>
                    <span className="text-slate-400 font-medium text-xs">Required</span>
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] rounded-2xl px-4 py-3 flex items-center space-x-3">
                    <span className="text-base">🪪</span>
                    <input 
                      type="text" 
                      placeholder="e.g. Jordan Lee"
                      className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                      {...register('name', { required: !isLoginMode ? 'Name is required' : false })}
                    />
                  </div>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <label className="font-bold text-slate-900">Email Address</label>
                  {!isLoginMode && <span className="text-slate-400 font-medium text-xs">Business preferred</span>}
                </div>
                <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] rounded-2xl px-4 py-3 flex items-center space-x-3">
                  <Mail className="w-5 h-5 text-indigo-600 shrink-0" />
                  <input 
                    type="email" 
                    placeholder="jordan.pro@example.com"
                    className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                    {...register('email', { required: 'Email is required' })}
                  />
                </div>
              </div>

              {!isLoginMode && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="font-bold text-slate-900">Phone Number</label>
                    <span className="text-slate-400 font-medium text-xs">SMS dispatch alerts</span>
                  </div>
                  <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] rounded-2xl p-2 flex items-center space-x-2">
                    <div className="flex items-center space-x-1 bg-white border border-indigo-100 rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-2xs">
                      <span>+1</span>
                      <span className="text-[10px] text-slate-400">▼</span>
                    </div>
                    <input 
                      type="tel" 
                      placeholder="(555) 234-5678"
                      className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium px-2"
                      {...register('phone', { required: !isLoginMode ? 'Phone number required' : false })}
                    />
                  </div>
                </div>
              )}

              {/* Trade Selection */}
              {!isLoginMode && (
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs sm:text-sm">
                    <label className="font-bold text-slate-900">Primary Trade Category</label>
                    <span className="text-indigo-600 font-semibold text-xs cursor-pointer">Select trade</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {TRADE_CATEGORIES.map((trade) => (
                      <button
                        key={trade.id}
                        type="button"
                        onClick={() => handleTradeSelect(trade.id)}
                        className={`p-3 rounded-2xl text-left font-semibold text-xs sm:text-sm transition-all flex items-center space-x-2 border ${
                          selectedTrade === trade.id
                            ? 'bg-[#363BD9] text-white border-[#363BD9] shadow-sm'
                            : 'bg-indigo-50/60 text-slate-800 border-indigo-100/80 hover:bg-indigo-100/70'
                        }`}
                      >
                        <span className="text-base">{trade.icon}</span>
                        <span className="truncate">{trade.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-1.5 pt-1">
                <label className="text-xs sm:text-sm font-bold text-slate-900">Password</label>
                <div className="bg-indigo-50/50 border border-indigo-100 focus-within:border-[#363BD9] rounded-2xl px-4 py-3 flex items-center space-x-3">
                  <Lock className="w-5 h-5 text-indigo-600 shrink-0" />
                  <input 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create strong password"
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

              {/* Action */}
              <div className="pt-4">
                <div className="p-1 rounded-3xl dashed-active-border">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-[#363BD9] hover:bg-[#282CC2] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-2 transition-all shadow-md hover:shadow-lg disabled:opacity-75"
                  >
                    <span>{isLoading ? 'Submitting...' : (isLoginMode ? 'Log In to Dashboard' : 'Create Partner Account')}</span>
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
