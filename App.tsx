import React, { useState } from 'react';
import { useStore } from './lib/store.tsx';
import { View, Booking } from './types.ts';
import Layout from './components/Layout.tsx';
import LoginView from './views/LoginView.tsx';
import OnboardingView from './views/OnboardingView.tsx';
import DashboardView from './views/DashboardView.tsx';
import AvailabilityView from './views/AvailabilityView.tsx';
import HistoryView from './views/HistoryView.tsx';
import RevenueView from './views/RevenueView.tsx';
import SettingsView from './views/SettingsView.tsx';
import AddBookingView from './views/AddBookingView.tsx';
import BookingConfirmedView from './views/BookingConfirmedView.tsx';
import CustomersView from './views/CustomersView.tsx';
import { ManageTurfsView, EditTurfView, SubscriptionView, LegalView, SupportView } from './views/ManagementViews.tsx';
import AdminView from './views/AdminView.tsx';
import ConfirmationModal from './components/Modal.tsx';

export default function App() {
  const { 
    state, 
    isInitialized, 
    login, 
    verifyOtp, 
    logout, 
    setOnboarding, 
    saveBooking, 
    cancelBooking, 
    setSelectedTurf, 
    updateTurf, 
    deleteTurf, 
    setEditingBooking,
    setCurrentView 
  } = useStore();

  const [isOTP, setIsOTP] = useState(false);
  const [showConfirm, setShowConfirm] = useState<'logout' | 'delete' | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isInitialized) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  // Auth Guard
  if (!state.isLoggedIn) {
    return (
      <LoginView 
        onSendOTP={(mobile) => { login(mobile); setIsOTP(true); }}
        onVerifyOTP={(otp) => { verifyOtp(otp); setIsOTP(false); }}
        isOTPStage={isOTP}
        tempMobile={state.tempMobile}
        onBack={() => setIsOTP(false)}
      />
    );
  }

  // Onboarding Guard
  if (state.turfs.length === 0) {
    return <OnboardingView onComplete={setOnboarding} />;
  }

  // Admin View (Internal Only)
  if (state.currentView === View.ADMIN) {
    return <AdminView />;
  }

  const renderView = () => {
    switch (state.currentView) {
      case View.DASHBOARD:
        return (
          <DashboardView 
            turfs={state.turfs} 
            selectedTurfId={state.selectedTurfId} 
            onSelectTurf={setSelectedTurf} 
            bookings={state.bookings} 
          />
        );
      case View.AVAILABILITY:
        return (
          <AvailabilityView 
            turfs={state.turfs}
            selectedTurfId={state.selectedTurfId}
            onSelectTurf={setSelectedTurf}
            bookings={state.bookings}
            onSlotClick={() => { setEditingBooking(null); setCurrentView(View.ADD_BOOKING); }}
            onEditBooking={(b) => { setEditingBooking(b); setCurrentView(View.ADD_BOOKING); }}
            onCancelBooking={cancelBooking}
          />
        );
      case View.HISTORY:
        return (
          <HistoryView 
            bookings={state.bookings.filter(b => state.selectedTurfId === 'all' ? true : b.turfId === state.selectedTurfId)}
            turfs={state.turfs}
            selectedTurfId={state.selectedTurfId}
            onSelectTurf={setSelectedTurf}
          />
        );
      case View.REVENUE:
        return (
          <RevenueView 
            bookings={state.bookings.filter(b => state.selectedTurfId === 'all' ? true : b.turfId === state.selectedTurfId)}
            turfs={state.turfs}
            selectedTurfId={state.selectedTurfId}
            onSelectTurf={setSelectedTurf}
          />
        );
      case View.SETTINGS:
        return (
          <SettingsView 
            turf={state.turfs.find(t => t.id === state.selectedTurfId) || state.turfs[0]}
            onLogout={() => setShowConfirm('logout')}
            onNavigate={setCurrentView}
            onDeleteAccount={() => setShowConfirm('delete')}
          />
        );
      case View.CUSTOMERS:
        return (
          <CustomersView 
            bookings={state.bookings} 
            onCustomerSelect={(mobile) => { /* handle customer drill down */ }} 
          />
        );
      case View.EDIT_TURF:
        return (
          <ManageTurfsView 
            turfs={state.turfs} 
            onAdd={() => setCurrentView(View.MANAGE_TURFS)} // Simplified flow
            onEdit={(t) => setCurrentView(View.MANAGE_TURFS)} 
            onBack={() => setCurrentView(View.SETTINGS)}
          />
        );
      case View.MANAGE_TURFS:
        return (
          <EditTurfView 
            turf={null} 
            onSave={(t) => { updateTurf(t); setCurrentView(View.SETTINGS); }} 
            onDelete={(id) => { deleteTurf(id); setCurrentView(View.SETTINGS); }} 
          />
        );
      case View.ADD_BOOKING:
        return (
          <AddBookingView 
            turf={state.turfs.find(t => t.id === state.selectedTurfId) || state.turfs[0]}
            onAdd={saveBooking}
            onConfirm={(b) => { setConfirmedBooking(b); setCurrentView(View.BOOKING_CONFIRMED); }}
            initialData={state.editingBooking}
          />
        );
      case View.BOOKING_CONFIRMED:
        return confirmedBooking ? (
          <BookingConfirmedView booking={confirmedBooking} onDone={() => setCurrentView(View.DASHBOARD)} />
        ) : null;
      case View.SUBSCRIPTION:
        return <SubscriptionView />;
      case View.LEGAL:
        return <LegalView />;
      case View.SUPPORT:
        return <SupportView />;
      default:
        return <DashboardView turfs={state.turfs} selectedTurfId={state.selectedTurfId} onSelectTurf={setSelectedTurf} bookings={state.bookings} />;
    }
  };

  return (
    <Layout currentView={state.currentView} onNavigate={setCurrentView}>
      {renderView()}
      
      <ConfirmationModal 
        isOpen={!!showConfirm}
        onClose={() => setShowConfirm(null)}
        onConfirm={() => {
          if (showConfirm === 'logout' || showConfirm === 'delete') logout();
          setShowConfirm(null);
        }}
        title={showConfirm === 'logout' ? 'Logout?' : 'Delete Account?'}
        description={showConfirm === 'logout' ? 'You will be signed out.' : 'This will erase all data.'}
        confirmLabel={showConfirm === 'logout' ? 'Logout' : 'Delete All'}
        isDanger={showConfirm === 'delete'}
      />
    </Layout>
  );
}