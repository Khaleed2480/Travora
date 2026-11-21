import React, { useState } from 'react';
import { Compass, User, Menu, X, Bookmark, CalendarCheck, LogOut } from 'lucide-react';
import { useTravora } from '../context/TravoraContext';

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'destinations', label: 'Destinations' },
  { id: 'stays', label: 'Stays & Activities' },
  { id: 'guides', label: 'Tour Guides' },
  { id: 'book', label: 'Book Trip' },
];

export default function Navbar() {
  const { activePage, navigate, user, openAuth, logoutUser, savedIds, bookingHistory } =
    useTravora();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNav = (id) => {
    navigate(id);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <button
          onClick={() => handleNav('home')}
          className="group flex items-center gap-2.5 focus:outline-none"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0B1B36] text-white shadow-sm transition-transform duration-300 group-hover:rotate-12">
            <Compass className="h-5 w-5 text-[#E85A34]" />
          </span>
          <div className="text-left">
            <span className="block text-lg font-extrabold tracking-tight text-[#0B1B36]">
              Travora
            </span>
          </div>
        </button>

        {/* Desktop Links */}
        <nav className="hidden items-center gap-7 md:flex">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`relative py-1 text-sm font-semibold transition-colors ${
                  isActive
                    ? 'text-[#0B1B36]'
                    : 'text-slate-500 hover:text-[#0B1B36]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute inset-x-0 -bottom-[2px] h-0.5 rounded-full bg-[#E85A34]" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <button
            onClick={() => handleNav('profile')}
            title="Saved Destinations & Trips"
            className={`relative flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
              activePage === 'profile'
                ? 'border-[#0B1B36] bg-[#0B1B36] text-white'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:border-slate-300 hover:bg-white'
            }`}
          >
            <Bookmark className="h-3.5 w-3.5 text-[#E85A34]" />
            <span>Saved ({savedIds.length})</span>
            {bookingHistory.length > 0 && (
              <span className="ml-1 rounded-full bg-[#E85A34] px-1.5 py-0.5 text-[10px] font-bold text-white">
                {bookingHistory.length}
              </span>
            )}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleNav('profile')}
                className="flex items-center gap-2 rounded-lg bg-[#0B1B36] px-3.5 py-2 text-xs font-semibold text-white transition hover:bg-[#13294E]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#E85A34] text-[10px] font-bold">
                  {user.name[0]?.toUpperCase()}
                </span>
                <span>{user.name}</span>
              </button>
              <button
                onClick={logoutUser}
                title="Sign Out"
                className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#0B1B36]"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => openAuth('login')}
              className="flex items-center gap-2 rounded-lg bg-[#E85A34] px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D44B27] active:scale-[0.98]"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </button>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="rounded-lg border border-slate-200 p-2 text-[#0B1B36] md:hidden"
          aria-label="Toggle Menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div className="border-t border-slate-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`rounded-lg px-3 py-2.5 text-left text-sm font-semibold ${
                  activePage === item.id
                    ? 'bg-[#0B1B36] text-white'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => handleNav('profile')}
              className="flex items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-slate-700 hover:bg-slate-100"
            >
              <span className="flex items-center gap-2">
                <CalendarCheck className="h-4 w-4 text-[#E85A34]" />
                Saved &amp; Trips
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs">
                {savedIds.length} saved
              </span>
            </button>
          </div>
          <div className="mt-3 border-t border-slate-100 pt-3">
            {user ? (
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-[#0B1B36]">
                  Signed in as {user.name}
                </span>
                <button
                  onClick={logoutUser}
                  className="text-xs font-semibold text-[#E85A34]"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileOpen(false);
                  openAuth('login');
                }}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#E85A34] py-2.5 text-sm font-semibold text-white"
              >
                <User className="h-4 w-4" />
                Sign In / Join Travora
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}