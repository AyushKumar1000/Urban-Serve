import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotification } from '../../context/NotificationContext';
import { CheckCircle2, Zap, Bell, X, ArrowRight, Info } from 'lucide-react';


export const NotificationToast: React.FC = () => {
  const { activeToast, dismissToast } = useNotification();
  const navigate = useNavigate();

  if (!activeToast) return null;

  const handleAction = () => {
    if (activeToast.type === 'booking' && activeToast.bookingId) {
      navigate(`/my-bookings/${activeToast.bookingId}`);
    } else if (activeToast.type === 'emergency' && activeToast.bookingId) {
      navigate(`/quick-service/track/${activeToast.bookingId}`);
    } else {
      navigate('/my-bookings');
    }
    dismissToast();
  };

  return (
    <div className="fixed top-5 right-5 z-[100] max-w-md w-full animate-in slide-in-from-top-4 fade-in duration-300">
      <div className="bg-slate-900 text-white rounded-2xl shadow-2xl border border-slate-700/80 p-4 flex flex-col gap-2.5 backdrop-blur-xl ring-1 ring-white/10">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div
              className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                activeToast.type === 'booking'
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : activeToast.type === 'emergency'
                  ? 'bg-rose-500/20 text-rose-400'
                  : 'bg-indigo-500/20 text-indigo-400'
              }`}
            >
              {activeToast.type === 'booking' ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : activeToast.type === 'emergency' ? (
                <Zap className="w-5 h-5" />
              ) : (
                <Bell className="w-5 h-5" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm text-white leading-tight">{activeToast.title}</span>
              <span className="text-[11px] text-slate-400">{activeToast.time}</span>
            </div>
          </div>
          <button
            onClick={dismissToast}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pl-11">{activeToast.message}</p>

        {activeToast.bookingId && (
          <div className="pt-2 pl-11 flex items-center gap-2">
            <button
              onClick={handleAction}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/30"
            >
              <span>View Booking</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={dismissToast}
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-medium transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAllAsRead, clearNotification, markAsRead } = useNotification();
  const [isOpen, setIsOpen] = React.useState(false);
  const navigate = useNavigate();
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen && unreadCount > 0) {
            markAllAsRead();
          }
        }}
        className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-50 shadow-2xs relative transition-colors"
        title="Notifications"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-indigo-600 text-white font-bold text-[10px] flex items-center justify-center ring-2 ring-white animate-pulse">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200/90 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="p-3.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold">
                  {unreadCount} new
                </span>
              )}
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] text-indigo-600 hover:underline font-semibold"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Bell className="w-8 h-8 text-slate-300" />
                <span>No notifications yet</span>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => {
                    markAsRead(n.id);
                    if (n.bookingId) {
                      navigate(`/my-bookings/${n.bookingId}`);
                      setIsOpen(false);
                    }
                  }}
                  className={`p-3.5 flex items-start gap-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                    !n.read ? 'bg-indigo-50/40' : 'bg-white'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      n.type === 'booking'
                        ? 'bg-emerald-100 text-emerald-700'
                        : n.type === 'emergency'
                        ? 'bg-rose-100 text-rose-700'
                        : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {n.type === 'booking' ? (
                      <CheckCircle2 className="w-4 h-4" />
                    ) : n.type === 'emergency' ? (
                      <Zap className="w-4 h-4" />
                    ) : (
                      <Info className="w-4 h-4" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-xs text-slate-900 truncate">{n.title}</span>
                      <span className="text-[10px] text-slate-400 flex-shrink-0">{n.time}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      clearNotification(n.id);
                    }}
                    className="text-slate-300 hover:text-slate-500 p-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};
