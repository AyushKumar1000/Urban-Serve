import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import {
  getDashboardStatsApi,
  getAllCustomersApi,
  getCustomerDetailApi,
  getAllBookingsApi,
  getAllQuickRequestsApi,
  DashboardStats,
  AdminCustomer,
  AdminBooking,
  AdminQuickRequest,
  CustomerDetail,
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
  BookOpen,
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
  Loader2,
} from 'lucide-react';

type TabType = 'overview' | 'customers' | 'bookings' | 'requests';

export const ServiceTeamDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [bookings, setBookings] = useState<AdminBooking[]>([]);
  const [quickRequests, setQuickRequests] = useState<AdminQuickRequest[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetail | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Load initial data
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [statsData, customersData, bookingsData, requestsData] = await Promise.all([
        getDashboardStatsApi(),
        getAllCustomersApi(),
        getAllBookingsApi(),
        getAllQuickRequestsApi(),
      ]);
      setStats(statsData);
      setCustomers(customersData);
      setBookings(bookingsData);
      setQuickRequests(requestsData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  // Search customers
  const handleSearchCustomers = async (query: string) => {
    setSearchQuery(query);
    try {
      const results = await getAllCustomersApi(query || undefined);
      setCustomers(results);
    } catch (err) {
      // keep existing data
    }
  };

  // Filter bookings
  const handleFilterBookings = async (status: string) => {
    setBookingStatusFilter(status);
    try {
      const results = await getAllBookingsApi(status || undefined);
      setBookings(results);
    } catch (err) {
      // keep existing data
    }
  };

  // Load customer detail
  const handleViewCustomer = async (customerId: string) => {
    try {
      const detail = await getCustomerDetailApi(customerId);
      setSelectedCustomer(detail);
    } catch (err) {
      console.error('Failed to load customer detail:', err);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
    });
  };

  const formatDateTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleString('en-US', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-700';
      case 'in_progress': return 'bg-yellow-100 text-yellow-700';
      case 'completed': return 'bg-green-100 text-green-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      case 'searching': return 'bg-purple-100 text-purple-700';
      case 'matched': return 'bg-indigo-100 text-indigo-700';
      case 'en_route': return 'bg-orange-100 text-orange-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (user?.approvalStatus === 'pending') {
    return <div className="p-8 text-center text-red-500">Access Denied: Pending Approval</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-900">
      {/* Top Navigation */}
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-bold text-lg leading-tight">UrbanServe</h1>
                <p className="text-indigo-300 text-xs">Service Team Dashboard</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={loadData}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-all"
                title="Refresh Data"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <div className="text-right hidden sm:block">
                <p className="text-white text-sm font-medium">{user?.name}</p>
                <p className="text-indigo-300 text-xs">{user?.serviceCategory} Pro</p>
              </div>
              <button
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 transition-all text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Tab Navigation */}
      <div className="bg-slate-800/50 backdrop-blur border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 overflow-x-auto py-2">
            {[
              { id: 'overview' as TabType, label: 'Overview', icon: LayoutDashboard },
              { id: 'customers' as TabType, label: 'Customers', icon: Users },
              { id: 'bookings' as TabType, label: 'Bookings', icon: BookOpen },
              { id: 'requests' as TabType, label: 'Quick Requests', icon: Zap },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-500/20 text-indigo-300 shadow-lg shadow-indigo-500/10'
                    : 'text-white/50 hover:text-white/80 hover:bg-white/5'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-300">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
            <button onClick={loadData} className="ml-auto text-red-400 hover:text-red-300 underline text-sm">
              Retry
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-white/50 text-sm">Loading dashboard data from PostgreSQL...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && stats && (
              <div className="space-y-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    icon={Users}
                    label="Total Customers"
                    value={stats.totalCustomers}
                    color="from-blue-500 to-cyan-500"
                  />
                  <StatCard
                    icon={CalendarCheck}
                    label="Total Bookings"
                    value={stats.totalBookings}
                    color="from-indigo-500 to-purple-500"
                  />
                  <StatCard
                    icon={CheckCircle2}
                    label="Completed"
                    value={stats.completedBookings}
                    color="from-emerald-500 to-green-500"
                  />
                  <StatCard
                    icon={DollarSign}
                    label="Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    color="from-amber-500 to-orange-500"
                  />
                </div>

                {/* Quick Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Customers */}
                  <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <Users className="w-4 h-4 text-indigo-400" />
                        Recent Customers
                      </h3>
                      <button
                        onClick={() => setActiveTab('customers')}
                        className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {customers.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-8">No customers yet</p>
                    ) : (
                      <div className="space-y-3">
                        {customers.slice(0, 5).map(customer => (
                          <div key={customer.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                              {customer.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{customer.name}</p>
                              <p className="text-white/40 text-xs truncate">{customer.email}</p>
                            </div>
                            <span className="text-white/30 text-xs">{formatDate(customer.createdAt)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Bookings */}
                  <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-white font-semibold flex items-center gap-2">
                        <CalendarCheck className="w-4 h-4 text-emerald-400" />
                        Recent Bookings
                      </h3>
                      <button
                        onClick={() => setActiveTab('bookings')}
                        className="text-indigo-400 hover:text-indigo-300 text-xs flex items-center gap-1"
                      >
                        View All <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {bookings.length === 0 ? (
                      <p className="text-white/40 text-sm text-center py-8">No bookings yet</p>
                    ) : (
                      <div className="space-y-3">
                        {bookings.slice(0, 5).map(booking => (
                          <div key={booking.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all">
                            <div className="flex-1 min-w-0">
                              <p className="text-white text-sm font-medium truncate">{booking.serviceTitle}</p>
                              <p className="text-white/40 text-xs truncate">by {booking.customerName}</p>
                            </div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.replace('_', ' ')}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Database Info */}
                <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-green-400" />
                    <h3 className="text-white font-semibold">Database Status</h3>
                  </div>
                  <div className="flex flex-wrap gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white/60">PostgreSQL Connected</span>
                    </div>
                    <div className="text-white/30">|</div>
                    <span className="text-white/60">{stats.totalCustomers} users stored</span>
                    <div className="text-white/30">|</div>
                    <span className="text-white/60">{stats.totalBookings} bookings stored</span>
                    <div className="text-white/30">|</div>
                    <span className="text-white/60">{stats.totalQuickRequests} quick requests stored</span>
                  </div>
                </div>
              </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                  <input
                    type="text"
                    placeholder="Search customers by name, email, or phone..."
                    value={searchQuery}
                    onChange={(e) => handleSearchCustomers(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50"
                  />
                </div>

                {/* Customer Count */}
                <p className="text-white/40 text-sm">{customers.length} customer{customers.length !== 1 ? 's' : ''} found</p>

                {/* Customer Grid */}
                {customers.length === 0 ? (
                  <div className="text-center py-16">
                    <Users className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No customers registered yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {customers.map(customer => (
                      <div
                        key={customer.id}
                        onClick={() => handleViewCustomer(customer.id)}
                        className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-5 hover:bg-white/8 hover:border-indigo-500/30 transition-all cursor-pointer group"
                      >
                        <div className="flex items-start gap-3 mb-4">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                            {customer.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-semibold truncate group-hover:text-indigo-300 transition-colors">
                              {customer.name}
                            </h4>
                            <p className="text-white/40 text-xs">{formatDate(customer.createdAt)}</p>
                          </div>
                          <ChevronRight className="w-4 h-4 text-white/20 group-hover:text-indigo-400 transition-colors" />
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-white/50">
                            <Mail className="w-3.5 h-3.5" />
                            <span className="truncate">{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-white/50">
                              <Phone className="w-3.5 h-3.5" />
                              <span>{customer.phone}</span>
                            </div>
                          )}
                          {customer.address && (
                            <div className="flex items-center gap-2 text-white/50">
                              <MapPin className="w-3.5 h-3.5" />
                              <span className="truncate">{customer.address}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <div className="space-y-4">
                {/* Filters */}
                <div className="flex flex-wrap gap-2">
                  {['', 'confirmed', 'in_progress', 'completed', 'cancelled'].map(status => (
                    <button
                      key={status}
                      onClick={() => handleFilterBookings(status)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        bookingStatusFilter === status
                          ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          : 'bg-white/5 text-white/50 border border-white/10 hover:bg-white/10'
                      }`}
                    >
                      {status === '' ? 'All' : status.replace('_', ' ')}
                    </button>
                  ))}
                </div>

                <p className="text-white/40 text-sm">{bookings.length} booking{bookings.length !== 1 ? 's' : ''}</p>

                {/* Bookings Table */}
                {bookings.length === 0 ? (
                  <div className="text-center py-16">
                    <BookOpen className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No bookings found</p>
                  </div>
                ) : (
                  <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left text-white/50 font-medium px-5 py-3">Service</th>
                            <th className="text-left text-white/50 font-medium px-5 py-3">Customer</th>
                            <th className="text-left text-white/50 font-medium px-5 py-3">Scheduled</th>
                            <th className="text-left text-white/50 font-medium px-5 py-3">Price</th>
                            <th className="text-left text-white/50 font-medium px-5 py-3">Status</th>
                            <th className="text-left text-white/50 font-medium px-5 py-3">Rating</th>
                          </tr>
                        </thead>
                        <tbody>
                          {bookings.map(booking => (
                            <tr key={booking.id} className="border-b border-white/5 hover:bg-white/5 transition-all">
                              <td className="px-5 py-4">
                                <p className="text-white font-medium">{booking.serviceTitle || '—'}</p>
                                <p className="text-white/40 text-xs">{booking.serviceCategory}</p>
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-white">{booking.customerName}</p>
                                <p className="text-white/40 text-xs">{booking.customerPhone}</p>
                              </td>
                              <td className="px-5 py-4 text-white/60">
                                {booking.scheduledTime ? formatDateTime(booking.scheduledTime) : '—'}
                              </td>
                              <td className="px-5 py-4 text-white font-medium">
                                ₹{booking.price}
                              </td>
                              <td className="px-5 py-4">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                                  {booking.status.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="px-5 py-4">
                                {booking.reviewRating ? (
                                  <div className="flex items-center gap-1">
                                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                    <span className="text-white">{booking.reviewRating}</span>
                                  </div>
                                ) : (
                                  <span className="text-white/30">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Quick Requests Tab */}
            {activeTab === 'requests' && (
              <div className="space-y-4">
                <p className="text-white/40 text-sm">{quickRequests.length} quick service request{quickRequests.length !== 1 ? 's' : ''}</p>

                {quickRequests.length === 0 ? (
                  <div className="text-center py-16">
                    <Zap className="w-12 h-12 text-white/20 mx-auto mb-3" />
                    <p className="text-white/40">No quick service requests yet</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {quickRequests.map(req => (
                      <div key={req.id} className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-5">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="text-white font-semibold">{req.serviceType}</h4>
                            <p className="text-white/40 text-xs mt-0.5">by {req.customerName}</p>
                          </div>
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(req.status)}`}>
                            {req.status.replace('_', ' ')}
                          </span>
                        </div>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-white/50">
                            <MapPin className="w-3.5 h-3.5" />
                            <span className="truncate">{req.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-white/50">
                            <Clock className="w-3.5 h-3.5" />
                            <span>Requested: {formatDateTime(req.requestedAt)}</span>
                          </div>
                          {req.professionalName && (
                            <div className="flex items-center gap-2 text-indigo-300">
                              <Users className="w-3.5 h-3.5" />
                              <span>Assigned to: {req.professionalName}</span>
                            </div>
                          )}
                          {req.etaMinutes && (
                            <div className="flex items-center gap-2 text-emerald-300">
                              <Clock className="w-3.5 h-3.5" />
                              <span>ETA: {req.etaMinutes} min ({req.distanceKm} km)</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 pt-3 border-t border-white/5 flex gap-3 text-xs text-white/30">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {req.customerEmail}
                          </span>
                          {req.customerPhone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3" /> {req.customerPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setSelectedCustomer(null)}>
          <div
            className="bg-slate-800 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[80vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-white/10 p-5 flex items-center justify-between rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
                  {selectedCustomer.customer.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg">{selectedCustomer.customer.name}</h3>
                  <p className="text-white/40 text-xs">Customer since {formatDate(selectedCustomer.customer.createdAt)}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 rounded-lg hover:bg-white/10 text-white/50 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 space-y-6">
              {/* Contact Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 text-sm">
                  <Mail className="w-4 h-4 text-indigo-400" />
                  <span className="text-white">{selectedCustomer.customer.email}</span>
                </div>
                {selectedCustomer.customer.phone && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 text-sm">
                    <Phone className="w-4 h-4 text-green-400" />
                    <span className="text-white">{selectedCustomer.customer.phone}</span>
                  </div>
                )}
                {selectedCustomer.customer.address && (
                  <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3 text-sm col-span-full">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    <span className="text-white">{selectedCustomer.customer.address}</span>
                  </div>
                )}
              </div>

              {/* Bookings History */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CalendarCheck className="w-4 h-4 text-indigo-400" />
                  Bookings ({selectedCustomer.bookings.length})
                </h4>
                {selectedCustomer.bookings.length === 0 ? (
                  <p className="text-white/30 text-sm">No bookings</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.bookings.map(booking => (
                      <div key={booking.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{booking.serviceTitle}</p>
                          <p className="text-white/40 text-xs">{formatDateTime(booking.scheduledTime)} · ₹{booking.price}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                          {booking.status.replace('_', ' ')}
                        </span>
                        {booking.reviewRating && (
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-white text-xs">{booking.reviewRating}</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Requests History */}
              <div>
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-400" />
                  Quick Requests ({selectedCustomer.quickRequests.length})
                </h4>
                {selectedCustomer.quickRequests.length === 0 ? (
                  <p className="text-white/30 text-sm">No quick service requests</p>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.quickRequests.map(qr => (
                      <div key={qr.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{qr.serviceType}</p>
                          <p className="text-white/40 text-xs">{formatDateTime(qr.requestedAt)}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(qr.status)}`}>
                          {qr.status.replace('_', ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Stat Card Component
const StatCard: React.FC<{
  icon: React.FC<any>;
  label: string;
  value: string | number;
  color: string;
}> = ({ icon: Icon, label, value, color }) => (
  <div className="bg-white/5 backdrop-blur rounded-2xl border border-white/10 p-5 hover:bg-white/8 transition-all group">
    <div className="flex items-center gap-4">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div>
        <p className="text-white/40 text-xs uppercase tracking-wider">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

// Keep old export name for backwards compatibility
export const ServiceTeamDashboardPlaceholder = ServiceTeamDashboard;
