import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileShell } from '../../components/layout/MobileShell';
import { Zap, Home, Wrench, Check, ArrowRight, ShieldCheck, Clock, Navigation, Calendar, Sparkles, Lock } from 'lucide-react';

export const ChooseLoginType: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<'customer' | 'service_team'>('customer');

  const handleContinue = () => {
    if (selectedRole === 'customer') {
      navigate('/auth/customer/signup');
    } else {
      navigate('/auth/service-team/signup');
    }
  };

  const handleLogIn = () => {
    if (selectedRole === 'customer') {
      navigate('/auth/customer/login');
    } else {
      navigate('/auth/service-team/login');
    }
  };

  return (
    <MobileShell>
      {/* Top Website Header */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-xl tracking-tight">
          <div className="w-8 h-8 rounded-xl bg-[#363BD9] flex items-center justify-center text-white text-sm font-bold shadow-xs">
            U
          </div>
          <span>UrbanServe</span>
        </div>

        <div className="flex items-center space-x-3 text-xs sm:text-sm font-semibold">
          <span className="text-slate-600 hidden sm:inline">Already have an account?</span>
          <button
            onClick={handleLogIn}
            className="px-3.5 py-1.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 transition-colors"
          >
            Log In
          </button>
        </div>
      </header>

      {/* Main Full-Width Content Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex flex-col justify-center">
        {/* Header Section */}
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-8 sm:mb-12">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 font-bold text-xs tracking-wider uppercase shadow-2xs">
            <div className="w-4 h-4 rounded-full bg-[#363BD9] flex items-center justify-center text-white">
              <Zap className="w-2.5 h-2.5 fill-current" />
            </div>
            <span>WELCOME TO URBANSERVE</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
            How are you joining us today?
          </h1>

          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Choose your pathway to get started with seamless on-demand everyday home experiences.
          </p>
        </div>

        {/* Options Grid (Side-by-side on desktop, stacked on mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto w-full mb-8">
          {/* Option 1: Customer Card */}
          <div 
            onClick={() => setSelectedRole('customer')}
            className={`rounded-3xl p-6 sm:p-7 transition-all duration-200 cursor-pointer relative bg-white shadow-sm flex flex-col justify-between ${
              selectedRole === 'customer' 
                ? 'dashed-active-border bg-white shadow-xl ring-4 ring-indigo-500/10' 
                : 'border border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              {/* Top Bar inside card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#363BD9] flex items-center justify-center shadow-2xs">
                    <Home className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs">
                    For Residents
                  </span>
                </div>
                
                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === 'customer' ? 'bg-[#363BD9] text-white shadow-xs' : 'bg-slate-100 border border-slate-300'
                }`}>
                  {selectedRole === 'customer' && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Body */}
              <h2 className="text-xl font-bold text-slate-900 mb-2">I'm a Customer</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Book trusted on-demand home cleaning, repairs, moving & local everyday services in minutes.
              </p>

              {/* Rating Highlight Box */}
              <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-3.5 flex items-center space-x-3.5 mb-5">
                <img 
                  src="/images/clean_living_room.png" 
                  alt="Clean home" 
                  className="w-14 h-14 rounded-xl object-cover shadow-xs shrink-0"
                />
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                    <span className="text-amber-600">★ 4.92 / 5</span>
                    <span className="text-slate-500 font-normal text-xs">(14k+ completed)</span>
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">Cleaners & Handymen available today</div>
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Instant Booking</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Verified Pros</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <Navigation className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Live Tracking</span>
                </span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
              <span className="font-bold text-[#363BD9] flex items-center space-x-1.5">
                <span>Explore Services</span>
                <ArrowRight className="w-4 h-4" />
              </span>

              {/* Overlapping Avatars */}
              <div className="flex -space-x-2 overflow-hidden">
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80" alt="Avatar 1" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80" alt="Avatar 2" />
                <img className="inline-block h-7 w-7 rounded-full ring-2 ring-white object-cover" src="/images/service_pro.png" alt="Avatar 3" />
              </div>
            </div>
          </div>

          {/* Option 2: Service Team Card */}
          <div 
            onClick={() => setSelectedRole('service_team')}
            className={`rounded-3xl p-6 sm:p-7 transition-all duration-200 cursor-pointer relative bg-white shadow-sm flex flex-col justify-between ${
              selectedRole === 'service_team' 
                ? 'dashed-active-border bg-white shadow-xl ring-4 ring-indigo-500/10' 
                : 'border border-slate-200 hover:border-slate-300 hover:shadow-md'
            }`}
          >
            <div>
              {/* Top Bar inside card */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-[#363BD9] flex items-center justify-center shadow-2xs">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 font-semibold text-xs">
                    For Technicians & Pros
                  </span>
                </div>

                <div className={`w-7 h-7 rounded-full flex items-center justify-center transition-colors ${
                  selectedRole === 'service_team' ? 'bg-[#363BD9] text-white shadow-xs' : 'bg-slate-100 border border-slate-300'
                }`}>
                  {selectedRole === 'service_team' && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </div>

              {/* Title & Body */}
              <h2 className="text-xl font-bold text-slate-900 mb-2">I'm on the Service Team</h2>
              <p className="text-slate-600 text-sm leading-relaxed mb-5">
                Grow your local service business, manage client bookings, set your rates & get paid weekly.
              </p>

              {/* Earnings Highlight Box */}
              <div className="bg-indigo-50/70 border border-indigo-100/90 rounded-2xl p-3.5 flex items-center space-x-3.5 mb-5">
                <div className="w-12 h-12 bg-[#363BD9] rounded-xl flex flex-col items-center justify-center text-white shrink-0 shadow-xs">
                  <Zap className="w-5 h-5 fill-current" />
                  <span className="text-[8px] font-bold tracking-tighter">WEEKLY</span>
                </div>
                <div className="text-xs sm:text-sm">
                  <div className="font-bold text-slate-900">
                    Avg. $1,420 / week <span className="text-slate-500 font-normal text-xs">• Top earners</span>
                  </div>
                  <div className="text-slate-600 text-xs mt-0.5">Keep 100% of tips + fast payouts</div>
                </div>
              </div>

              {/* Feature Badges */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Flexible Hours</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Instant Payouts</span>
                </span>
                <span className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-800 text-xs font-medium flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#363BD9]" />
                  <span>Direct Leads</span>
                </span>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-sm">
              <span className="font-bold text-[#363BD9] flex items-center space-x-1.5">
                <span>Join As A Partner</span>
                <ArrowRight className="w-4 h-4" />
              </span>

              <span className="text-slate-500 text-xs flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>Secure onboarding</span>
              </span>
            </div>
          </div>
        </div>

        {/* Primary Action Button & Footer */}
        <div className="max-w-md mx-auto w-full space-y-4">
          <div className="p-1 rounded-3xl dashed-active-border">
            <button
              onClick={handleContinue}
              className="w-full bg-[#363BD9] hover:bg-[#282CC2] active:scale-[0.99] text-white py-4 px-6 rounded-2xl font-bold text-base sm:text-lg flex items-center justify-center space-x-2 transition-all shadow-lg hover:shadow-xl"
            >
              <span>Continue as {selectedRole === 'customer' ? 'Customer' : 'Service Team'}</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          <div className="text-center text-sm text-slate-600">
            <span>Already have an account? </span>
            <button
              onClick={handleLogIn}
              className="font-bold text-indigo-600 hover:underline border border-dashed border-indigo-400 px-2 py-0.5 rounded"
            >
              Log In
            </button>
          </div>
        </div>
      </main>
    </MobileShell>
  );
};
