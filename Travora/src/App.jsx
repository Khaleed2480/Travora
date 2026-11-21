import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { TravoraProvider, useTravora } from './context/TravoraContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import DetailModals from './components/DetailModals';
import LandingPage from './pages/LandingPage';
import AnimatedFormPage from './pages/AnimatedFormPage';
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import StaysActivitiesPage from './pages/StaysActivitiesPage';
import TourGuidesPage from './pages/TourGuidesPage';
import BookTripPage from './pages/BookTripPage';
import ProfilePage from './pages/ProfilePage';
import './styles/animations.css';

function TravoraShell() {
  const { activePage, toast } = useTravora();

  const isEntryScreen = activePage === 'landing' || activePage === 'form';

  const renderPage = () => {
    switch (activePage) {
      case 'landing':
        return <LandingPage />;
      case 'form':
        return <AnimatedFormPage />;
      case 'destinations':
        return <DestinationsPage />;
      case 'stays':
        return <StaysActivitiesPage />;
      case 'guides':
        return <TourGuidesPage />;
      case 'book':
        return <BookTripPage />;
      case 'profile':
        return <ProfilePage />;
      case 'home':
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F7F8FA] text-[#0B1B36]">
      {!isEntryScreen && <Navbar />}
      <main className="flex-1">{renderPage()}</main>
      {!isEntryScreen && <Footer />}

      <AuthModal />
      <DetailModals />

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl bg-[#0B1B36] px-4 py-3 text-xs font-semibold text-white shadow-2xl ring-1 ring-white/15">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-[#E85A34]" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <TravoraProvider>
      <TravoraShell />
    </TravoraProvider>
  );
}