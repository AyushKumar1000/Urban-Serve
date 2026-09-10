import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Auth Features
import { ChooseLoginType } from './features/auth/ChooseLoginType';
import { CustomerLogin } from './features/auth/customer/CustomerLogin';
import { CustomerSignup } from './features/auth/customer/CustomerSignup';
import { ServiceTeamLogin } from './features/auth/service-team/ServiceTeamLogin';
import { ServiceTeamSignup } from './features/auth/service-team/ServiceTeamSignup';
import { PendingApproval } from './features/auth/service-team/PendingApproval';
import { ServiceTeamDashboardPlaceholder } from './features/auth/service-team/ServiceTeamDashboardPlaceholder';
import { ForgotPasswordStub } from './features/auth/ForgotPasswordStub';

// Feature 2: Scheduled Booking
import { HomeDiscover } from './pages/HomeDiscover';
import { ServiceList } from './features/scheduled-booking/ServiceList';
import { ServiceDetail } from './features/scheduled-booking/ServiceDetail';
import { BookingConfirm } from './features/scheduled-booking/BookingConfirm';
import { PaymentStub } from './features/scheduled-booking/PaymentStub';
import { BookingSuccess } from './features/scheduled-booking/BookingSuccess';
import { MyBookings } from './features/scheduled-booking/MyBookings';
import { BookingDetail } from './features/scheduled-booking/BookingDetail';
import { RateReview } from './features/scheduled-booking/RateReview';

// Feature 3: Quick Service
import { QuickServiceEntry } from './features/quick-service/QuickServiceEntry';
import { QuickServiceMatching } from './features/quick-service/QuickServiceMatching';
import { QuickServiceTracking } from './features/quick-service/QuickServiceTracking';

const ProtectedRoute = ({ children, role }: { children: React.ReactNode, role: string }) => {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!user) return <Navigate to="/" />;
  if (user.role !== role) return <Navigate to="/" />;
  return <>{children}</>;
};

function App() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  return (
    <Routes>
      <Route path="/" element={
        user ? (
          user.role === 'customer' ? <Navigate to="/home" /> : 
          user.approvalStatus === 'pending' ? <Navigate to="/service-pending" /> :
          <Navigate to="/service-dashboard" />
        ) : <ChooseLoginType />
      } />
      
      {/* Auth Routes */}
      <Route path="/auth/customer/login" element={<CustomerLogin />} />
      <Route path="/auth/customer/signup" element={<CustomerSignup />} />
      <Route path="/auth/service-team/login" element={<ServiceTeamLogin />} />
      <Route path="/auth/service-team/signup" element={<ServiceTeamSignup />} />
      <Route path="/auth/forgot-password" element={<ForgotPasswordStub />} />

      {/* Service Team Protected Routes */}
      <Route path="/service-pending" element={<ProtectedRoute role="service_team"><PendingApproval /></ProtectedRoute>} />
      <Route path="/service-dashboard" element={<ProtectedRoute role="service_team"><ServiceTeamDashboardPlaceholder /></ProtectedRoute>} />

      {/* Customer Protected Routes */}
      <Route path="/home" element={<ProtectedRoute role="customer"><HomeDiscover /></ProtectedRoute>} />
      <Route path="/services" element={<ProtectedRoute role="customer"><ServiceList /></ProtectedRoute>} />
      <Route path="/services/:id" element={<ProtectedRoute role="customer"><ServiceDetail /></ProtectedRoute>} />
      <Route path="/book/confirm" element={<ProtectedRoute role="customer"><BookingConfirm /></ProtectedRoute>} />
      <Route path="/book/payment" element={<ProtectedRoute role="customer"><PaymentStub /></ProtectedRoute>} />
      <Route path="/book/success" element={<ProtectedRoute role="customer"><BookingSuccess /></ProtectedRoute>} />
      <Route path="/my-bookings" element={<ProtectedRoute role="customer"><MyBookings /></ProtectedRoute>} />
      <Route path="/my-bookings/:id" element={<ProtectedRoute role="customer"><BookingDetail /></ProtectedRoute>} />
      <Route path="/book/rate/:id" element={<ProtectedRoute role="customer"><RateReview /></ProtectedRoute>} />

      {/* Quick Service Routes (Customer) */}
      <Route path="/quick-service" element={<ProtectedRoute role="customer"><QuickServiceEntry /></ProtectedRoute>} />
      <Route path="/quick-service/match/:id" element={<ProtectedRoute role="customer"><QuickServiceMatching /></ProtectedRoute>} />
      <Route path="/quick-service/track/:id" element={<ProtectedRoute role="customer"><QuickServiceTracking /></ProtectedRoute>} />
      
      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;
