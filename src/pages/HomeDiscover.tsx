import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MobileShell } from '../components/layout/MobileShell';
import { LocationModal } from '../components/location/LocationModal';
import { NotificationBell } from '../components/ui/NotificationToast';
import { Search, MapPin, Phone, Navigation, ArrowRight, Compass, Calendar, MessageSquare, User, Flame, Clock, LogOut, Zap } from 'lucide-react';


export const HomeDiscover: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'explore' | 'bookings' | 'messages' | 'profile'>('explore');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);

  const userName = user?.name ? user.name.split(' ')[0] : 'Alex';
  const userAddress = user?.address || 'Downtown District, City Center';

  const handleCategoryClick = (catName: string) => {
    navigate(`/services?category=${encodeURIComponent(catName)}`);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/services?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <MobileShell>
      {/* Location Modal */}
      <LocationModal 
        isOpen={isLocationModalOpen} 
        onClose={() => setIsLocationModalOpen(false)} 
      />

      {/* Full-Width Desktop / Web Top Header Navbar */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <div className="flex items-center space-x-2 font-extrabold text-slate-900 text-xl tracking-tight cursor-pointer" onClick={() => navigate('/home')}>
            <div className="w-8 h-8 rounded-xl bg-[#363BD9] flex items-center justify-center text-white text-sm font-bold shadow-xs">
              U
            </div>
            <span>UrbanServe</span>
          </div>

          {/* Service Location Selector */}
          <div 
            onClick={() => setIsLocationModalOpen(true)}
            className="flex items-center space-x-2 bg-indigo-50/70 border border-indigo-100 hover:border-indigo-300 shadow-2xs rounded-full px-3.5 py-1.5 text-xs font-medium text-slate-700 cursor-pointer transition-all"
          >
            <MapPin className="w-4 h-4 text-[#363BD9] shrink-0" />
            <div className="leading-none text-xs max-w-[180px] sm:max-w-[260px] truncate">
              <span className="text-slate-400 font-normal uppercase text-[9px] block">DELIVER & SERVICE TO</span>
              <span className="font-bold text-slate-900 flex items-center space-x-1 truncate">
                <span className="truncate">{userAddress}</span>
                <span className="text-[10px] text-slate-400 shrink-0">▼</span>
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/my-bookings')}
            className="hidden sm:flex items-center space-x-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <Calendar className="w-4 h-4 text-indigo-600" />
            <span>My Bookings</span>
          </button>

          <NotificationBell />

          <div className="flex items-center space-x-2 pl-2 border-l border-slate-200">

            <div className="w-9 h-9 rounded-full bg-[#363BD9] text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              {userName.charAt(0)}
            </div>
            <button 
              onClick={logout}
              title="Logout"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-red-50 hover:text-red-600 flex items-center justify-center text-slate-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Full-Width Web Dashboard Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Top Greeting & Search Banner Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="lg:col-span-8 space-y-4 z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-200 text-xs font-semibold">
              <span>Good morning, {userName} 👋</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight text-white">
              What do you need help with today?
            </h1>
            <p className="text-indigo-200 text-sm max-w-xl">
              Book verified home cleaning, handyman repairs, moving, and instant technician dispatches in minutes.
            </p>

            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center space-x-2 pt-2 max-w-2xl">
              <div className="flex-1 bg-white text-slate-900 border border-white/20 shadow-lg rounded-2xl px-4 py-3.5 flex items-center space-x-3 focus-within:ring-2 focus-within:ring-indigo-400 transition-all">
                <Search className="w-5 h-5 text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  placeholder="Search services (e.g. Deep clean, AC Repair, Plumbing...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-transparent text-sm text-slate-900 placeholder:text-slate-400 outline-none w-full font-medium"
                />
              </div>
              <button 
                type="submit"
                className="px-6 py-3.5 rounded-2xl bg-[#363BD9] hover:bg-[#282CC2] text-white font-bold text-sm flex items-center space-x-2 shadow-lg transition-all shrink-0"
              >
                <span>Find Pro</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="lg:col-span-4 hidden lg:flex justify-end relative z-10">
            <img 
              src="/images/clean_living_room.png" 
              alt="Clean living room" 
              className="w-72 h-48 rounded-2xl object-cover border-4 border-white/20 shadow-2xl rotate-1 hover:rotate-0 transition-transform"
            />
          </div>
        </div>

        {/* Emergency Quick Service Matching Radar Card */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600 text-white rounded-3xl p-6 sm:p-7 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-2 z-10 max-w-xl">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-extrabold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current animate-bounce" />
              <span>EMERGENCY 15-MIN DISPATCH</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Instant Pro Matching
            </h3>
            <p className="text-orange-100 text-xs sm:text-sm">
              Pipe burst, AC breakdown, or power cut? Radar scans all verified partners within 3 km for immediate dispatch.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              {['Plumbing Leak', 'Main Breaker Trip', 'AC Emergency', 'Lockout'].map((preset) => (
                <button
                  key={preset}
                  onClick={() => navigate('/quick-service')}
                  className="px-3 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/20 transition-all active:scale-95"
                >
                  ⚡ {preset}
                </button>
              ))}
            </div>
          </div>

          <div className="shrink-0 z-10 w-full md:w-auto">
            <button
              onClick={() => navigate('/quick-service')}
              className="w-full md:w-auto px-6 py-4 rounded-2xl bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-sm shadow-xl flex items-center justify-center space-x-2 transition-transform hover:scale-105 active:scale-95"
            >
              <span>Match Pro Nearby</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Job Tracking Card */}
        <div 
          onClick={() => navigate('/quick-service/track/active')}
          className="bg-[#1E2437] text-white rounded-3xl p-6 shadow-xl relative overflow-hidden space-y-4 cursor-pointer hover:opacity-[0.99] transition-opacity border border-slate-800"
        >
          {/* Top Row */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-blue-500 animate-ping"></span>
              <span className="text-xs font-extrabold tracking-wider text-blue-300 uppercase">LIVE JOB TRACKING</span>
            </div>
            <span className="px-3 py-1 rounded-full bg-[#363BD9] text-white text-xs font-bold shadow-xs">
              In 15 mins
            </span>
          </div>

          {/* Job Title & Progress */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
            <div>
              <h3 className="text-xl font-extrabold text-white tracking-tight">Deep Apartment Cleaning</h3>
              <p className="text-xs text-slate-300 mt-0.5">Technician en route to your address</p>
              <div className="w-full bg-slate-700/60 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-indigo-500 h-full w-2/3 rounded-full"></div>
              </div>
            </div>


            {/* Provider Section */}
            <div className="flex items-center justify-between md:justify-end space-x-4 pt-2 md:pt-0">
              <div className="flex items-center space-x-3">
                <img 
                  src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80" 
                  alt="Elena Ramos" 
                  className="w-12 h-12 rounded-full object-cover border-2 border-indigo-400 shadow-sm"
                />
                <div>
                  <h4 className="text-sm font-bold text-white leading-snug">Elena Ramos</h4>
                  <p className="text-xs text-slate-300">4.9 ★ · 340+ completed</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-2">
                <button 
                  onClick={(e) => { e.stopPropagation(); alert('Calling Elena Ramos...'); }}
                  className="w-10 h-10 rounded-full bg-slate-700/80 hover:bg-slate-700 flex items-center justify-center text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button 
                  onClick={(e) => { e.stopPropagation(); navigate('/quick-service/track/active'); }}
                  className="px-4 py-2.5 rounded-xl bg-[#363BD9] hover:bg-[#282CC2] text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all"
                >
                  <Navigation className="w-4 h-4 fill-current" />
                  <span>Track Live</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Categories Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-extrabold text-slate-900">Categories</h3>
            <button 
              onClick={() => navigate('/services')}
              className="text-sm font-bold text-[#363BD9] hover:underline"
            >
              View all
            </button>
          </div>

          {/* Categories Grid (Responsive 4 columns on web) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Category 1 */}
            <div 
              onClick={() => handleCategoryClick('Cleaning')}
              className="bg-[#4338CA] text-white p-5 rounded-3xl text-center shadow-md cursor-pointer flex flex-col items-center justify-between space-y-3 transition-transform hover:-translate-y-1 active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shadow-xs">
                🧹
              </div>
              <div>
                <div className="font-bold text-base leading-none">Cleaning</div>
                <div className="text-xs text-indigo-200 font-medium mt-1">Popular</div>
              </div>
            </div>

            {/* Category 2 */}
            <div 
              onClick={() => handleCategoryClick('Plumbing')}
              className="bg-white border border-slate-200 p-5 rounded-3xl text-center shadow-xs cursor-pointer flex flex-col items-center justify-between space-y-3 hover:border-indigo-300 hover:-translate-y-1 transition-all active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-2xs">
                🔧
              </div>
              <div>
                <div className="font-bold text-base text-slate-900 leading-none">Plumbing</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Handyman</div>
              </div>
            </div>

            {/* Category 3 */}
            <div 
              onClick={() => handleCategoryClick('Electrical')}
              className="bg-white border border-slate-200 p-5 rounded-3xl text-center shadow-xs cursor-pointer flex flex-col items-center justify-between space-y-3 hover:border-indigo-300 hover:-translate-y-1 transition-all active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-2xs">
                ⚡
              </div>
              <div>
                <div className="font-bold text-base text-slate-900 leading-none">Electrical</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Certified</div>
              </div>
            </div>

            {/* Category 4 */}
            <div 
              onClick={() => handleCategoryClick('AC & Repair')}
              className="bg-white border border-slate-200 p-5 rounded-3xl text-center shadow-xs cursor-pointer flex flex-col items-center justify-between space-y-3 hover:border-indigo-300 hover:-translate-y-1 transition-all active:scale-95"
            >
              <div className="w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center text-2xl shadow-2xs">
                🌀
              </div>
              <div>
                <div className="font-bold text-base text-slate-900 leading-none">AC & Repair</div>
                <div className="text-xs text-slate-500 font-medium mt-1">Seasonal</div>
              </div>
            </div>
          </div>
        </div>

        {/* Promo Special Banner */}
        <div className="bg-indigo-50/80 border border-indigo-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between shadow-xs gap-6">
          <div className="space-y-3 flex-1">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-800 text-xs font-bold tracking-wider uppercase">
              <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
              <span>WEEKEND SPECIAL</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
              Spring Reset Sale
            </h2>

            <p className="text-sm text-slate-600 leading-relaxed max-w-xl">
              Get 20% off deep home cleanings with verified pros this weekend. Use code <span className="font-bold text-slate-900 bg-white px-2 py-0.5 rounded border border-indigo-200 shadow-2xs">CLEAN20</span> at checkout.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <span className="text-xs text-slate-500 font-medium flex items-center space-x-1.5">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Ends Sunday midnight</span>
              </span>

              <button 
                onClick={() => navigate('/services')}
                className="px-5 py-2.5 rounded-xl bg-[#363BD9] hover:bg-[#282CC2] text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-md transition-all"
              >
                <span>Claim Deal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          <img 
            src="/images/clean_living_room.png" 
            alt="Living room sale" 
            className="w-full sm:w-64 h-48 rounded-2xl object-cover shadow-sm border-4 border-white shrink-0"
          />
        </div>
      </main>

      {/* Mobile Bottom Bar (Visible on mobile screens) */}
      <nav className="sm:hidden bg-white border-t border-slate-200 px-3 py-2 flex items-center justify-around z-40 sticky bottom-0">
        <button 
          onClick={() => setActiveTab('explore')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'explore' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Compass className="w-5 h-5" />
          <span className="text-[10px]">Explore</span>
        </button>

        <button 
          onClick={() => { setActiveTab('bookings'); navigate('/my-bookings'); }}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'bookings' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <Calendar className="w-5 h-5" />
          <span className="text-[10px]">Bookings</span>
        </button>

        <button 
          onClick={() => setActiveTab('messages')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl transition-all ${
            activeTab === 'messages' ? 'text-indigo-600 font-bold' : 'text-slate-500 font-medium hover:text-slate-800'
          }`}
        >
          <MessageSquare className="w-5 h-5" />
          <span className="text-[10px]">Messages</span>
        </button>

        <button 
          onClick={() => setActiveTab('profile')}
          className={`flex flex-col items-center space-y-1 p-1.5 rounded-xl dashed-circle-border px-2 transition-all ${
            activeTab === 'profile' ? 'text-indigo-600 font-bold' : 'text-slate-600 font-semibold'
          }`}
        >
          <User className="w-5 h-5" />
          <span className="text-[10px]">Profile</span>
        </button>
      </nav>
    </MobileShell>
  );
};
