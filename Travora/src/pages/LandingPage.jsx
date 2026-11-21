import React, { useState, useEffect } from 'react';
import { Compass, ArrowRight, Sparkles, MapPin } from 'lucide-react';
import { HERO_SCENES, DESTINATIONS } from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

export default function LandingPage() {
  const { navigate } = useTravora();
  const [bgIdx, setBgIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBgIdx((prev) => (prev + 1) % HERO_SCENES.length);
    }, 5500);
    return () => clearInterval(timer);
  }, []);

  const currentScene = HERO_SCENES[bgIdx];

  return (
    <div className="relative isolate flex min-h-screen flex-col justify-between overflow-hidden bg-[#061124] text-white">
      {/* Visible Animated Ken Burns Background Layer (z-0) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        {HERO_SCENES.map((scene, idx) => (
          <img
            key={scene.id}
            src={scene.image}
            alt={scene.label}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1400ms] ${
              idx === bgIdx ? 'animate-ken-burns opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        {/* Balanced gradient so photos shine through clearly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#061124]/75 via-[#0B1B36]/45 to-[#061124]/88" />
      </div>

      {/* Animated Route Arcs (z-10) */}
      <svg
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-55"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 100 620 Q 520 180 960 320 T 1380 180"
          stroke="#E85A34"
          strokeWidth="2.2"
          className="animate-flight-arc"
        />
        <path
          d="M 180 200 Q 650 520 1280 260"
          stroke="#93C5FD"
          strokeWidth="1.2"
          strokeOpacity="0.5"
          className="animate-flight-arc"
        />
      </svg>

      {/* Top Minimal Brand Bar (z-20) */}
      <header className="relative z-20 mx-auto flex w-full max-w-7xl items-center justify-between px-6 pt-6">
        <div className="flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#0B1B36]/70 backdrop-blur-md ring-1 ring-white/25">
            <Compass className="h-5 w-5 text-[#E85A34]" />
          </span>
          <div>
            <span className="block text-lg font-extrabold tracking-tight text-white">
              Travora
            </span>
            <span className="block text-[10px] font-semibold uppercase tracking-widest text-slate-200">
              Discover. Plan. Experience.
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate('form')}
          className="rounded-xl border border-white/25 bg-[#0B1B36]/60 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
        >
          Sign In / Join →
        </button>
      </header>

      {/* Center Welcome Hero (z-20) */}
      <main className="relative z-20 mx-auto flex max-w-4xl flex-col items-center px-6 py-12 text-center">
        <div className="animate-hero-1 inline-flex items-center gap-2 rounded-full border border-white/25 bg-[#0B1B36]/60 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#E85A34]" />
          <span>Featured Scene · {currentScene.label}</span>
        </div>

        <h1 className="animate-hero-2 mt-6 text-4xl font-extrabold leading-[1.08] tracking-tight text-white drop-shadow-lg sm:text-6xl">
          Your Next Great Journey
          <span className="block bg-gradient-to-r from-white via-[#FFE4DC] to-[#E85A34] bg-clip-text text-transparent">
            Starts Right Here.
          </span>
        </h1>

        <p className="animate-hero-3 mt-5 max-w-2xl text-sm leading-relaxed text-slate-100 drop-shadow sm:text-base">
          Discover curated destinations, boutique stays, local tour guides, and custom
          itineraries—crafted around your dates and travel style.
        </p>

        {/* Primary CTA goes straight into Animated Form Page */}
        <div className="animate-hero-4 mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate('form')}
            className="group inline-flex items-center gap-2.5 rounded-2xl bg-[#E85A34] px-8 py-4 text-sm font-extrabold text-white shadow-2xl shadow-[#E85A34]/40 transition hover:scale-[1.02] hover:bg-[#D44B27] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4" />
            <span>Continue to Travora</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            type="button"
            onClick={() => navigate('home')}
            className="rounded-2xl border border-white/30 bg-[#0B1B36]/55 px-6 py-4 text-sm font-bold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            Browse as Guest
          </button>
        </div>
      </main>

      {/* Bottom Interactive Destination Strip (z-20) */}
      <footer className="relative z-20 mx-auto w-full max-w-7xl px-6 pb-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {DESTINATIONS.slice(0, 4).map((dest) => (
            <button
              key={dest.id}
              type="button"
              onClick={() => navigate('form')}
              className="group flex items-center gap-3 rounded-2xl border border-white/20 bg-[#0B1B36]/65 p-2.5 text-left backdrop-blur-md transition hover:border-[#E85A34] hover:bg-[#0B1B36]/90"
            >
              <img
                src={dest.image}
                alt={dest.name}
                className="h-12 w-14 shrink-0 rounded-xl object-cover transition-transform group-hover:scale-105"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-xs font-extrabold text-white">
                  <MapPin className="h-3 w-3 shrink-0 text-[#E85A34]" />
                  {dest.name}
                </p>
                <p className="truncate text-[11px] text-slate-200">
                  {dest.country} · From ${dest.pricePerDay}/day
                </p>
              </div>
            </button>
          ))}
        </div>
      </footer>
    </div>
  );
}