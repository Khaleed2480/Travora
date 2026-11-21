import React, { createContext, useContext, useState, useEffect } from 'react';
import { DESTINATIONS, HOTELS, ACTIVITIES } from '../data/travelData';

const TravoraContext = createContext(null);

const STORAGE_KEYS = {
  USER: 'travora_user_v1',
  SAVED: 'travora_saved_v1',
  BOOKINGS: 'travora_bookings_v1',
};

export function TravoraProvider({ children }) {
  const [activePage, setActivePage] = useState('landing'); // home | destinations | stays | guides | book | profile
  const [staysTab, setStaysTab] = useState('hotels'); // hotels | activities
  const [globalSearch, setGlobalSearch] = useState('');

  // Persisted User Auth MVP
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.USER);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  // Saved destination IDs
  const [savedIds, setSavedIds] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.SAVED);
      return raw ? JSON.parse(raw) : ['amalfi-coast', 'kyoto'];
    } catch {
      return ['amalfi-coast', 'kyoto'];
    }
  });

  // Confirmed itinerary previews
  const [bookingHistory, setBookingHistory] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.BOOKINGS);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Live Itinerary Draft for Book Trip page
  const [draftTrip, setDraftTrip] = useState({
    destinationId: 'amalfi-coast',
    checkIn: '2026-12-12',
    checkOut: '2026-12-16',
    travelers: 2,
    hotelId: 'belvedere-cliffside',
    activityIds: ['dawn-walk-path-of-gods'],
    guideId: '',
  });

  // Modals & Notifications
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | signup | forgot
  const [detailModal, setDetailModal] = useState(null); // { type: 'destination' | 'hotel' | 'guide', data }
  const [toast, setToast] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SAVED, JSON.stringify(savedIds));
  }, [savedIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.BOOKINGS, JSON.stringify(bookingHistory));
  }, [bookingHistory]);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.USER);
    }
  }, [user]);

  const showToast = (message, tone = 'success') => {
    setToast({ id: Date.now(), message, tone });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2900 ? null : prev));
    }, 3100);
  };

  const navigate = (page, options = {}) => {
    setActivePage(page);
    if (options.staysTab) setStaysTab(options.staysTab);
    if (typeof options.search === 'string') setGlobalSearch(options.search);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleSaveDestination = (destinationId) => {
    const dest = DESTINATIONS.find((d) => d.id === destinationId);
    setSavedIds((prev) => {
      const exists = prev.includes(destinationId);
      const next = exists ? prev.filter((id) => id !== destinationId) : [...prev, destinationId];
      showToast(
        exists
          ? `Removed ${dest?.name || 'destination'} from your shortlist.`
          : `Saved ${dest?.name || 'destination'} to your shortlist.`
      );
      return next;
    });
  };

  const planDestinationTrip = (destinationId) => {
    const matchingHotel = HOTELS.find((h) => h.destinationId === destinationId);
    const matchingAct = ACTIVITIES.find((a) => a.destinationId === destinationId);
    setDraftTrip((prev) => ({
      ...prev,
      destinationId,
      hotelId: matchingHotel ? matchingHotel.id : '',
      activityIds: matchingAct ? [matchingAct.id] : [],
    }));
    navigate('book');
  };

  const bookSpecificHotel = (hotel) => {
    setDraftTrip((prev) => ({
      ...prev,
      destinationId: hotel.destinationId,
      hotelId: hotel.id,
    }));
    navigate('book');
    showToast(`${hotel.name} selected in your Trip Planner.`);
  };

  const addActivityToTrip = (activity) => {
    setDraftTrip((prev) => {
      const alreadyAdded = prev.activityIds.includes(activity.id);
      const nextActivities = alreadyAdded
        ? prev.activityIds
        : [...prev.activityIds, activity.id];
      return {
        ...prev,
        destinationId: activity.destinationId,
        activityIds: nextActivities,
      };
    });
    showToast(`Added "${activity.title}" to your trip draft.`);
  };

  const selectGuideForTrip = (guide) => {
    const destId = guide.destinationIds[0] || draftTrip.destinationId;
    const matchingHotel = HOTELS.find((h) => h.destinationId === destId);
    setDraftTrip((prev) => ({
      ...prev,
      destinationId: destId,
      hotelId: prev.destinationId === destId ? prev.hotelId : matchingHotel?.id || '',
      guideId: guide.id,
    }));
    navigate('book');
    showToast(`${guide.name} attached to your itinerary.`);
  };

  const confirmBookingPreview = (record) => {
    const newRecord = {
      ...record,
      id: `TRV-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
    };
    setBookingHistory((prev) => [newRecord, ...prev]);
    showToast('Itinerary preview saved to your Booking History!');
    return newRecord;
  };

  const openAuth = (mode = 'login') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const loginUser = ({ name, email }) => {
    setUser({
      name: name || email.split('@')[0],
      email,
      joinedAt: 'November 2026',
    });
    setAuthModalOpen(false);
    showToast(`Welcome to Travora, ${name || email.split('@')[0]}!`);
  };

  const logoutUser = () => {
    setUser(null);
    if (activePage === 'profile') setActivePage('home');
    showToast('Signed out cleanly.');
  };

  return (
    <TravoraContext.Provider
      value={{
        activePage,
        navigate,
        staysTab,
        setStaysTab,
        globalSearch,
        setGlobalSearch,
        user,
        loginUser,
        logoutUser,
        savedIds,
        toggleSaveDestination,
        draftTrip,
        setDraftTrip,
        planDestinationTrip,
        bookSpecificHotel,
        addActivityToTrip,
        selectGuideForTrip,
        bookingHistory,
        confirmBookingPreview,
        authModalOpen,
        setAuthModalOpen,
        authMode,
        setAuthMode,
        openAuth,
        detailModal,
        setDetailModal,
        toast,
        showToast,
      }}
    >
      {children}
    </TravoraContext.Provider>
  );
}

export const useTravora = () => useContext(TravoraContext);