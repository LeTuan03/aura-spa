import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { Footer } from './components/common/Footer';
import { LoginView } from './components/auth/LoginView';
import { ProtectedRoute } from './components/auth/ProtectedRoute';

// Client Views
import { LandingView } from './components/client/LandingView';
import { ServicesView } from './components/client/ServicesView';
import { BookingWizard } from './components/client/BookingWizard';
import { MyBookingsView } from './components/client/MyBookingsView';
import { UserProfileView } from './components/client/UserProfileView';

// Admin Views
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminBookingCalendar } from './components/admin/AdminBookingCalendar';
import { AdminServiceMgmt } from './components/admin/AdminServiceMgmt';
import { AdminStaffMgmt } from './components/admin/AdminStaffMgmt';
import { AdminBranchMgmt } from './components/admin/AdminBranchMgmt';
import { AdminCustomerMgmt } from './components/admin/AdminCustomerMgmt';
import { AdminReports } from './components/admin/AdminReports';
import { AdminSettings } from './components/admin/AdminSettings';

const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-white font-sans antialiased text-zinc-900 flex flex-col selection:bg-zinc-800 selection:text-white">
      {/* Main Navigation Bar */}
      <Navbar />

      {/* Primary View Container */}
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingView />} />
          <Route path="/services" element={<ServicesView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/booking" element={<BookingWizard />} />

          {/* Protected Client Routes */}
          <Route 
            path="/my-bookings" 
            element={
              <ProtectedRoute allowedRoles={['client', 'super_admin', 'branch_manager', 'staff']}>
                <MyBookingsView />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute allowedRoles={['client', 'super_admin', 'branch_manager', 'staff']}>
                <UserProfileView />
              </ProtectedRoute>
            } 
          />

          {/* Protected Admin Routes */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager', 'staff']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminDashboard />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/bookings" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager', 'staff']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminBookingCalendar />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/services" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminServiceMgmt />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/staff" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminStaffMgmt />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/branches" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminBranchMgmt />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/customers" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager', 'staff']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminCustomerMgmt />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/reports" 
            element={
              <ProtectedRoute allowedRoles={['super_admin', 'branch_manager']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminReports />
                </div>
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/settings" 
            element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                  <AdminSettings />
                </div>
              </ProtectedRoute>
            } 
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </BrowserRouter>
  );
}
