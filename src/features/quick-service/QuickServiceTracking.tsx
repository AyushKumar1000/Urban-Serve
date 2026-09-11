import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuickServiceRequestApi, updateQuickServiceStatusApi } from '../../api/quickservice';
import { QuickServiceRequest } from '../../types';
import { MobileShell } from '../../components/layout/MobileShell';
import { ChevronLeft, Phone, MessageSquare, ShieldCheck, Navigation, Clock, MapPin, Share2, Star, Play, RotateCcw } from 'lucide-react';

export const QuickServiceTracking: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<QuickServiceRequest | null>(null);
  
  // Animation progress along route (0% = at partner start, 100% = arrived at customer location)
  const [progressPercent, setProgressPercent] = useState(25);
  const [isAutoMoving, setIsAutoMoving] = useState(true);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { sender: 'partner', text: "Hi! I've picked up the specialized cleaning kit and I'm en route to your address now." },
  ]);
  const [newMessage, setNewMessage] = useState('');

  const fetchRequest = () => {
    if (id) {
      getQuickServiceRequestApi(id).then(setRequest).catch(console.error);
    }
  };

  useEffect(() => {
    fetchRequest();
  }, [id]);

  // Simulate smooth Swiggy/Zomato style partner movement toward user
  useEffect(() => {
    if (!isAutoMoving || !request || request.status === 'completed') return;

    const interval = setInterval(() => {
      setProgressPercent((prev) => {
        if (prev >= 100) {
          setIsAutoMoving(false);
          return 100;
        }
        return prev + 1;
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isAutoMoving, request]);

  if (!request) {
    return (
      <MobileShell>
        <div className="min-h-screen flex items-center justify-center p-8 bg-slate-50 text-slate-500 font-medium">
          Loading live map & tracking...
        </div>
      </MobileShell>
    );
  }

  // Calculate live dynamic distance & ETA based on animation progress
  const initialDistance = request.distanceKm || 1.4;
  const currentDistanceKm = Math.max(0, (initialDistance * (1 - progressPercent / 100))).toFixed(1);
  const currentEtaMins = Math.max(1, Math.round(12 * (1 - progressPercent / 100)));

  // Simulated GPS coordinates on SVG map
  // Partner starts at (80, 80) and moves toward Customer at (320, 240)
  const startX = 80;
  const startY = 80;
  const targetX = 320;
  const targetY = 240;

  const partnerX = startX + (targetX - startX) * (progressPercent / 100);
  const partnerY = startY + (targetY - startY) * (progressPercent / 100);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim()) {
      setChatMessages((prev) => [...prev, { sender: 'user', text: newMessage.trim() }]);
      setNewMessage('');
      setTimeout(() => {
        setChatMessages((prev) => [...prev, { sender: 'partner', text: "Got it! I'm on the main avenue and arriving shortly." }]);
      }, 1200);
    }
  };

  const handleSimulateStatus = async (nextStatus: QuickServiceRequest['status']) => {
    if (!request) return;
    await updateQuickServiceStatusApi(request.id, nextStatus);
    fetchRequest();
    if (nextStatus === 'en_route') setProgressPercent(40);
    if (nextStatus === 'in_progress') setProgressPercent(100);
    if (nextStatus === 'completed') setProgressPercent(100);
  };

  return (
    <MobileShell>
      {/* Top Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/home')}
            className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center space-x-1.5 font-extrabold text-slate-900 text-base leading-tight">
              <span>Live Order & Service Tracking</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <p className="text-xs text-slate-500">Order ID: #{request.id.toUpperCase()}</p>
          </div>
        </div>

        <button 
          onClick={() => alert(`Share Tracking Link: http://localhost:5173/quick-service/track/${request.id}`)}
          className="flex items-center space-x-1.5 px-3 py-1.5 rounded-full bg-indigo-50 text-[#363BD9] text-xs font-bold hover:bg-indigo-100 transition-colors"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share Tracking</span>
        </button>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Interactive Swiggy/Zomato Style Live Map Canvas Card */}
        <div className="bg-slate-900 rounded-3xl overflow-hidden shadow-2xl border border-slate-800 relative min-h-[380px] sm:min-h-[440px] flex flex-col justify-between">
          
          {/* SVG Map Grid & Moving Partner Route */}
          <div className="absolute inset-0 bg-[#0F172A] overflow-hidden">
            {/* SVG Roads & Markers */}
            <svg className="w-full h-full" viewBox="0 0 400 320" preserveAspectRatio="xMidYMid slice">
              <defs>
                <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#4F46E5" />
                  <stop offset="100%" stopColor="#10B981" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* City Map Roads Grid */}
              <path d="M 0 100 Q 200 60 400 120" stroke="#1E293B" strokeWidth="24" fill="none" />
              <path d="M 0 100 Q 200 60 400 120" stroke="#334155" strokeWidth="18" fill="none" />

              <path d="M 80 0 Q 140 160 320 320" stroke="#1E293B" strokeWidth="28" fill="none" />
              <path d="M 80 0 Q 140 160 320 320" stroke="#334155" strokeWidth="20" fill="none" />

              <path d="M 50 240 Q 220 200 400 260" stroke="#1E293B" strokeWidth="22" fill="none" />
              <path d="M 50 240 Q 220 200 400 260" stroke="#334155" strokeWidth="14" fill="none" />

              {/* Street Names */}
              <text x="20" y="85" fill="#64748B" fontSize="10" fontWeight="bold">Park Avenue</text>
              <text x="220" y="160" fill="#64748B" fontSize="10" fontWeight="bold">Metro Boulevard</text>
              <text x="260" y="280" fill="#64748B" fontSize="10" fontWeight="bold">Sector 12 Main Rd</text>

              {/* Traveled & Active Route Line */}
              <line 
                x1={startX} 
                y1={startY} 
                x2={targetX} 
                y2={targetY} 
                stroke="url(#routeGradient)" 
                strokeWidth="5" 
                strokeDasharray="6 4"
                filter="url(#glow)"
              />

              {/* Customer House Target Marker (Destination) */}
              <g transform={`translate(${targetX}, ${targetY})`}>
                <circle r="18" fill="#363BD9" fillOpacity="0.2" className="animate-ping" />
                <circle r="14" fill="#363BD9" stroke="#FFFFFF" strokeWidth="2.5" />
                <text x="-6" y="4" fill="#FFFFFF" fontSize="12">🏠</text>
              </g>

              {/* Moving Service Partner Marker (Swiggy / Zomato Delivery Pro) */}
              <g transform={`translate(${partnerX}, ${partnerY})`} className="transition-all duration-300 ease-linear">
                <circle r="22" fill="#10B981" fillOpacity="0.3" className="animate-ping" />
                <circle r="16" fill="#10B981" stroke="#FFFFFF" strokeWidth="3" />
                <text x="-7" y="5" fill="#FFFFFF" fontSize="13">🛵</text>
              </g>
            </svg>
          </div>

          {/* Top Live Distance Floating Overlay */}
          <div className="relative z-10 p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/90 to-transparent">
            <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-2xl px-4 py-2.5 text-white flex items-center space-x-3 shadow-lg">
              <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
                <Navigation className="w-5 h-5 fill-current animate-pulse" />
              </div>
              <div>
                <div className="text-xs text-slate-300">Distance to Customer</div>
                <div className="font-extrabold text-base text-white flex items-center space-x-1.5">
                  <span>{currentDistanceKm} km away</span>
                  <span className="text-xs font-normal text-emerald-400">• Moving</span>
                </div>
              </div>
            </div>

            {/* Live ETA Box */}
            <div className="bg-[#363BD9] text-white rounded-2xl px-4 py-2.5 shadow-lg border border-indigo-400/30 text-right">
              <div className="text-[10px] text-indigo-200 uppercase font-bold tracking-wider">Estimated Arrival</div>
              <div className="text-lg font-extrabold flex items-center space-x-1 justify-end">
                <Clock className="w-4 h-4" />
                <span>{currentEtaMins} Mins</span>
              </div>
            </div>
          </div>

          {/* Bottom Live Route Status Bar */}
          <div className="relative z-10 p-4 bg-slate-950/80 backdrop-blur-md border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-emerald-400" />
              <span>Delivering to: <strong className="text-white">{request.location}</strong></span>
            </div>

            <button 
              onClick={() => setIsAutoMoving(!isAutoMoving)}
              className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-indigo-300 font-bold flex items-center space-x-1 border border-slate-700"
            >
              {isAutoMoving ? <RotateCcw className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              <span>{isAutoMoving ? 'Pause Movement' : 'Play Live Motion'}</span>
            </button>
          </div>
        </div>

        {/* Swiggy/Zomato Style Delivery Partner Card & Quick Actions */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6">
          {/* Partner Info Row */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src={request.professional?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"} 
                  alt="Elena Rodriguez" 
                  className="w-16 h-16 rounded-2xl object-cover border-2 border-indigo-500 shadow-sm"
                />
                <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                  ✓
                </span>
              </div>

              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-extrabold text-slate-900">{request.professional?.name || 'Elena Rodriguez'}</h3>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-[#363BD9] text-[10px] font-bold uppercase">Pro Partner</span>
                </div>
                <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
                  <span className="flex items-center text-amber-600 font-bold">
                    <Star className="w-3.5 h-3.5 fill-current mr-0.5" /> 4.9 (340+ jobs)
                  </span>
                  <span>•</span>
                  <span>{request.professional?.vehicle || 'EV Activa • US-842'}</span>
                </div>
                <div className="text-xs text-emerald-600 font-bold mt-1 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified & Temperature Checked</span>
                </div>
              </div>
            </div>

            {/* Quick Contact Buttons */}
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => alert(`Calling ${request.professional?.name || 'Elena Rodriguez'} at ${request.professional?.phone || '+1 555-234-9871'}`)}
                className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 flex items-center justify-center font-bold transition-colors shadow-2xs"
                title="Call Partner"
              >
                <Phone className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="w-11 h-11 rounded-2xl bg-[#363BD9] text-white hover:bg-[#282CC2] flex items-center justify-center font-bold transition-colors shadow-xs"
                title="Chat with Partner"
              >
                <MessageSquare className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Live Chat Overlay Drawer if toggled */}
          {chatOpen && (
            <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3 animate-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between text-xs font-bold text-slate-900 border-b border-indigo-100 pb-2">
                <span>Direct Message with {request.professional?.name || 'Elena'}</span>
                <button onClick={() => setChatOpen(false)} className="text-slate-400 hover:text-slate-600">✕</button>
              </div>

              <div className="space-y-2 max-h-40 overflow-y-auto p-1">
                {chatMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-xs font-medium ${
                      msg.sender === 'user' ? 'bg-[#363BD9] text-white' : 'bg-white text-slate-800 shadow-2xs border border-indigo-100'
                    }`}>
                      {msg.text}
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                <input 
                  type="text" 
                  placeholder="Type instructions e.g. Gate code #142..." 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="flex-1 bg-white border border-indigo-200 rounded-xl px-3 py-2 text-xs font-medium outline-none focus:border-[#363BD9]"
                />
                <button type="submit" className="bg-[#363BD9] text-white text-xs font-bold px-3 py-2 rounded-xl">
                  Send
                </button>
              </form>
            </div>
          )}

          {/* Swiggy/Zomato Delivery Timeline Steps */}
          <div className="space-y-4">
            <h4 className="text-sm font-extrabold text-slate-900">Service Progress Timeline</h4>

            <div className="space-y-3 relative before:absolute before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-indigo-100">
              {/* Step 1: Partner Assigned */}
              <div className="flex items-start space-x-3.5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                  ✓
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-900">Partner Assigned & Confirmed</div>
                  <div className="text-xs text-slate-500">Matched nearest pro ({initialDistance} km away)</div>
                </div>
              </div>

              {/* Step 2: En Route */}
              <div className="flex items-start space-x-3.5 relative z-10">
                <div className="w-8 h-8 rounded-full bg-[#363BD9] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs ring-4 ring-indigo-500/20">
                  <Navigation className="w-4 h-4 fill-current animate-pulse" />
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-[#363BD9]">En Route to Your Address</div>
                  <div className="text-xs text-slate-600 font-medium">Currently {currentDistanceKm} km away • ETA {currentEtaMins} mins</div>
                </div>
              </div>

              {/* Step 3: Arrived */}
              <div className="flex items-start space-x-3.5 relative z-10 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                  📍
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-700">Arrived at Location</div>
                  <div className="text-xs text-slate-500">Partner reaches entry doorstep</div>
                </div>
              </div>

              {/* Step 4: Completed */}
              <div className="flex items-start space-x-3.5 relative z-10 opacity-60">
                <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 border border-slate-200 flex items-center justify-center text-xs font-bold shrink-0">
                  ✨
                </div>
                <div>
                  <div className="font-bold text-xs sm:text-sm text-slate-700">Service Completed & Rating</div>
                  <div className="text-xs text-slate-500">Job completed with 100% satisfaction guarantee</div>
                </div>
              </div>
            </div>
          </div>

          {/* Demo Controls */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => handleSimulateStatus('en_route')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              [Demo] Set En Route (1.4 km)
            </button>
            <button 
              onClick={() => handleSimulateStatus('in_progress')}
              className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
            >
              [Demo] Set Arrived
            </button>
            <button 
              onClick={() => handleSimulateStatus('completed')}
              className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold"
            >
              [Demo] Set Completed
            </button>
          </div>
        </div>
      </main>
    </MobileShell>
  );
};
