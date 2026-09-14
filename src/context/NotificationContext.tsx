import React, { createContext, useContext, useState, useEffect } from 'react';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'dispatch' | 'emergency' | 'system' | 'review';
  bookingId?: string;
  serviceTitle?: string;
  professionalName?: string;
  time: string;
  timestamp: number;
  read: boolean;
}

interface NotificationContextState {
  notifications: AppNotification[];
  unreadCount: number;
  activeToast: AppNotification | null;
  addBookingNotification: (data: {
    bookingId: string;
    serviceTitle: string;
    scheduledTime?: string;
    price?: number;
    professionalName?: string;
  }) => void;
  addQuickRequestNotification: (data: {
    requestId: string;
    serviceType: string;
    etaMinutes?: number;
    professionalName?: string;
  }) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotification: (id: string) => void;
  dismissToast: () => void;
  requestNotificationPermission: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextState | undefined>(undefined);

// Web Audio API notification chime generator (No external audio file required)
const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    // Smooth chime note 1 (C5 - 523.25 Hz)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime);
    gain1.gain.setValueAtTime(0.15, ctx.currentTime);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.35);

    // Smooth chime note 2 (G5 - 783.99 Hz)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, ctx.currentTime + 0.12);
    gain2.gain.setValueAtTime(0.18, ctx.currentTime + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.55);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(ctx.currentTime + 0.12);
    osc2.stop(ctx.currentTime + 0.55);
  } catch (e) {
    // AudioContext blocked or not supported
  }
};

const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-welcome',
    title: 'Welcome to UrbanServe!',
    message: 'Your account is ready. Explore top rated home cleaning, electrical, and plumbing pros.',
    type: 'system',
    time: 'Today',
    timestamp: Date.now() - 3600000,
    read: false,
  },
];

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    try {
      const stored = localStorage.getItem('urbanserve_notifications');
      return stored ? JSON.parse(stored) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [activeToast, setActiveToast] = useState<AppNotification | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('urbanserve_notifications', JSON.stringify(notifications));
    } catch {
      // Storage full or unavailable
    }
  }, [notifications]);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      try {
        await Notification.requestPermission();
      } catch {
        // Ignored
      }
    }
  };

  const dispatchNotification = (notif: AppNotification) => {
    setNotifications((prev) => [notif, ...prev]);
    setActiveToast(notif);
    playNotificationChime();

    // Trigger Browser Desktop Notification if allowed
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(notif.title, {
          body: notif.message,
          icon: '/favicon.svg',
        });
      } catch {
        // Fallback gracefully
      }
    }

    // Auto-dismiss toast after 6 seconds
    setTimeout(() => {
      setActiveToast((current) => (current?.id === notif.id ? null : current));
    }, 6000);
  };

  const addBookingNotification = ({
    bookingId,
    serviceTitle,
    scheduledTime,
    price,
    professionalName,
  }: {
    bookingId: string;
    serviceTitle: string;
    scheduledTime?: string;
    price?: number;
    professionalName?: string;
  }) => {
    const formattedDate = scheduledTime
      ? new Date(scheduledTime).toLocaleString([], {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        })
      : 'Scheduled';

    const notif: AppNotification = {
      id: `booking-${Date.now()}`,
      title: '🎉 Booking Confirmed!',
      message: `${serviceTitle} has been confirmed for ${formattedDate}${price ? ` ($${price})` : ''}${professionalName ? ` with ${professionalName}` : ''}.`,
      type: 'booking',
      bookingId,
      serviceTitle,
      professionalName,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
    };

    dispatchNotification(notif);
  };

  const addQuickRequestNotification = ({
    requestId,
    serviceType,
    etaMinutes,
    professionalName,
  }: {
    requestId: string;
    serviceType: string;
    etaMinutes?: number;
    professionalName?: string;
  }) => {
    const notif: AppNotification = {
      id: `quick-${Date.now()}`,
      title: '⚡ Emergency Dispatch Active!',
      message: `Technician ${professionalName || 'Emergency Pro'} is dispatched for ${serviceType}${etaMinutes ? ` (ETA: ~${etaMinutes} mins)` : ''}.`,
      type: 'emergency',
      bookingId: requestId,
      serviceTitle: serviceType,
      professionalName,
      time: 'Just now',
      timestamp: Date.now(),
      read: false,
    };

    dispatchNotification(notif);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (activeToast?.id === id) setActiveToast(null);
  };

  const dismissToast = () => {
    setActiveToast(null);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        activeToast,
        addBookingNotification,
        addQuickRequestNotification,
        markAsRead,
        markAllAsRead,
        clearNotification,
        dismissToast,
        requestNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
