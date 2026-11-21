import React, { useState, useMemo, useEffect } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { HOTELS, ACTIVITIES } from '../data/travelData';
import { HotelCard, ActivityCard } from '../components/Cards';
import { useTravora } from '../context/TravoraContext';

const ACTIVITY_CATEGORIES = [
  'All',
  'Adventure',
  'Beaches & Resorts',
  'Historical',
  'Cultural',
  'Nature & Wildlife',
  'Entertainment',
];

export default function StaysActivitiesPage() {
  const { staysTab, setStaysTab, globalSearch, setGlobalSearch } = useTravora();
  const [search, setSearch] = useState(globalSearch || '');
  const [maxPrice, setMaxPrice] = useState(null); // null | 200 | 300
  const [actCategory, setActCategory] = useState('All');

  useEffect(() => {
    if (globalSearch) setSearch(globalSearch);
  }, [globalSearch]);

  const filteredHotels = useMemo(() => {
    const q = search.trim().toLowerCase();
    return HOTELS.filter((h) => {
      const matchesQ =
        !q ||
        h.name.toLowerCase().includes(q) ||
        h.location.toLowerCase().includes(q) ||
        h.amenities.some((a) => a.toLowerCase().includes(q));
      const matchesPrice = !maxPrice || h.pricePerNight <= maxPrice;
      return matchesQ && matchesPrice;
    });
  }, [search, maxPrice]);

  const filteredActivities = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ACTIVITIES.filter((a) => {
      const matchesQ =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q);
      const matchesCat = actCategory === 'All' || a.category === actCategory;
      return matchesQ && matchesCat;
    });
  }, [search, actCategory]);

  const resetAll = () => {
    setSearch('');
    setGlobalSearch('');
    setMaxPrice(null);
    setActCategory('All');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header + Segmented Switch */}
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div className="max-w-xl">
          <p className="text-xs font-bold text-[#E85A34]">Stays &amp; Local Experiences</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B36] sm:text-4xl">
            Curated Hotels, Resorts &amp; Activities
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Compare nightly rates, check-in hours, and amenities, or browse adventure,
            cultural, coastal, and nature activities to pair with your trip.
          </p>
        </div>

        <div className="inline-flex self-start rounded-xl border border-slate-200 bg-slate-100 p-1">
          <button
            type="button"
            onClick={() => setStaysTab('hotels')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              staysTab === 'hotels'
                ? 'bg-white text-[#0B1B36] shadow-sm'
                : 'text-slate-500 hover:text-[#0B1B36]'
            }`}
          >
            Hotels &amp; Accommodation
          </button>
          <button
            type="button"
            onClick={() => setStaysTab('activities')}
            className={`rounded-lg px-4 py-2 text-xs font-bold transition ${
              staysTab === 'activities'
                ? 'bg-white text-[#0B1B36] shadow-sm'
                : 'text-slate-500 hover:text-[#0B1B36]'
            }`}
          >
            Activities &amp; Experiences
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={
              staysTab === 'hotels'
                ? 'Search by hotel name, city, or amenity...'
                : 'Search snorkeling, canoeing, cultural walks...'
            }
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
          />
        </div>

        {staysTab === 'hotels' ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-500">Max nightly rate:</span>
            {[
              { label: 'Any Price', value: null },
              { label: 'Up to $200', value: 200 },
              { label: 'Up to $300', value: 300 },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setMaxPrice(opt.value)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  maxPrice === opt.value
                    ? 'bg-[#0B1B36] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap items-center gap-1.5">
            {ACTIVITY_CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setActCategory(cat)}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                  actCategory === cat
                    ? 'bg-[#0B1B36] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {staysTab === 'hotels' ? (
        filteredHotels.length > 0 ? (
          <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} showDetailsButton />
            ))}
          </div>
        ) : (
          <EmptyState onReset={resetAll} label="hotels" />
        )
      ) : filteredActivities.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filteredActivities.map((act) => (
            <ActivityCard key={act.id} activity={act} />
          ))}
        </div>
      ) : (
        <EmptyState onReset={resetAll} label="activities" />
      )}
    </div>
  );
}

function EmptyState({ onReset, label }) {
  return (
    <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
      <h3 className="text-base font-extrabold text-[#0B1B36]">
        No {label} matched your search
      </h3>
      <p className="mt-1 text-xs text-slate-500">
        Adjust your price ceiling or clear the search filter to view all listings.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B1B36] px-4 py-2 text-xs font-bold text-white"
      >
        <RotateCcw className="h-3.5 w-3.5" />
        Reset Filters
      </button>
    </div>
  );
}