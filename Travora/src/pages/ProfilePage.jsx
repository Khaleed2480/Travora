import React from 'react';
import { Bookmark, CalendarCheck, User, ArrowRight } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationCard } from '../components/Cards';
import { useTravora } from '../context/TravoraContext';

export default function ProfilePage() {
  const { user, openAuth, savedIds, bookingHistory, navigate } = useTravora();
  const savedDestinations = DESTINATIONS.filter((d) => savedIds.includes(d.id));

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Account Summary Banner */}
      <div className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0B1B36] text-xl font-extrabold text-white">
            {user ? user.name[0]?.toUpperCase() : <User className="h-6 w-6 text-[#E85A34]" />}
          </div>
          <div>
            <h1 className="text-xl font-extrabold text-[#0B1B36]">
              {user ? user.name : 'Guest Traveler'}
            </h1>
            <p className="text-xs text-slate-500">
              {user
                ? `${user.email} · Member since ${user.joinedAt}`
                : 'Sign in to personalize your profile. Your shortlist and booking previews are saved locally.'}
            </p>
          </div>
        </div>

        {!user && (
          <button
            type="button"
            onClick={() => openAuth('login')}
            className="self-start rounded-xl bg-[#E85A34] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#D44B27]"
          >
            Sign In / Create Account
          </button>
        )}
      </div>

      {/* Saved Destinations */}
      <section className="mt-10">
        <div className="mb-5 flex items-center gap-2">
          <Bookmark className="h-5 w-5 text-[#E85A34]" />
          <h2 className="text-xl font-extrabold text-[#0B1B36]">
            Saved Destinations ({savedDestinations.length})
          </h2>
        </div>

        {savedDestinations.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {savedDestinations.map((dest) => (
              <DestinationCard key={dest.id} destination={dest} variant="full" />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-bold text-[#0B1B36]">No saved destinations yet</p>
            <button
              type="button"
              onClick={() => navigate('destinations')}
              className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#E85A34]"
            >
              Browse Destinations <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>

      {/* Booking History */}
      <section className="mt-12">
        <div className="mb-5 flex items-center gap-2">
          <CalendarCheck className="h-5 w-5 text-[#E85A34]" />
          <h2 className="text-xl font-extrabold text-[#0B1B36]">
            Booking History ({bookingHistory.length})
          </h2>
        </div>

        {bookingHistory.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2">
            {bookingHistory.map((b) => (
              <div
                key={b.id}
                className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <img
                    src={b.image}
                    alt={b.destinationName}
                    className="h-16 w-20 rounded-xl object-cover"
                  />
                  <div>
                    <span className="text-[11px] font-bold text-[#E85A34]">{b.id}</span>
                    <h3 className="text-base font-extrabold text-[#0B1B36]">
                      {b.destinationName}, {b.country}
                    </h3>
                    <p className="text-xs text-slate-500">
                      {b.checkIn} → {b.checkOut} · {b.travelers} travelers
                    </p>
                    <p className="mt-0.5 text-[11px] text-slate-400">
                      Stay: {b.hotelName}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold text-[#0B1B36]">
                    ${b.estimatedTotal.toLocaleString()}
                  </p>
                  <span className="inline-block rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700">
                    Preview Saved
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
            <p className="text-sm font-bold text-[#0B1B36]">
              No itinerary previews confirmed yet
            </p>
            <button
              type="button"
              onClick={() => navigate('book')}
              className="mt-3 inline-flex items-center gap-1 rounded-xl bg-[#0B1B36] px-4 py-2 text-xs font-bold text-white"
            >
              Build an Itinerary <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </section>
    </div>
  );
}