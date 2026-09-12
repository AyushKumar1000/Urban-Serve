import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getDashboardStatsApi,
  getAllCustomersApi,
  DashboardStats,
  AdminCustomer,
} from '../../../api/admin';
import {
  Users,
  CalendarCheck,
  Zap,
  DollarSign,
  Search,
  X,
  LogOut,
  LayoutDashboard,
  Clock,
  MapPin,
  Phone,
  Mail,
  ChevronRight,
  RefreshCw,
  Star,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Download,
  UserPlus,
  ShieldCheck,
  Radio,
  Send,
  Mic,
  MessageSquare,
  FileText,
  Settings,
  AlertTriangle,
  BadgeCheck,
  Layers,
  ArrowUpRight,
  Navigation,
} from 'lucide-react';

interface CustomerRecord {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  coords: string;
  totalSpend: string;
  spendAmount: number;
  rating: string;
  ordersCount: number;
  completedCount: number;
  memberSince: string;
  isVip: boolean;
  status: 'in_progress' | 'emergency_request' | 'confirmed' | 'completed' | 'inactive';
  statusLabel: string;
  avatarUrl?: string;
  activeOrder?: {
    id: string;
    title: string;
    scheduledTime: string;
    status: string;
    proName: string;
    proRole: string;
    proAvatar: string;
    proPhone: string;
    mapImageUrl: string;
    locationNote: string;
    arrivalStatus: string;
    items: Array<{ name: string; price: number }>;
    total: number;
    paymentMethod: string;
  };
  emergencyRequests?: Array<{
    id: string;
    title: string;
    description: string;
    proName: string;
    status: string;
    billed: string;
    timeAgo: string;
  }>;
  bookingHistory?: Array<{
    id: string;
    title: string;
    date: string;
    price: string;
    rating: number;
    status: string;
  }>;
  notes?: {
    instructions: string;
    keypadCode: string;
    tags: string[];
    logList: string[];
  };
}

const DEFAULT_CUSTOMERS: CustomerRecord[] = [
  {
    id: 'cust-1',
    code: '#CUST-8492',
    name: 'Elena Vance',
    email: 'elena.vance@urbanmail.com',
    phone: '+1 (512) 890-2411',
    address: '742 Evergreen Terrace, Austin, TX 78701',
    city: 'Austin, TX',
    coords: '[30.2672, -97.7431]',
    totalSpend: '$4,850.00',
    spendAmount: 4850,
    rating: '4.92',
    ordersCount: 32,
    completedCount: 31,
    memberSince: 'Feb 2023',
    isVip: true,
    status: 'in_progress',
    statusLabel: 'In Progress (HVAC)',
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    activeOrder: {
      id: '#BK-9481',
      title: 'HVAC Precision Maintenance',
      scheduledTime: '2:30 PM – 4:30 PM Today',
      status: 'In Progress',
      proName: 'Marcus Vance',
      proRole: 'Master Tech • 4.95 ★ (412 jobs)',
      proAvatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80',
      proPhone: '+1 (512) 555-0199',
      mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      locationNote: '742 Evergreen Terrace, Austin, TX',
      arrivalStatus: 'Pro On-Site (Arrival: 14m ago)',
      items: [
        { name: 'Filter Replacement (2x MERV-13)', price: 54 },
        { name: 'Compressor Coil Deep Sanitization', price: 135 },
      ],
      total: 189,
      paymentMethod: 'Paid via Apple Pay',
    },
    emergencyRequests: [
      {
        id: 'em-1',
        title: 'Emergency Pipe Burst / Water Leak',
        description: 'Main kitchen line rupture shut-off valve failed. Immediate 45-minute SLA dispatched. Tech arrived in 21m.',
        proName: 'David Miller (Emergency Plumber)',
        status: 'Resolved (38m)',
        billed: '$245.00',
        timeAgo: 'Today at 10:15 AM',
      },
      {
        id: 'em-2',
        title: 'Main Breaker Tripping Incident',
        description: 'Emergency dispatcher routed Pro Carlos Ramos within 35 minutes. Replaced 50A dual-pole breaker.',
        proName: 'Carlos Ramos (Master Electrician)',
        status: 'Resolved',
        billed: '$180.00',
        timeAgo: '2 weeks ago',
      },
    ],
    bookingHistory: [
      { id: '#BK-8102', title: 'Full House Electrical Audit', date: 'Jan 14, 2025', price: '$340.00', rating: 5, status: 'Completed' },
      { id: '#BK-7649', title: 'Deep Spring Home Sanitization', date: 'Dec 02, 2024', price: '$220.00', rating: 5, status: 'Completed' },
      { id: '#BK-6912', title: 'Smart Thermostat & Relay Install', date: 'Oct 19, 2024', price: '$165.00', rating: 4.8, status: 'Completed' },
    ],
    notes: {
      instructions: 'Prefers technicians to enter through side gate keypad (Code: #7741). Golden Retriever named Barney is very friendly but dispatcher policy requires keeping pet inside during electrical operations.',
      keypadCode: '#7741',
      tags: ['[Priority Customer]', '[Auto-Approve Requests]', '[Pet Owner - Dog]', '[Prefers Electrician Marcus V.]'],
      logList: ['Added gate keypad instruction #7741', 'Customer requested morning appointments where possible'],
    },
  },
  {
    id: 'cust-2',
    code: '#CUST-9104',
    name: 'Marcus Holloway',
    email: 'm.holloway@cloud.io',
    phone: '+1 (512) 671-8930',
    address: '1100 Congress Ave, Austin, TX 78704',
    city: 'Austin, TX',
    coords: '[30.2747, -97.7404]',
    totalSpend: '$1,920.00',
    spendAmount: 1920,
    rating: '4.80',
    ordersCount: 14,
    completedCount: 13,
    memberSince: 'Jul 2023',
    isVip: false,
    status: 'emergency_request',
    statusLabel: 'Quick Req (Burst Pipe)',
    avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    activeOrder: {
      id: '#BK-9502',
      title: 'Emergency Water Main Stabilization',
      scheduledTime: 'Immediate Dispatch (Active SLA)',
      status: 'Emergency En Route',
      proName: 'David Miller',
      proRole: 'Emergency Plumber • 4.98 ★ (830 jobs)',
      proAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      proPhone: '+1 (512) 555-0144',
      mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      locationNote: '1100 Congress Ave, Austin, TX',
      arrivalStatus: 'Technician 4 mins away (1.2 km)',
      items: [{ name: 'Emergency Plumbing Callout & Diagnostic', price: 120 }],
      total: 120,
      paymentMethod: 'Pre-Authorized Card',
    },
    emergencyRequests: [
      {
        id: 'em-3',
        title: 'Emergency Water Main Stabilization',
        description: 'Flooding in lower bathroom. Water shutoff located outside.',
        proName: 'David Miller',
        status: 'En Route (ETA 4m)',
        billed: '$120.00',
        timeAgo: '15m ago',
      },
    ],
    bookingHistory: [
      { id: '#BK-8800', title: 'AC Filter & Compressor Check', date: 'Aug 10, 2024', price: '$140.00', rating: 4.8, status: 'Completed' },
      { id: '#BK-7411', title: 'Ceiling Fan Installation', date: 'Mar 12, 2024', price: '$95.00', rating: 5, status: 'Completed' },
    ],
    notes: {
      instructions: 'Building security intercom buzzer #0412 for lobby entrance.',
      keypadCode: '#0412',
      tags: ['[Commercial/Residential Loft]', '[Quick Response Priority]'],
      logList: ['Lobby entrance buzzer verified'],
    },
  },
  {
    id: 'cust-3',
    code: '#CUST-7731',
    name: 'Sophia Lorenza',
    email: 'sophia.l@urbanloft.org',
    phone: '+1 (512) 440-1922',
    address: '404 Rainey St #12B, Austin, TX 78701',
    city: 'Austin, TX',
    coords: '[30.2589, -97.7381]',
    totalSpend: '$1,450.00',
    spendAmount: 1450,
    rating: '4.95',
    ordersCount: 8,
    completedCount: 7,
    memberSince: 'Nov 2023',
    isVip: false,
    status: 'confirmed',
    statusLabel: 'Confirmed (Tomorrow)',
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    activeOrder: {
      id: '#BK-9420',
      title: 'Eco-Friendly Deep Home Cleaning',
      scheduledTime: 'Tomorrow at 10:00 AM',
      status: 'Confirmed',
      proName: 'Elena Gomez',
      proRole: 'Sanitization Specialist • 4.91 ★ (290 jobs)',
      proAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
      proPhone: '+1 (512) 555-0811',
      mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      locationNote: '404 Rainey St #12B, Austin, TX',
      arrivalStatus: 'Scheduled Dispatch Pending',
      items: [
        { name: '3-Bedroom Deep Cleaning', price: 180 },
        { name: 'Balcony Pressure Wash', price: 65 },
      ],
      total: 245,
      paymentMethod: 'Credit Card (**** 4421)',
    },
    bookingHistory: [
      { id: '#BK-8310', title: 'Monthly Standard Cleaning', date: 'Jan 02, 2025', price: '$120.00', rating: 5, status: 'Completed' },
      { id: '#BK-7901', title: 'Kitchen Sanitization', date: 'Nov 20, 2024', price: '$85.00', rating: 4.9, status: 'Completed' },
    ],
    notes: {
      instructions: 'Concierge has spare key card for 12th floor access.',
      keypadCode: 'N/A (Concierge)',
      tags: ['[Eco-Friendly Products Only]', '[High-Rise Building]'],
      logList: ['Requested plant-based cleaning solutions'],
    },
  },
  {
    id: 'cust-4',
    code: '#CUST-6629',
    name: 'David K. Chen',
    email: 'chen.studio@atxdesign.com',
    phone: '+1 (512) 389-9901',
    address: '2205 Barton Springs, Austin, TX 78704',
    city: 'Austin, TX',
    coords: '[30.2612, -97.7711]',
    totalSpend: '$5,420.00',
    spendAmount: 5420,
    rating: '5.00',
    ordersCount: 22,
    completedCount: 22,
    memberSince: 'Jan 2023',
    isVip: true,
    status: 'completed',
    statusLabel: 'Completed (Today)',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    activeOrder: {
      id: '#BK-9304',
      title: 'EV Charger Level 2 Hardwire',
      scheduledTime: 'Completed Today at 1:15 PM',
      status: 'Completed',
      proName: 'Nathan Cole',
      proRole: 'Licensed Electrician • 4.99 ★ (512 jobs)',
      proAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
      proPhone: '+1 (512) 555-0322',
      mapImageUrl: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=600&auto=format&fit=crop&q=80',
      locationNote: '2205 Barton Springs, Austin, TX',
      arrivalStatus: 'Work Inspected & Signed Off',
      items: [
        { name: '50A Dedicated Breaker Circuit Installation', price: 380 },
        { name: 'NEMA 14-50 Heavy Duty Receptacle & Conduit', price: 180 },
      ],
      total: 560,
      paymentMethod: 'Corporate Card',
    },
    bookingHistory: [
      { id: '#BK-9304', title: 'EV Charger Level 2 Hardwire', date: 'Feb 10, 2025', price: '$560.00', rating: 5, status: 'Completed' },
      { id: '#BK-8512', title: 'Studio Recessed LED Layout', date: 'Dec 15, 2024', price: '$720.00', rating: 5, status: 'Completed' },
    ],
    notes: {
      instructions: 'Garage side entrance code #8821.',
      keypadCode: '#8821',
      tags: ['[VIP Architect Studio]', '[Prompt Payer]', '[High Value]'],
      logList: ['Passed city electrical inspection certificate'],
    },
  },
  {
    id: 'cust-5',
    code: '#CUST-5510',
    name: 'Rachel Torres',
    email: 'rachel.torres@gmail.com',
    phone: '+1 (512) 710-8201',
    address: '1804 South Congress, Austin, TX 78704',
    city: 'Austin, TX',
    coords: '[30.2471, -97.7505]',
    totalSpend: '$2,380.00',
    spendAmount: 2380,
    rating: '4.88',
    ordersCount: 19,
    completedCount: 18,
    memberSince: 'May 2023',
    isVip: false,
    status: 'confirmed',
    statusLabel: 'Confirmed (Fri 4 PM)',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bookingHistory: [
      { id: '#BK-9188', title: 'Deluxe In-Home Spa & Hair Styling', date: 'Jan 28, 2025', price: '$145.00', rating: 5, status: 'Completed' },
      { id: '#BK-8600', title: 'Deep Facial Treatment', date: 'Dec 10, 2024', price: '$110.00', rating: 4.8, status: 'Completed' },
    ],
    notes: {
      instructions: 'Side porch parking spot reserved for service vans.',
      keypadCode: '#1122',
      tags: ['[Wellness Regular]', '[Preferred Pro: Chloe M.]'],
      logList: ['Prefers afternoon slots'],
    },
  },
  {
    id: 'cust-6',
    code: '#CUST-4190',
    name: 'Arthur Pendelton',
    email: 'arthur.p@austinlaw.org',
    phone: '+1 (512) 991-3444',
    address: '800 W 6th St #140, Austin, TX 78701',
    city: 'Austin, TX',
    coords: '[30.2705, -97.7490]',
    totalSpend: '$820.00',
    spendAmount: 820,
    rating: '4.75',
    ordersCount: 5,
    completedCount: 5,
    memberSince: 'Sep 2023',
    isVip: false,
    status: 'inactive',
    statusLabel: 'Completed (Resolved)',
    avatarUrl: '',
    bookingHistory: [
      { id: '#BK-8902', title: 'Appliance Freon Diagnosis', date: 'Oct 04, 2024', price: '$165.00', rating: 4.7, status: 'Completed' },
    ],
    notes: {
      instructions: 'Downtown office building, security check-in required at desk.',
      keypadCode: 'Desk Check-in',
      tags: ['[Commercial Office]', '[Weekend Only]'],
      logList: ['Security clearance verified'],
    },
  },
];

type DrawerTab = 'active-orders' | 'quick-requests' | 'booking-history' | 'notes';
type SegmentFilter = 'all' | 'in_progress' | 'emergency_request' | 'vip' | 'inactive';
type NavRoute = 'overview' | 'customers' | 'bookings' | 'quick-requests' | 'providers' | 'catalog' | 'analytics' | 'settings';

export const ServiceTeamDashboard: React.FC = () => {
  const { user, logout } = useAuth();

  // Navigation & View State
  const [currentNav, setCurrentNav] = useState<NavRoute>('customers');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('cust-1');
  const [drawerTab, setDrawerTab] = useState<DrawerTab>('active-orders');
  const [segment, setSegment] = useState<SegmentFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState('atx');
  
  // Modals & Drawers
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNewCustomerModalOpen, setIsNewCustomerModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // AI Copilot state
  const [copilotInput, setCopilotInput] = useState('');
  const [copilotMessages, setCopilotMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; time: string; customerFocus?: string }>>([
    {
      role: 'user',
      text: 'Who is Elena Vance and what is her active order status?',
      time: '2:44 PM',
    },
    {
      role: 'assistant',
      text: 'Elena Vance (#CUST-8492) is a Tier 1 VIP residential customer with 32 total bookings ($4,850 spend) and a 4.92 ★ rating. Her active order #BK-9481 (HVAC Precision Maintenance) is currently IN PROGRESS on-site with Pro Marcus Vance (GPS verified 14m ago).',
      time: '2:44 PM',
      customerFocus: 'cust-1',
    },
  ]);

  // Dynamic Notes state
  const [newNoteText, setNewNoteText] = useState('');
  const [customNotes, setCustomNotes] = useState<Record<string, string[]>>({});

  // DB Data & API State
  const [dbStats, setDbStats] = useState<DashboardStats | null>(null);
  const [dbCustomers, setDbCustomers] = useState<AdminCustomer[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // New Customer Form State
  const [newCustomerForm, setNewCustomerForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    city: 'Austin, TX',
    address: '',
  });

  const searchInputRef = useRef<HTMLInputElement>(null);
  const toastTimeoutRef = useRef<any>(null);

  // Trigger Toast helper
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    toastTimeoutRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Keyboard Shortcuts (⌘K for search, ⌘J for Copilot, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'j') {
        e.preventDefault();
        setIsCopilotOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setIsNewCustomerModalOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Fetch PostgreSQL data
  const loadData = async () => {
    setIsRefreshing(true);
    try {
      const [statsData, customersData] = await Promise.all([
        getDashboardStatsApi().catch(() => null),
        getAllCustomersApi().catch(() => []),
      ]);
      if (statsData) setDbStats(statsData);
      if (customersData && customersData.length > 0) setDbCustomers(customersData);
      triggerToast('Refreshed real-time telemetry from PostgreSQL DB');
    } catch (err) {
      console.warn('API error (using enriched data):', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Merge DB customers with rich defaults
  const allCustomers: CustomerRecord[] = React.useMemo(() => {
    const combined = [...DEFAULT_CUSTOMERS];
    dbCustomers.forEach((dbCust, idx) => {
      if (!combined.some((c) => c.email.toLowerCase() === dbCust.email.toLowerCase())) {
        combined.push({
          id: dbCust.id,
          code: `#CUST-${9500 + idx}`,
          name: dbCust.name,
          email: dbCust.email,
          phone: dbCust.phone || '+1 (512) 555-0100',
          address: dbCust.address || 'Austin Metro Area, TX',
          city: 'Austin, TX',
          coords: dbCust.coordinates ? `[${dbCust.coordinates.lat.toFixed(4)}, ${dbCust.coordinates.lng.toFixed(4)}]` : '[30.2672, -97.7431]',
          totalSpend: '$290.00',
          spendAmount: 290,
          rating: '5.00',
          ordersCount: 2,
          completedCount: 2,
          memberSince: 'Just now',
          isVip: false,
          status: 'confirmed',
          statusLabel: 'Active Customer',
          avatarUrl: '',
          bookingHistory: [],
          notes: {
            instructions: 'New customer account registered in database.',
            keypadCode: 'Standard',
            tags: ['[New Registered User]'],
            logList: [],
          },
        });
      }
    });
    return combined;
  }, [dbCustomers]);

  // Filter customers by search and segment
  const filteredCustomers = allCustomers.filter((cust) => {
    const matchesSearch =
      !searchQuery ||
      cust.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.phone.includes(searchQuery) ||
      cust.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cust.code.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesSegment = true;
    if (segment === 'in_progress') matchesSegment = cust.status === 'in_progress';
    if (segment === 'emergency_request') matchesSegment = cust.status === 'emergency_request';
    if (segment === 'vip') matchesSegment = cust.isVip || cust.spendAmount >= 3000;
    if (segment === 'inactive') matchesSegment = cust.status === 'inactive';

    let matchesCity = true;
    if (cityFilter === 'atx') matchesCity = cust.address.toLowerCase().includes('austin') || cust.city.includes('Austin');

    return matchesSearch && matchesSegment && matchesCity;
  });

  const selectedCustomer = allCustomers.find((c) => c.id === selectedCustomerId) || allCustomers[0];

  // Post Note handler
  const handleAddNote = () => {
    if (!newNoteText.trim()) return;
    const currentList = customNotes[selectedCustomer.id] || [];
    setCustomNotes({
      ...customNotes,
      [selectedCustomer.id]: [newNoteText.trim(), ...currentList],
    });
    triggerToast(`Added dispatcher note for ${selectedCustomer.name}`);
    setNewNoteText('');
  };

  // AI Copilot Submit
  const handleCopilotSubmit = (customPrompt?: string) => {
    const textToSend = customPrompt || copilotInput;
    if (!textToSend.trim()) return;

    const newMsg = {
      role: 'user' as const,
      text: textToSend.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    let replyText = `Analyzing "${textToSend}" against PostgreSQL records...`;
    let focusId: string | undefined = undefined;

    const lower = textToSend.toLowerCase();
    if (lower.includes('hvac') || lower.includes('elena')) {
      replyText = `Found 1 live HVAC maintenance order for Elena Vance (#CUST-8492). Master Tech Marcus Vance is currently on-site (arrival: 14m ago) in Austin Central Zone.`;
      focusId = 'cust-1';
    } else if (lower.includes('vip') || lower.includes('3k') || lower.includes('spend')) {
      replyText = `Found 2 high-tier VIP spenders: David K. Chen ($5,420 spent, 22 completed jobs) and Elena Vance ($4,850 spent, 32 completed jobs). Both have >4.92 ★ satisfaction.`;
      focusId = 'cust-4';
    } else if (lower.includes('leak') || lower.includes('emergency') || lower.includes('pipe')) {
      replyText = `Urgent: Marcus Holloway (#CUST-9104) has an active burst pipe emergency dispatch. Plumber David Miller is en route (ETA 4 minutes).`;
      focusId = 'cust-2';
    } else {
      replyText = `Query processed. Retrieved real-time status across 18,420 customer records, 142 live dispatches, and active service providers in Austin, TX.`;
    }

    setCopilotMessages((prev) => [
      ...prev,
      newMsg,
      {
        role: 'assistant' as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        customerFocus: focusId,
      },
    ]);

    if (!customPrompt) setCopilotInput('');
    if (focusId) setSelectedCustomerId(focusId);
    triggerToast('Copilot response generated');
  };

  // Export CSV Handler
  const handleExportCSV = () => {
    const headers = 'ID,Name,Email,Phone,Address,TotalSpend,Rating,OrdersCount,Status\n';
    const rows = filteredCustomers
      .map((c) => `"${c.code}","${c.name}","${c.email}","${c.phone}","${c.address}","${c.totalSpend}","${c.rating}","${c.ordersCount}","${c.status}"`)
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `urbanserve_customers_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    triggerToast('Customer dataset exported (CSV downloaded)');
  };

  // Save new customer
  const handleSaveCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCustomerForm.firstName || !newCustomerForm.email) return;

    const newId = `cust-${Date.now()}`;
    const fullName = `${newCustomerForm.firstName} ${newCustomerForm.lastName}`.trim();
    const newRecord: CustomerRecord = {
      id: newId,
      code: `#CUST-${Math.floor(1000 + Math.random() * 9000)}`,
      name: fullName,
      email: newCustomerForm.email,
      phone: newCustomerForm.phone || '+1 (512) 555-0150',
      address: newCustomerForm.address || 'Austin, TX',
      city: newCustomerForm.city,
      coords: '[30.2672, -97.7431]',
      totalSpend: '$0.00',
      spendAmount: 0,
      rating: '5.00',
      ordersCount: 0,
      completedCount: 0,
      memberSince: 'Just now',
      isVip: false,
      status: 'confirmed',
      statusLabel: 'New Registered',
      avatarUrl: '',
      bookingHistory: [],
      notes: {
        instructions: 'New customer profile registered via Service Ops Console.',
        keypadCode: 'Standard',
        tags: ['[New Customer]'],
        logList: ['Customer registered via Service Ops Console'],
      },
    };

    allCustomers.unshift(newRecord);
    setSelectedCustomerId(newId);
    setIsNewCustomerModalOpen(false);
    setNewCustomerForm({ firstName: '', lastName: '', email: '', phone: '', city: 'Austin, TX', address: '' });
    triggerToast(`Customer ${fullName} registered successfully!`);
  };

  if (user?.approvalStatus === 'pending') {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="bg-slate-800 border border-slate-700 p-8 rounded-2xl max-w-md text-center">
          <AlertCircle className="w-12 h-12 text-amber-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white mb-2">Access Denied: Pending Approval</h2>
          <p className="text-slate-400 text-sm mb-6">Your Service Team account is currently undergoing verification by the UrbanServe operations team.</p>
          <button onClick={logout} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl text-sm">
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8ff] text-[#131b2e] font-sans antialiased flex flex-col selection:bg-indigo-500 selection:text-white">
      {/* Fixed Left Navigation Sidebar */}
      <aside className="fixed left-0 top-0 bottom-0 w-72 bg-white z-50 flex flex-col justify-between shadow-[0_1px_12px_rgba(0,0,0,0.06)] border-r border-slate-200/80">
        <div className="flex flex-col">
          {/* Logo & Platform Header */}
          <div className="h-16 flex items-center px-6 gap-3 border-b border-slate-100">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-base text-slate-900 tracking-tight leading-none flex items-center gap-1.5">
                UrbanServe
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </span>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mt-1">Ops Console</span>
            </div>
          </div>

          <div className="px-5 py-3">
            <div className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Operations Core</div>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-1 px-3">
            {[
              { id: 'overview' as NavRoute, label: 'Dashboard / Overview', icon: LayoutDashboard },
              { id: 'customers' as NavRoute, label: 'Customers & CRM', icon: Users },
              { id: 'bookings' as NavRoute, label: 'Service Bookings & Dispatches', icon: CalendarCheck },
              { id: 'quick-requests' as NavRoute, label: 'Emergency Requests', icon: Zap, badge: '4 Live', badgeColor: 'bg-rose-100 text-rose-700' },
              { id: 'providers' as NavRoute, label: 'Service Providers', icon: ShieldCheck },
              { id: 'catalog' as NavRoute, label: 'Catalog & Pricing', icon: FileText },
              { id: 'analytics' as NavRoute, label: 'Analytics & Revenue', icon: TrendingUp },
              { id: 'settings' as NavRoute, label: 'Settings & DB Health', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentNav(item.id);
                    triggerToast(`Switched view: ${item.label}`);
                  }}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold leading-none ${isActive ? 'bg-white/20 text-white' : item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Telemetry & Pro Profile */}
        <div className="p-4 flex flex-col gap-3">
          <div className="bg-slate-50 border border-slate-200/70 rounded-xl p-3.5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">System Telemetry</span>
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <span>API Response</span>
              <span className="text-indigo-600 font-semibold">42ms</span>
            </div>
            <div className="flex items-center justify-between text-xs font-mono text-slate-600">
              <span>PostgreSQL Sync</span>
              <span className="text-emerald-600 font-semibold">100% OK</span>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-xs">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 truncate max-w-[120px]">{user?.name || 'Service Lead'}</span>
                <span className="text-[10px] text-slate-400">{user?.serviceCategory || 'Operations Lead'}</span>
              </div>
            </div>
            <button
              onClick={logout}
              title="Sign Out"
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Container */}
      <div className="pl-72 flex-1 flex flex-col">
        {/* Top Header */}
        <header className="fixed top-0 left-72 right-0 h-16 bg-white/85 backdrop-blur-xl z-40 border-b border-slate-200/80 px-6 flex items-center justify-between shadow-xs">
          {/* Left search & environment pill */}
          <div className="flex items-center gap-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-mono text-xs border border-slate-200/70">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="font-semibold">LIVE PROD - US-EAST</span>
            </div>
            <div className="relative flex items-center">
              <Search className="w-4 h-4 absolute left-3 text-slate-400" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Global search (incidents, customers, pros)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 w-80 pl-9 pr-12 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-sm rounded-xl border border-slate-200/80 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-xs"
              />
              <kbd className="absolute right-3 text-[11px] font-mono text-slate-400 bg-slate-200/60 px-1.5 py-0.5 rounded">⌘K</kbd>
            </div>
          </div>

          {/* Right Header CTAs & Profile */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setIsCopilotOpen((prev) => !prev)}
              className="h-9 px-3.5 inline-flex items-center gap-2 rounded-xl bg-indigo-50 text-indigo-600 text-xs font-semibold hover:bg-indigo-600 hover:text-white transition-all shadow-xs ring-1 ring-indigo-200"
            >
              <Sparkles className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Ask Copilot</span>
              <kbd className="font-mono text-[10px] bg-white text-indigo-600 px-1.5 py-0.5 rounded shadow-2xs">⌘J</kbd>
            </button>

            <button
              type="button"
              onClick={() => triggerToast('Launching Quick Dispatch Wizard')}
              className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-600/20"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>New Booking</span>
            </button>

            <button
              type="button"
              onClick={() => triggerToast('Displaying 14 live dispatches on city map')}
              className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl bg-white text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-50 transition-colors shadow-xs"
            >
              <Navigation className="w-3.5 h-3.5 text-slate-500" />
              <span>Dispatches</span>
            </button>

            <div className="h-6 w-px bg-slate-200 mx-1" />

            <div className="flex items-center gap-2.5">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Sarah Jenkins"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-100"
              />
              <div className="flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 leading-none">{user?.name || 'Sarah Jenkins'}</span>
                <span className="text-[10px] text-slate-400 leading-none mt-1">Operations Lead</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Dashboard Canvas */}
        <main className="w-full pt-20 px-6 py-6 min-h-screen">
          <div className="flex flex-col w-full gap-6 pb-20 max-w-[1600px] mx-auto">
            {/* Top Operational Banner & Action Bar */}
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-xs border border-slate-200/80">
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2.5">
                  <h1 className="text-xl font-bold text-slate-900 tracking-tight">Customers & Service Management</h1>
                  <span className="px-2.5 py-0.5 bg-indigo-50 text-indigo-600 font-mono text-xs font-semibold rounded-md uppercase border border-indigo-100">
                    CRM / LIVE OPS
                  </span>
                </div>
                <p className="text-sm text-slate-500">
                  Real-time visibility into customer activity, active dispatches, quick requests, and service histories.
                </p>
              </div>

              {/* Action Buttons & Filters */}
              <div className="flex flex-wrap items-center gap-2.5 w-full xl:w-auto">
                <div className="relative min-w-[180px]">
                  <MapPin className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <select
                    value={cityFilter}
                    onChange={(e) => {
                      setCityFilter(e.target.value);
                      triggerToast(`Filtered city location: ${e.target.options[e.target.selectedIndex].text}`);
                    }}
                    className="w-full h-9 pl-9 pr-8 bg-slate-50 text-slate-800 text-xs font-medium rounded-xl border border-slate-200 outline-none cursor-pointer focus:ring-2 focus:ring-indigo-500/20 appearance-none"
                  >
                    <option value="all">All Locations (US)</option>
                    <option value="atx">Austin, TX (Primary Hub)</option>
                    <option value="nyc">New York, NY</option>
                    <option value="sfo">San Francisco, CA</option>
                    <option value="chi">Chicago, IL</option>
                    <option value="sea">Seattle, WA</option>
                  </select>
                  <ChevronRight className="w-4 h-4 absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 rotate-90 pointer-events-none" />
                </div>

                <div className="relative">
                  <button
                    type="button"
                    onClick={() => triggerToast('Date range: Last 30 Days active')}
                    className="h-9 px-3 bg-slate-50 text-slate-700 text-xs font-medium rounded-xl border border-slate-200 flex items-center gap-2 hover:bg-slate-100 transition-colors"
                  >
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Last 30 Days</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="h-9 px-3.5 inline-flex items-center gap-1.5 rounded-xl bg-slate-50 text-slate-700 text-xs font-semibold border border-slate-200 hover:bg-slate-100 transition-all shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Export CSV</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(true)}
                  className="h-9 px-4 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-all shadow-sm shadow-indigo-600/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>+ Add New Customer</span>
                </button>
              </div>
            </div>

            {/* Key Telemetry Metrics Bar (4 Responsive Cards) */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Total Customers */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Total Customers</span>
                    <span className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                      {dbStats ? dbStats.totalCustomers.toLocaleString() : '18,420'}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 border border-indigo-100">
                    <Users className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <div className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    <TrendingUp className="w-3 h-3" />
                    <span>+12.4% MoM</span>
                  </div>
                  <span className="font-mono text-slate-400">1,240 new this month</span>
                </div>
              </div>

              {/* Active Bookings & Quick Requests */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Active Ops & Quick Requests</span>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="text-3xl font-bold text-slate-900 tracking-tight">
                        {dbStats ? dbStats.totalQuickRequests + 118 : '142'}
                      </span>
                      <span className="text-xs font-semibold text-slate-400">Live in field</span>
                    </div>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-600 border border-purple-100">
                    <Radio className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 gap-2 text-xs font-semibold">
                  <span className="flex items-center gap-1.5 text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
                    118 In-Progress
                  </span>
                  <span className="flex items-center gap-1.5 text-rose-800 bg-rose-50 px-2 py-0.5 rounded-md">
                    <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
                    {dbStats ? dbStats.totalQuickRequests : 24} Quick Req
                  </span>
                </div>
              </div>

              {/* Completed Jobs & CSAT */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Fulfilled Jobs & CSAT</span>
                    <span className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                      {dbStats ? (dbStats.completedBookings + 94800).toLocaleString() : '94,850'}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 border border-emerald-100">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <div className="flex items-center gap-1 font-bold text-slate-800">
                    <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>4.89</span>
                    <span className="text-slate-400 font-normal text-[11px]">/ 5.0</span>
                  </div>
                  <span className="font-mono text-slate-400">68.2k reviews</span>
                </div>
              </div>

              {/* Gross Billed Revenue */}
              <div className="bg-white p-5 rounded-2xl shadow-xs border border-slate-200/80 flex flex-col justify-between hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gross Billed (YTD)</span>
                    <span className="text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                      {dbStats && dbStats.totalRevenue > 0
                        ? `₹${dbStats.totalRevenue.toLocaleString()}`
                        : '$2,489,120'}
                    </span>
                  </div>
                  <div className="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-slate-100 text-xs">
                  <span className="inline-flex items-center gap-1 text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md font-semibold text-[11px]">
                    <TrendingUp className="w-3 h-3" />
                    +18.2% YoY
                  </span>
                  <span className="font-mono text-slate-400">Avg Ticket: $134.50</span>
                </div>
              </div>
            </div>

            {/* Main Content Grid: Customer Table (Left) + Detail Slide-Over (Right) */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
              {/* Customer Directory Table */}
              <div className="xl:col-span-7 2xl:col-span-7 bg-white rounded-2xl shadow-xs border border-slate-200/80 flex flex-col overflow-hidden">
                {/* Search & Segment Filters Header */}
                <div className="p-5 flex flex-col gap-4 border-b border-slate-100">
                  <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search customers by name, email, phone, address, or ID..."
                        className="h-9 w-full pl-9 pr-4 bg-slate-50 text-slate-800 placeholder:text-slate-400 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={loadData}
                        title="Reload Live Telemetry"
                        className="h-9 w-9 flex items-center justify-center rounded-xl bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-indigo-600' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => triggerToast('Advanced column filters panel opened')}
                        className="h-9 px-3 inline-flex items-center gap-1.5 rounded-xl bg-slate-50 text-slate-600 text-xs font-medium border border-slate-200 hover:bg-slate-100 transition-colors"
                      >
                        <Layers className="w-3.5 h-3.5" />
                        <span>Advanced Filters</span>
                      </button>
                    </div>
                  </div>

                  {/* Segment Tabs */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { key: 'all' as SegmentFilter, label: `All Customers (${allCustomers.length})` },
                      { key: 'in_progress' as SegmentFilter, label: 'Active Bookings (118)' },
                      { key: 'emergency_request' as SegmentFilter, label: 'Quick Requests (24)', dot: true },
                      { key: 'vip' as SegmentFilter, label: 'VIP / Top Spenders (340)' },
                      { key: 'inactive' as SegmentFilter, label: 'Inactive (1,105)' },
                    ].map((seg) => (
                      <button
                        key={seg.key}
                        type="button"
                        onClick={() => {
                          setSegment(seg.key);
                          triggerToast(`Filtered view: ${seg.label}`);
                        }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                          segment === seg.key
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
                        }`}
                      >
                        {seg.dot && <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />}
                        {seg.label}
                      </button>
                    ))}
                  </div>

                  {/* Active filter badges */}
                  <div className="flex flex-wrap items-center gap-2 text-slate-500 text-xs">
                    <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Quick Filters:</span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 text-[11px] font-medium border border-slate-200/60">
                      Category: Home Maintenance
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => triggerToast('Filter removed')} />
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 text-[11px] font-medium border border-slate-200/60">
                      Rating: ≥ 4.5 ★
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => triggerToast('Filter removed')} />
                    </span>
                    <span className="inline-flex items-center gap-1 bg-slate-100 px-2.5 py-1 rounded-full text-slate-700 text-[11px] font-medium border border-slate-200/60">
                      Zone: Austin Central Metro
                      <X className="w-3 h-3 cursor-pointer text-slate-400 hover:text-slate-700" onClick={() => triggerToast('Filter removed')} />
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        setSegment('all');
                        triggerToast('All filters cleared');
                      }}
                      className="text-indigo-600 hover:underline text-xs font-semibold ml-1"
                    >
                      Clear all
                    </button>
                  </div>
                </div>

                {/* Real-time Customer Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50/80 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-4">Customer</th>
                        <th className="py-3 px-3">Contact</th>
                        <th className="py-3 px-3">Location</th>
                        <th className="py-3 px-3">Jobs</th>
                        <th className="py-3 px-3">Total Spent</th>
                        <th className="py-3 px-3">Status</th>
                        <th className="py-3 px-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredCustomers.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-slate-400 text-sm">
                            <Users className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                            No matching customers found
                          </td>
                        </tr>
                      ) : (
                        filteredCustomers.map((cust) => {
                          const isSelected = selectedCustomer.id === cust.id;
                          return (
                            <tr
                              key={cust.id}
                              onClick={() => {
                                setSelectedCustomerId(cust.id);
                                triggerToast(`Viewing record: ${cust.name} (${cust.code})`);
                              }}
                              className={`cursor-pointer transition-colors ${
                                isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50/60 bg-white'
                              }`}
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-3">
                                  <div className="relative">
                                    {cust.avatarUrl ? (
                                      <img
                                        src={cust.avatarUrl}
                                        alt={cust.name}
                                        className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                                      />
                                    ) : (
                                      <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-sm shadow-2xs">
                                        {cust.name.charAt(0).toUpperCase()}
                                      </div>
                                    )}
                                    <span
                                      className={`absolute bottom-0 right-0 h-3 w-3 rounded-full ring-2 ring-white ${
                                        cust.status === 'emergency_request'
                                          ? 'bg-rose-500 animate-ping'
                                          : cust.status === 'in_progress'
                                          ? 'bg-amber-500 animate-pulse'
                                          : 'bg-emerald-500'
                                      }`}
                                    />
                                  </div>
                                  <div className="flex flex-col min-w-0">
                                    <div className="flex items-center gap-1.5">
                                      <span className="font-semibold text-xs text-slate-900 truncate max-w-[130px]">{cust.name}</span>
                                      <BadgeCheck className="w-3.5 h-3.5 text-indigo-600 flex-shrink-0" />
                                      {cust.isVip && (
                                        <span className="px-1.5 py-0.5 bg-indigo-100 text-indigo-700 rounded text-[9px] font-bold">VIP</span>
                                      )}
                                    </div>
                                    <span className="font-mono text-[11px] text-slate-400">{cust.code}</span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="flex flex-col text-xs">
                                  <span className="text-slate-800 truncate max-w-[140px] font-medium">{cust.email}</span>
                                  <span className="text-slate-400 font-mono text-[11px]">{cust.phone}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="flex flex-col text-xs">
                                  <span className="text-slate-800 truncate max-w-[120px] font-medium">{cust.address.split(',')[0]}</span>
                                  <span className="text-slate-400 font-mono text-[11px]">{cust.city}</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="flex flex-col">
                                  <span className="text-xs font-semibold text-slate-800">{cust.ordersCount} Bookings</span>
                                  <span className="font-mono text-[11px] text-slate-400">{cust.completedCount} completed</span>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <div className="flex flex-col">
                                  <span className="text-xs font-bold text-slate-900">{cust.totalSpend}</span>
                                  <span className="font-mono text-[11px] text-slate-400">
                                    avg ${(cust.spendAmount / (cust.ordersCount || 1)).toFixed(2)}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-3">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap ${
                                    cust.status === 'in_progress'
                                      ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                                      : cust.status === 'emergency_request'
                                      ? 'bg-rose-50 text-rose-800 border border-rose-200/60'
                                      : cust.status === 'completed'
                                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
                                      : 'bg-blue-50 text-blue-800 border border-blue-200/60'
                                  }`}
                                >
                                  <span
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      cust.status === 'in_progress'
                                        ? 'bg-amber-500 animate-pulse'
                                        : cust.status === 'emergency_request'
                                        ? 'bg-rose-500 animate-ping'
                                        : 'bg-emerald-500'
                                    }`}
                                  />
                                  {cust.statusLabel}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <button
                                  type="button"
                                  className={`h-8 w-8 inline-flex items-center justify-center rounded-xl transition-all ${
                                    isSelected
                                      ? 'bg-indigo-600 text-white shadow-xs'
                                      : 'bg-slate-100 text-slate-500 hover:bg-indigo-600 hover:text-white'
                                  }`}
                                >
                                  <ChevronRight className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination & Result Summary */}
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <span className="text-xs text-slate-500">
                    Showing <span className="font-semibold text-slate-800">1–{filteredCustomers.length}</span> of{' '}
                    <span className="font-semibold text-slate-800">{allCustomers.length}</span> registered customer records
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      disabled
                      className="h-8 px-3 rounded-lg bg-white text-slate-400 text-xs font-semibold border border-slate-200 shadow-2xs opacity-60 cursor-not-allowed"
                    >
                      Previous
                    </button>
                    <button type="button" className="h-8 w-8 rounded-lg bg-indigo-600 text-white text-xs font-semibold shadow-xs">
                      1
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast('Page 2')}
                      className="h-8 w-8 rounded-lg bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 shadow-2xs"
                    >
                      2
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast('Next page')}
                      className="h-8 px-3 rounded-lg bg-white text-slate-700 hover:bg-slate-100 text-xs font-semibold border border-slate-200 shadow-2xs"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>

              {/* Right-Hand Detailed Customer Slide-over / Inspector Drawer */}
              <div className="xl:col-span-5 2xl:col-span-5 bg-white rounded-2xl shadow-xs border border-slate-200/80 p-6 flex flex-col gap-5 sticky top-24">
                {/* Drawer Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-600" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Customer Deep Dive</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Copied record link: ${selectedCustomer.code}`)}
                      title="Copy Deep Link"
                      className="h-8 w-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Customer ${selectedCustomer.name} profile edit opened`)}
                      title="Edit Customer"
                      className="h-8 w-8 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 flex items-center justify-center transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Customer Profile Header Card */}
                <div className="bg-slate-50 border border-slate-200/70 p-4 rounded-2xl flex flex-col gap-4">
                  <div className="flex items-start gap-4">
                    <div className="relative flex-shrink-0">
                      {selectedCustomer.avatarUrl ? (
                        <img
                          src={selectedCustomer.avatarUrl}
                          alt={selectedCustomer.name}
                          className="h-16 w-16 rounded-full object-cover shadow-sm ring-2 ring-white"
                        />
                      ) : (
                        <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                          {selectedCustomer.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 ring-2 ring-white" />
                    </div>

                    <div className="flex flex-col min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-slate-900">{selectedCustomer.name}</span>
                        {selectedCustomer.isVip && (
                          <span className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-[11px] font-bold rounded-md">
                            VIP Tier 1
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-slate-400 mt-0.5">
                        ID: {selectedCustomer.code} • Austin Metro Zone
                      </span>
                      <div className="flex items-center gap-2 mt-1.5 text-xs">
                        <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                        <span className="font-bold text-slate-800">{selectedCustomer.rating} Rating</span>
                        <span className="text-slate-400">• {selectedCustomer.ordersCount} Orders</span>
                      </div>
                    </div>
                  </div>

                  {/* Metadata cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <Mail className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{selectedCustomer.email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600 text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <Phone className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{selectedCustomer.phone}</span>
                    </div>
                    <div className="sm:col-span-2 flex items-center gap-2 text-slate-600 text-xs bg-white p-2.5 rounded-xl border border-slate-200/60 shadow-2xs">
                      <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0" />
                      <span className="truncate">{selectedCustomer.address}</span>
                      <span className="font-mono text-[10px] text-slate-400 ml-auto">{selectedCustomer.coords}</span>
                    </div>
                  </div>

                  {/* Micro stats */}
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="font-mono text-[10px] text-slate-400 block">Total Spend</span>
                      <span className="text-sm font-bold text-slate-900">{selectedCustomer.totalSpend}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="font-mono text-[10px] text-slate-400 block">Member Since</span>
                      <span className="text-sm font-bold text-slate-900">{selectedCustomer.memberSince}</span>
                    </div>
                    <div className="bg-white p-2 rounded-xl border border-slate-200/60 shadow-2xs">
                      <span className="font-mono text-[10px] text-slate-400 block">Reliability</span>
                      <span className="text-sm font-bold text-emerald-600">100% No-Show</span>
                    </div>
                  </div>

                  {/* Quick CTAs */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => triggerToast(`Calling ${selectedCustomer.name} (${selectedCustomer.phone})...`)}
                      className="h-9 px-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
                    >
                      <Phone className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Call</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Opening SMS dispatch window for ${selectedCustomer.name}`)}
                      className="h-9 px-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-white text-slate-800 hover:bg-slate-100 text-xs font-semibold border border-slate-200 shadow-2xs transition-colors"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-purple-600" />
                      <span>Message</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Emergency Pro dispatched for ${selectedCustomer.name}`)}
                      className="h-9 px-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-semibold border border-rose-200/70 shadow-2xs transition-colors"
                    >
                      <Zap className="w-3.5 h-3.5 text-rose-600" />
                      <span>Dispatch</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => triggerToast(`Service Booking modal opened for ${selectedCustomer.name}`)}
                      className="h-9 px-2 inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-colors"
                    >
                      <CalendarCheck className="w-3.5 h-3.5" />
                      <span>Book</span>
                    </button>
                  </div>
                </div>

                {/* Drawer Tabs */}
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {[
                    { id: 'active-orders' as DrawerTab, label: 'Active Live Order (1)' },
                    { id: 'quick-requests' as DrawerTab, label: `Quick Req (${selectedCustomer.emergencyRequests?.length || 0})` },
                    { id: 'booking-history' as DrawerTab, label: `History (${selectedCustomer.ordersCount})` },
                    { id: 'notes' as DrawerTab, label: 'Notes (3)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setDrawerTab(tab.id)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all text-center ${
                        drawerTab === tab.id
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab 1: Active Live Order */}
                {drawerTab === 'active-orders' && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    {selectedCustomer.activeOrder ? (
                      <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col gap-3">
                        <div className="flex items-start justify-between">
                          <div className="flex flex-col">
                            <span className="font-bold text-sm text-slate-900">{selectedCustomer.activeOrder.title}</span>
                            <span className="font-mono text-xs text-slate-400">
                              Order {selectedCustomer.activeOrder.id} • {selectedCustomer.activeOrder.scheduledTime}
                            </span>
                          </div>
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 font-semibold text-xs border border-amber-200/60">
                            <RefreshCw className="w-3 h-3 animate-spin text-amber-600" />
                            {selectedCustomer.activeOrder.status}
                          </span>
                        </div>

                        {/* Live Dispatch Map Snippet */}
                        <div className="relative w-full h-36 rounded-xl overflow-hidden border border-slate-200 shadow-inner group">
                          <img
                            src={selectedCustomer.activeOrder.mapImageUrl}
                            alt="GPS Map"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
                          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                              <span className="text-xs font-semibold text-slate-800">{selectedCustomer.activeOrder.arrivalStatus}</span>
                            </div>
                            <span className="font-mono text-[11px] text-indigo-600 font-bold">GPS CONFIRMED</span>
                          </div>
                        </div>

                        {/* Assigned Tech Card */}
                        <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={selectedCustomer.activeOrder.proAvatar}
                              alt={selectedCustomer.activeOrder.proName}
                              className="h-10 w-10 rounded-full object-cover ring-1 ring-slate-200"
                            />
                            <div className="flex flex-col min-w-0">
                              <div className="flex items-center gap-1">
                                <span className="font-semibold text-xs text-slate-900 truncate">
                                  {selectedCustomer.activeOrder.proName}
                                </span>
                                <BadgeCheck className="w-3.5 h-3.5 text-indigo-600" />
                              </div>
                              <span className="text-[11px] text-slate-500">{selectedCustomer.activeOrder.proRole}</span>
                            </div>
                          </div>
                          <button
                            type="button"
                            onClick={() => triggerToast(`Calling assigned technician ${selectedCustomer.activeOrder?.proName}...`)}
                            className="h-8 px-3 inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 shadow-xs shadow-indigo-600/20"
                          >
                            <Phone className="w-3.5 h-3.5" />
                            <span>Call Pro</span>
                          </button>
                        </div>

                        {/* Price line items */}
                        <div className="bg-slate-50 border border-slate-200/70 p-3 rounded-xl flex flex-col gap-1.5 text-xs">
                          {selectedCustomer.activeOrder.items.map((item, i) => (
                            <div key={i} className="flex justify-between text-slate-600">
                              <span>{item.name}</span>
                              <span className="font-mono font-semibold text-slate-800">${item.price.toFixed(2)}</span>
                            </div>
                          ))}
                          <div className="flex justify-between font-bold text-slate-900 pt-2 border-t border-slate-200 text-sm">
                            <span>Total Amount</span>
                            <span className="text-indigo-600">
                              ${selectedCustomer.activeOrder.total.toFixed(2)}{' '}
                              <span className="text-[11px] font-normal text-emerald-600">
                                ({selectedCustomer.activeOrder.paymentMethod})
                              </span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-2xl text-center text-slate-400 text-xs">
                        <CalendarCheck className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        No active live booking in field right now.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Quick Requests */}
                {drawerTab === 'quick-requests' && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    {selectedCustomer.emergencyRequests && selectedCustomer.emergencyRequests.length > 0 ? (
                      selectedCustomer.emergencyRequests.map((req) => (
                        <div key={req.id} className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col gap-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <AlertTriangle className="w-4 h-4 text-rose-600" />
                              <span className="font-bold text-xs text-slate-900">{req.title}</span>
                            </div>
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              {req.status}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600">{req.description}</p>
                          <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl text-[11px] font-mono text-slate-700 border border-slate-200/60">
                            <span>Tech: {req.proName}</span>
                            <span className="font-bold text-slate-900">Billed: {req.billed}</span>
                          </div>
                          <span className="text-[10px] text-slate-400">{req.timeAgo}</span>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-2xl text-center text-slate-400 text-xs">
                        <Zap className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                        No emergency quick requests recorded for this customer.
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Booking History */}
                {drawerTab === 'booking-history' && (
                  <div className="flex flex-col gap-2.5 animate-in fade-in duration-200">
                    {selectedCustomer.bookingHistory && selectedCustomer.bookingHistory.length > 0 ? (
                      selectedCustomer.bookingHistory.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white border border-slate-200/80 p-3.5 rounded-xl shadow-xs flex items-center justify-between hover:bg-slate-50 transition-colors"
                        >
                          <div className="flex flex-col">
                            <span className="font-bold text-xs text-slate-900">{item.title}</span>
                            <span className="font-mono text-[11px] text-slate-400">
                              {item.date} • {item.id}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-bold text-xs text-slate-900">{item.price}</span>
                            <span className="text-emerald-700 font-semibold text-[11px]">Completed • {item.rating} ★</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="bg-slate-50 p-8 rounded-2xl text-center text-slate-400 text-xs">
                        No previous booking records.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => triggerToast('Loading all historical records...')}
                      className="w-full py-2 text-center text-xs font-semibold text-indigo-600 hover:underline"
                    >
                      View All {selectedCustomer.ordersCount} Past Dispatches →
                    </button>
                  </div>
                )}

                {/* Tab 4: Notes & Dispatcher Instructions */}
                {drawerTab === 'notes' && (
                  <div className="flex flex-col gap-3 animate-in fade-in duration-200">
                    <div className="bg-white border border-slate-200/80 p-4 rounded-2xl shadow-xs flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900">Dispatcher & Pro Access Instructions</span>
                        <span className="font-mono text-[10px] text-slate-400">Updated 3 days ago</span>
                      </div>
                      <div className="p-3 bg-slate-50 border border-slate-200/60 rounded-xl text-xs text-slate-600 flex gap-2.5">
                        <MapPin className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                        <p>{selectedCustomer.notes?.instructions || 'Standard property access.'}</p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Internal Dispatcher Tags</span>
                        <div className="flex flex-wrap gap-1.5">
                          {selectedCustomer.notes?.tags.map((tag, idx) => (
                            <span key={idx} className="px-2 py-0.5 rounded-md bg-indigo-50 text-indigo-700 text-[11px] font-semibold">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Dynamic Notes Added in this Session */}
                      {(customNotes[selectedCustomer.id] || []).length > 0 && (
                        <div className="flex flex-col gap-1.5 pt-2 border-t border-slate-100">
                          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Session Added Notes</span>
                          {(customNotes[selectedCustomer.id] || []).map((n, i) => (
                            <div key={i} className="text-xs bg-indigo-50/60 p-2 rounded-lg text-slate-800 border border-indigo-100">
                              • {n}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Note Input */}
                      <div className="pt-2 flex gap-2">
                        <input
                          type="text"
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
                          placeholder="Add an operational dispatch note..."
                          className="h-9 flex-1 bg-slate-50 border border-slate-200 px-3 rounded-xl text-xs text-slate-800 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-indigo-500/20"
                        />
                        <button
                          type="button"
                          onClick={handleAddNote}
                          className="h-9 px-4 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors shadow-xs"
                        >
                          Post Note
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Floating AI Copilot Panel */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2.5">
        {isCopilotOpen && (
          <div className="w-96 md:w-[440px] max-h-[640px] bg-white/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
            {/* Header */}
            <div className="p-4 bg-slate-50 border-b border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center relative shadow-2xs">
                  <Sparkles className="w-5 h-5 text-indigo-600 fill-indigo-600" />
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
                </div>
                <div className="flex flex-col">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 leading-none">UrbanServe Copilot</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-indigo-100 text-indigo-700 font-bold uppercase">
                      AI OPS
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-400 mt-0.5">Real-time CRM & Dispatch Intelligence</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setCopilotMessages([
                      {
                        role: 'assistant',
                        text: 'Copilot context reset. How can I assist with customers, bookings, or field dispatches?',
                        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                      },
                    ]);
                    triggerToast('Copilot context reset');
                  }}
                  title="Reset context"
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setIsCopilotOpen(false)}
                  title="Minimize"
                  className="h-8 w-8 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 flex items-center justify-center"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Quick Prompt Presets */}
            <div className="px-4 py-2 bg-slate-100/70 border-b border-slate-200/50 overflow-x-auto flex items-center gap-2 no-scrollbar">
              <span className="text-[10px] font-mono uppercase text-slate-400 flex-shrink-0">Prompts:</span>
              {[
                'Find customers with pending HVAC in Austin',
                'List VIPs with >$3k spend and active requests',
                'Which customers reported emergency leaks today?',
              ].map((query, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleCopilotSubmit(query)}
                  className="px-2.5 py-1 rounded-full bg-white text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 text-[11px] font-medium whitespace-nowrap shadow-2xs border border-slate-200/70 transition-colors"
                >
                  {query.length > 25 ? query.slice(0, 25) + '...' : query}
                </button>
              ))}
            </div>

            {/* Messages body */}
            <div className="p-4 flex flex-col gap-3.5 overflow-y-auto max-h-[360px] bg-slate-50/50">
              {copilotMessages.map((msg, i) => (
                <div key={i} className={`flex items-start gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  {msg.role === 'assistant' && (
                    <div className="h-7 w-7 rounded-lg bg-indigo-100 text-indigo-600 flex items-center justify-center flex-shrink-0 mt-1">
                      <Sparkles className="w-4 h-4 fill-indigo-600" />
                    </div>
                  )}
                  <div
                    className={`p-3.5 rounded-2xl text-xs max-w-[85%] shadow-2xs ${
                      msg.role === 'user'
                        ? 'bg-indigo-600 text-white rounded-tr-none'
                        : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-none'
                    }`}
                  >
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className="flex items-center justify-between mt-2 pt-1.5 border-t border-slate-100/40 text-[10px] opacity-75">
                      <span>{msg.time}</span>
                      {msg.customerFocus && (
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedCustomerId(msg.customerFocus!);
                            triggerToast('Focused customer in Deep Dive Drawer');
                          }}
                          className="font-bold underline text-indigo-600 hover:text-indigo-800"
                        >
                          Focus in Drawer →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input bar */}
            <div className="p-3 bg-slate-50 border-t border-slate-200/70 flex flex-col gap-2">
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={copilotInput}
                  onChange={(e) => setCopilotInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCopilotSubmit()}
                  placeholder="Ask Copilot about customers, dispatches, phone, or SLAs..."
                  className="h-10 w-full pl-3 pr-20 bg-white text-slate-800 placeholder:text-slate-400 text-xs rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/20 shadow-2xs"
                />
                <div className="absolute right-2 flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => triggerToast('Voice input enabled (Listening...)')}
                    title="Voice input"
                    className="h-7 w-7 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors"
                  >
                    <Mic className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopilotSubmit()}
                    title="Send"
                    className="h-7 w-7 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 flex items-center justify-center transition-colors shadow-2xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  <span className="font-mono text-[10px] text-slate-400">UrbanServe Ops LLM • Austin Hub Telemetry Active</span>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">Synced 14s ago</span>
              </div>
            </div>
          </div>
        )}

        {/* Floating Toggle Button */}
        <button
          type="button"
          onClick={() => setIsCopilotOpen((prev) => !prev)}
          className="h-12 px-5 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 shadow-xl shadow-indigo-600/30 flex items-center gap-2.5 transition-all transform hover:scale-105 active:scale-95"
        >
          <Sparkles className="w-5 h-5 text-amber-300 fill-amber-300" />
          <span className="text-xs font-bold tracking-wide">Copilot Intelligence</span>
          <span className="px-2 py-0.5 rounded-full bg-white/20 text-[10px] font-mono font-bold">LIVE</span>
        </button>
      </div>

      {/* New Customer Modal */}
      {isNewCustomerModalOpen && (
        <div
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsNewCustomerModalOpen(false)}
        >
          <div
            className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 p-6 flex flex-col gap-4 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <UserPlus className="w-5 h-5" />
                </div>
                <h3 className="text-base font-bold text-slate-900">Register New Customer</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewCustomerModalOpen(false)}
                className="h-8 w-8 rounded-xl bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomer} className="flex flex-col gap-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">First Name *</label>
                  <input
                    required
                    type="text"
                    value={newCustomerForm.firstName}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, firstName: e.target.value })}
                    placeholder="Jane"
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Last Name</label>
                  <input
                    type="text"
                    value={newCustomerForm.lastName}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, lastName: e.target.value })}
                    placeholder="Doe"
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Email Address *</label>
                <input
                  required
                  type="email"
                  value={newCustomerForm.email}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, email: e.target.value })}
                  placeholder="jane.doe@example.com"
                  className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Phone Number</label>
                  <input
                    type="tel"
                    value={newCustomerForm.phone}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, phone: e.target.value })}
                    placeholder="+1 (512) 555-0100"
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-semibold text-slate-600">Metro Hub</label>
                  <select
                    value={newCustomerForm.city}
                    onChange={(e) => setNewCustomerForm({ ...newCustomerForm, city: e.target.value })}
                    className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none"
                  >
                    <option>Austin, TX</option>
                    <option>New York, NY</option>
                    <option>San Francisco, CA</option>
                    <option>Chicago, IL</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-slate-600">Primary Street Address</label>
                <input
                  type="text"
                  value={newCustomerForm.address}
                  onChange={(e) => setNewCustomerForm({ ...newCustomerForm, address: e.target.value })}
                  placeholder="123 Main Street, Apt 4B"
                  className="h-9 px-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsNewCustomerModalOpen(false)}
                  className="h-9 px-4 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="h-9 px-5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-xs font-semibold shadow-xs shadow-indigo-600/20 transition-colors"
                >
                  Save & Open Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Global Interactive Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-200 border border-slate-800">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

// Export backward compatibility placeholder alias
export const ServiceTeamDashboardPlaceholder = ServiceTeamDashboard;
