import React, { useState, useMemo, useEffect } from 'react';
import { Search, RotateCcw, MapPin } from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { DestinationCard } from '../components/Cards';
import { useTravora } from '../context/TravoraContext';

const TYPES = ['All', 'Coastal', 'Cultural', 'Mountain', 'Heritage', 'Island'];

export default function DestinationsPage() {
  const { globalSearch, setGlobalSearch } = useTravora();
  const [search, setSearch] = useState(globalSearch || '');
  const [country, setCountry] = useState('All Countries');
  const [region, setRegion] = useState('All Regions');
  const [type, setType] = useState('All');

  useEffect(() => {
    if (globalSearch) {
      setSearch(globalSearch);
    }
  }, [globalSearch]);

  const countries = useMemo(
    () => ['All Countries', ...new Set(DESTINATIONS.map((d) => d.country))],
    []
  );
  const regions = useMemo(
    () => ['All Regions', ...new Set(DESTINATIONS.map((d) => d.region))],
    []
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return DESTINATIONS.filter((d) => {
      const matchesQ =
        !q ||
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.region.toLowerCase().includes(q) ||
        d.attractions.some((a) => a.title.toLowerCase().includes(q));
      const matchesCountry = country === 'All Countries' || d.country === country;
      const matchesRegion = region === 'All Regions' || d.region === region;
      const matchesType = type === 'All' || d.type === type;
      return matchesQ && matchesCountry && matchesRegion && matchesType;
    });
  }, [search, country, region, type]);

  const resetFilters = () => {
    setSearch('');
    setGlobalSearch('');
    setCountry('All Countries');
    setRegion('All Regions');
    setType('All');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold text-[#E85A34]">Explore Destinations</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B36] sm:text-4xl">
          Browse Regions, Cities &amp; Natural Wonders
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Filter destinations by country, region, or travel style, inspect top tourist
          attractions, and save places to your shortlist.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-12">
          <div className="relative md:col-span-6">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search destination, country, or attraction..."
              className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-10 pr-4 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
            />
          </div>

          <div className="md:col-span-3">
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0B1B36] focus:border-[#0B1B36] focus:outline-none"
            >
              {countries.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-xs font-semibold text-[#0B1B36] focus:border-[#0B1B36] focus:outline-none"
            >
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Type Pills + Counter */}
        <div className="mt-3.5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-medium text-slate-400">Type:</span>
            {TYPES.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition ${
                  type === t
                    ? 'bg-[#0B1B36] text-white'
                    : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <span className="text-xs text-slate-500">
            Showing {filtered.length} of {DESTINATIONS.length} destinations
          </span>
        </div>
      </div>

      {/* Results Grid or Empty State */}
      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} variant="full" />
          ))}
        </div>
      ) : (
        <div className="mt-10 rounded-2xl border border-dashed border-slate-300 bg-white p-12 text-center">
          <MapPin className="mx-auto h-8 w-8 text-slate-300" />
          <h3 className="mt-3 text-base font-extrabold text-[#0B1B36]">
            No destinations match those filters
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try clearing your search keyword or selecting &quot;All&quot; travel styles.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="mt-4 inline-flex items-center gap-1.5 rounded-xl bg-[#0B1B36] px-4 py-2 text-xs font-bold text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}