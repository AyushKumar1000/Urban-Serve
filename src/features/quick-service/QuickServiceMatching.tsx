import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuickServiceRequestApi, simulateMatchingApi } from '../../api/quickservice';
import { QuickServiceRequest } from '../../types';
import { MobileShell } from '../../components/layout/MobileShell';
import { Zap, AlertCircle, CheckCircle2, MapPin, Navigation, ArrowRight, ShieldCheck } from 'lucide-react';

export const QuickServiceMatching: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [request, setRequest] = useState<QuickServiceRequest | null>(null);
  const [error, setError] = useState('');
  const [scanningPros] = useState([
    { name: 'Elena Rodriguez', distance: '0.8 km', status: 'Available', photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80' },
    { name: 'Marcus Vance', distance: '1.4 km', status: 'Available', photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80' },
    { name: 'Sarah Jenkins', distance: '2.1 km', status: 'On Job', photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80' },
  ]);

  useEffect(() => {
    if (!id) return;
    
    getQuickServiceRequestApi(id).then(req => {
      setRequest(req);
      if (req.status === 'searching') {
        simulateMatchingApi(id)
          .then(setRequest)
          .catch(e => setError(e.message));
      }
    }).catch(e => setError(e.message));
  }, [id]);

  if (error) {
    return (
      <MobileShell>
        <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
          <div className="max-w-md w-full bg-white rounded-3xl p-8 text-center border-t-4 border-t-red-500 shadow-xl space-y-4">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
            <h2 className="text-2xl font-extrabold text-slate-900">Matching Error</h2>
            <p className="text-slate-600 text-sm">{error}</p>
            <button 
              onClick={() => navigate('/quick-service')} 
              className="w-full bg-[#363BD9] text-white py-3.5 px-4 rounded-2xl font-bold text-sm hover:bg-[#282CC2] transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </MobileShell>
    );
  }

  // Scanning State
  if (!request || request.status === 'searching') {
    return (
      <MobileShell>
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 bg-slate-900 text-white relative overflow-hidden">
          {/* Animated Pulsing Radar Scanner Circles */}
          <div className="relative flex items-center justify-center my-8">
            <div className="absolute w-80 h-80 rounded-full border border-indigo-500/20 animate-ping"></div>
            <div className="absolute w-60 h-60 rounded-full border border-indigo-500/40 animate-pulse"></div>
            <div className="absolute w-40 h-40 rounded-full border border-indigo-400/60"></div>
            <div className="w-24 h-24 rounded-full bg-[#363BD9] flex items-center justify-center shadow-[0_0_50px_rgba(54,59,217,0.8)] z-10">
              <Zap className="w-12 h-12 text-white fill-current animate-bounce" />
            </div>
          </div>

          {/* Heading */}
          <div className="text-center space-y-2 max-w-md z-10">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold uppercase tracking-wider">
              <Navigation className="w-3.5 h-3.5 fill-current animate-spin" />
              <span>RADAR SCANNING NEARBY PROS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
              Finding Nearest Available Partner...
            </h2>
            <p className="text-xs sm:text-sm text-slate-300">
              Calculating real-time distance & transit time to your location: <span className="font-semibold text-white">{request?.location || 'Live GPS Location'}</span>
            </p>
          </div>

          {/* Candidate Nearby Pros Cards */}
          <div className="w-full max-w-md mt-8 space-y-2.5 z-10">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider text-center">Scanning Pros in your radius</div>
            {scanningPros.map((pro, index) => (
              <div 
                key={pro.name} 
                className="bg-slate-800/80 backdrop-blur-md border border-slate-700/80 rounded-2xl p-3 flex items-center justify-between shadow-md animate-pulse"
                style={{ animationDelay: `${index * 300}ms` }}
              >
                <div className="flex items-center space-x-3">
                  <img src={pro.photo} alt={pro.name} className="w-10 h-10 rounded-full object-cover border border-indigo-400" />
                  <div>
                    <div className="font-bold text-xs text-white">{pro.name}</div>
                    <div className="text-[11px] text-indigo-300 flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-indigo-400" />
                      <span>{pro.distance} away</span>
                    </div>
                  </div>
                </div>

                <div className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[10px] flex items-center space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Checking...</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </MobileShell>
    );
  }

  // Matched Result State
  return (
    <MobileShell>
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-50">
        <div className="max-w-lg w-full bg-white rounded-3xl p-6 sm:p-8 text-center border border-slate-200 shadow-2xl space-y-6 relative overflow-hidden">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-xs">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 font-bold text-xs">
              <span>NEAREST PARTNER MATCHED</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {request.professional?.name} is on the way!
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm">
              Matched based on proximity ({request.distanceKm || 0.8} km away). ETA: ~12 minutes.
            </p>
          </div>

          {/* Matched Pro Summary Card */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 text-left flex items-center justify-between space-x-4 shadow-xs">
            <div className="flex items-center space-x-3.5">
              <img 
                src={request.professional?.photoUrl || "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80"} 
                alt="Pro avatar" 
                className="w-14 h-14 rounded-2xl object-cover border-2 border-white shadow-xs"
              />
              <div>
                <div className="font-extrabold text-slate-900 text-base">{request.professional?.name}</div>
                <div className="text-xs text-slate-600 font-medium">★ {request.professional?.rating} · Verified Pro</div>
                <div className="text-[11px] text-indigo-700 font-bold mt-0.5">{request.professional?.vehicle || 'EV Bike • Honda Activa'}</div>
              </div>
            </div>

            <div className="text-right shrink-0">
              <div className="text-xs font-bold text-[#363BD9] bg-white px-2.5 py-1 rounded-xl border border-indigo-100 shadow-2xs">
                {request.distanceKm || 0.8} km away
              </div>
            </div>
          </div>

          {/* Delivery & Dispatch Guarantee */}
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-100">
            <ShieldCheck className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-left leading-tight">Live GPS tracking active. You can contact your partner directly at any time.</span>
          </div>

          {/* Track Button */}
          <div className="p-1 rounded-3xl dashed-active-border">
            <button 
              onClick={() => navigate(`/quick-service/track/${request.id}`)} 
              className="w-full bg-[#363BD9] hover:bg-[#282CC2] text-white py-4 px-6 rounded-2xl font-bold text-base flex items-center justify-center space-x-2 shadow-lg transition-all"
            >
              <span>Track Live Delivery & Map</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </MobileShell>
  );
};
