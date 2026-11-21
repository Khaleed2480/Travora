import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Calendar,
  ArrowRight,
  Play,
  MapPin,
  Sparkles,
  Compass,
} from 'lucide-react';
import { HERO_SCENES, DESTINATIONS, HOTELS, ACTIVITIES } from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

export default function AnimatedHero({ onWatchFilm }) {
  const { navigate, planDestinationTrip } = useTravora();

  const [sceneIdx, setSceneIdx] = useState(0);
  const [searchTab, setSearchTab] = useState('destinations'); // destinations | stays | activities
  const [query, setQuery] = useState('');
  const [date, setDate] = useState('2026-12-12');
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });

  // Auto-cycle cinematic scenes every 6.5s
  useEffect(() => {
    const timer = setInterval(() => {
      setSceneIdx((prev) => (prev + 1) % HERO_SCENES.length);
    }, 6500);
    return () => clearInterval(timer);
  }, []);

  const activeScene = HERO_SCENES[sceneIdx];

  // Subtle mouse parallax
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 18;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 14;
    setMouseOffset({ x, y });
  };

  // Live instant search suggestions
  const suggestions = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    if (searchTab === 'destinations') {
      return DESTINATIONS.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.country.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q)
      ).slice(0, 4);
    }
    if (searchTab === 'stays') {
      return HOTELS.filter(
        (h) =>
          h.name.toLowerCase().includes(q) ||
          h.location.toLowerCase().includes(q)
      ).slice(0, 4);
    }
    return ACTIVITIES.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.location.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    ).slice(0, 4);
  }, [query, searchTab]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTab === 'destinations') {
      navigate('destinations', { search: query });
    } else if (searchTab === 'stays') {
      navigate('stays', { staysTab: 'hotels', search: query });
    } else {
      navigate('stays', { staysTab: 'activities', search: query });
    }
  };

  return (
    <section
      onMouseMove={handleMouseMove}
      className="relative isolate overflow-hidden bg-[#071226] text-white"
    >
      {/* 1. Animated Multi-Scene Ken Burns Backdrop */}
      <div className="absolute inset-0 -z-20 overflow-hidden">
        {HERO_SCENES.map((scene, index) => {
          const isActive = index === sceneIdx;
          return (
            <div
              key={scene.id}
              className={`absolute inset-0 transition-opacity duration-[1400ms] ease-out ${
                isActive ? 'opacity-100' : 'opacity-0'
              }`}
              style={{
                transform: `translate3d(${mouseOffset.x * -0.4}px, ${
                  mouseOffset.y * -0.4
                }px, 0) scale(1.03)`,
                transition: 'opacity 1.4s ease, transform 0.35s ease-out',
              }}
            >
              <img
                src={scene.image}
                alt={scene.label}
                className={`h-full w-full object-cover ${
                  isActive ? 'animate-ken-burns' : ''
                }`}
              />
            </div>
          );
        })}

        {/* Atmospheric Navy Gradient Scrims */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#071226]/90 via-[#0B1B36]/65 to-[#0B1B36]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071226]/85 via-transparent to-[#071226]/35" />
      </div>

      {/* 2. Animated SVG Flight Route Arcs Overlay */}
      <svg
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full opacity-45"
        viewBox="0 0 1440 720"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 180 540 Q 520 140 940 280 T 1360 190"
          stroke="#E85A34"
          strokeWidth="1.6"
          className="animate-flight-arc"
        />
        <path
          d="M 90 220 Q 480 420 860 180 T 1320 420"
          stroke="#93C5FD"
          strokeWidth="1"
          strokeOpacity="0.45"
          className="animate-flight-arc"
        />
        <circle cx="940" cy="280" r="4" fill="#E85A34" className="animate-pulse" />
        <circle cx="520" cy="275" r="3" fill="#FFFFFF" fillOpacity="0.8" />
      </svg>

      {/* Ambient Glow Orb */}
      <div className="animate-ambient-float pointer-events-none absolute -top-24 right-1/4 -z-10 h-72 w-72 rounded-full bg-[#E85A34]/20 blur-3xl" />

      {/* 3. Main Hero Content */}
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-14 sm:px-6 sm:pb-24 sm:pt-20 lg:px-8">
        <div className="grid items-end gap-10 lg:grid-cols-12">
          {/* Left Column: Headline, Copy, CTA & Search Dock */}
          <div className="lg:col-span-8">
            <div className="animate-hero-1 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-white/95 backdrop-blur-md">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#E85A34]" />
              <span>Discover. Plan. Experience.</span>
            </div>

            <h1 className="animate-hero-2 mt-5 text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-[3.5rem]">
              Discover the World,
              <span className="block bg-gradient-to-r from-white via-white to-[#FFD6C9] bg-clip-text text-transparent">
                One Journey at a Time.
              </span>
            </h1>

            <p className="animate-hero-3 mt-5 max-w-2xl text-base leading-relaxed text-slate-200 sm:text-lg">
              Explore curated destinations, book vetted boutique stays, reserve local
              experiences, and connect with experienced tour guides—all inside one
              transparent trip planner.
            </p>

            {/* Interactive Action Buttons */}
            <div className="animate-hero-3 mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onWatchFilm}
                className="group inline-flex items-center gap-2.5 rounded-xl border border-white/25 bg-white/15 px-4 py-2.5 text-sm font-semibold text-white backdrop-blur-md transition hover:border-white/40 hover:bg-white/25"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#E85A34] text-white transition-transform group-hover:scale-110">
                  <Play className="h-3 w-3 fill-current" />
                </span>
                <span>Watch 3D Route Film</span>
              </button>

              <button
                type="button"
                onClick={() => planDestinationTrip(activeScene.destinationId)}
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#0B1B36]/60 px-4 py-2.5 text-sm font-semibold text-slate-200 backdrop-blur-md transition hover:border-white/35 hover:text-white"
              >
                <Sparkles className="h-4 w-4 text-[#E85A34]" />
                <span>Plan {activeScene.label.split(',')[0]}</span>
              </button>
            </div>

            {/* Elevated Floating Search Dock */}
            <div className="animate-hero-4 relative mt-8 max-w-3xl rounded-2xl border border-white/20 bg-white p-3.5 text-[#0B1B36] shadow-2xl shadow-black/30">
              {/* Tabs */}
              <div className="mb-3 flex flex-wrap items-center gap-1.5">
                {[
                  { id: 'destinations', label: 'Destinations' },
                  { id: 'stays', label: 'Hotels & Stays' },
                  { id: 'activities', label: 'Activities' },
                ].map((tab) => {
                  const active = searchTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setSearchTab(tab.id)}
                      className={`rounded-lg px-3.5 py-1.5 text-xs font-bold transition-all ${
                        active
                          ? 'bg-[#0B1B36] text-white shadow-sm'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-[#0B1B36]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>

              {/* Search Inputs */}
              <form
                onSubmit={handleSearchSubmit}
                className="flex flex-col gap-2.5 sm:flex-row sm:items-center"
              >
                <div className="relative flex-1">
                  <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={query}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => setTimeout(() => setIsInputFocused(false), 180)}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={
                      searchTab === 'destinations'
                        ? 'Search Kyoto, Amalfi Coast, Banff...'
                        : searchTab === 'stays'
                        ? 'Search ryokans, cliffside resorts, riads...'
                        : 'Search snorkeling, dawn walks, canoeing...'
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-10 pr-4 text-sm font-medium text-[#0B1B36] placeholder:text-slate-400 focus:border-[#0B1B36] focus:bg-white focus:outline-none"
                  />

                  {/* Instant Autocomplete Popover */}
                  {isInputFocused && suggestions.length > 0 && (
                    <div className="absolute left-0 right-0 top-12 z-30 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
                      {suggestions.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onMouseDown={() => {
                            if (searchTab === 'destinations') {
                              navigate('destinations', { search: item.name });
                            } else if (searchTab === 'stays') {
                              navigate('stays', { staysTab: 'hotels', search: item.name });
                            } else {
                              navigate('stays', { staysTab: 'activities', search: item.title });
                            }
                          }}
                          className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition hover:bg-slate-50"
                        >
                          <img
                            src={item.image}
                            alt={item.name || item.title}
                            className="h-9 w-9 rounded-lg object-cover"
                          />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-[#0B1B36]">
                              {item.name || item.title}
                            </p>
                            <p className="truncate text-xs text-slate-500">
                              {item.country || item.location}
                            </p>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-[#E85A34]" />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Date Picker */}
                <div className="relative sm:w-44">
                  <Calendar className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/80 pl-9 pr-3 text-sm font-medium text-[#0B1B36] focus:border-[#0B1B36] focus:bg-white focus:outline-none"
                  />
                </div>

                {/* Warm Orange Submit */}
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#E85A34] px-6 text-sm font-bold text-white shadow-md shadow-[#E85A34]/25 transition hover:bg-[#D44B27] active:scale-[0.98]"
                >
                  <span>Search</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          {/* Right Column: Live Destination Telemetry & Interactive Reel Switcher */}
          <div className="animate-hero-4 lg:col-span-4">
            <div
              style={{
                transform: `translate3d(${mouseOffset.x * 0.35}px, ${
                  mouseOffset.y * 0.35
                }px, 0)`,
                transition: 'transform 0.25s ease-out',
              }}
              className="rounded-2xl border border-white/20 bg-[#0B1B36]/75 p-4 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Compass className="h-3.5 w-3.5 text-[#E85A34]" />
                  Live Destination Reel
                </span>
                <span>
                  0{sceneIdx + 1} / 0{HERO_SCENES.length}
                </span>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <img
                  src={activeScene.image}
                  alt={activeScene.label}
                  className="h-14 w-16 rounded-xl object-cover ring-1 ring-white/20"
                />
                <div className="min-w-0">
                  <p className="flex items-center gap-1 truncate text-sm font-bold text-white">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-[#E85A34]" />
                    {activeScene.label}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-slate-300">
                    {activeScene.tagline}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-sky-200/80">
                    {activeScene.region}
                  </p>
                </div>
              </div>

              {/* Interactive Scene Progress Selector */}
              <div className="mt-4 grid grid-cols-5 gap-1.5">
                {HERO_SCENES.map((scene, idx) => {
                  const active = idx === sceneIdx;
                  return (
                    <button
                      key={scene.id}
                      type="button"
                      onClick={() => setSceneIdx(idx)}
                      title={scene.label}
                      className="group flex flex-col gap-1 text-left focus:outline-none"
                    >
                      <div className="h-1 w-full overflow-hidden rounded-full bg-white/20">
                        {active ? (
                          <div
                            key={`fill-${sceneIdx}`}
                            className="animate-progress-fill h-full w-full bg-[#E85A34]"
                          />
                        ) : (
                          <div
                            className={`h-full w-full ${
                              idx < sceneIdx ? 'bg-white/60' : 'bg-transparent'
                            }`}
                          />
                        )}
                      </div>
                      <span
                        className={`truncate text-[10px] font-semibold transition ${
                          active
                            ? 'text-white'
                            : 'text-slate-400 group-hover:text-slate-200'
                        }`}
                      >
                        {scene.label.split(',')[0].split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}