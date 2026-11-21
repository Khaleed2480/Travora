import React, { useState, useMemo } from 'react';
import { Search, RotateCcw } from 'lucide-react';
import { TOUR_GUIDES } from '../data/travelData';
import { GuideCard } from '../components/Cards';

const LOCATIONS = ['All Locations', 'Italy', 'Japan', 'Morocco'];

export default function TourGuidesPage() {
  const [search, setSearch] = useState('');
  const [location, setLocation] = useState('All Locations');

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return TOUR_GUIDES.filter((g) => {
      const matchesQ =
        !q ||
        g.name.toLowerCase().includes(q) ||
        g.regionLabel.toLowerCase().includes(q) ||
        g.languages.some((l) => l.toLowerCase().includes(q)) ||
        g.focus.some((f) => f.toLowerCase().includes(q));
      const matchesLoc = location === 'All Locations' || g.country === location;
      return matchesQ && matchesLoc;
    });
  }, [search, location]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold text-[#E85A34]">Local Specialists</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B36] sm:text-4xl">
          Discover Verified Tour Guides
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Connect directly with licensed historians, trekking leaders, and culinary hosts
          for private or small-group itineraries.
        </p>
      </div>

      {/* Search + Location Pills */}
      <div className="mt-8 flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="relative flex-1 md:max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by guide name, region, language, or specialty..."
            className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {LOCATIONS.map((loc) => (
            <button
              key={loc}
              type="button"
              onClick={() => setLocation(loc)}
              className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition ${
                location === loc
                  ? 'bg-[#0B1B36] text-white'
                  : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
              }`}
            >
              {loc}
            </button>
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {filtered.map((guide) => (
            <GuideCard key={guide.id} guide={guide} />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <h3 className="text-base font-extrabold text-[#0B1B36]">
            No tour guides found
          </h3>
          <button
            type="button"
            onClick={() => {
              setSearch('');
              setLocation('All Locations');
            }}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B1B36] px-4 py-2 text-xs font-bold text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Show All Guides
          </button>
        </div>
      )}
    </div>
  );
}