import React, { useState, useEffect } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Calendar,
  MapPin,
  Minus,
  Plus,
  X,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  CheckCircle2,
} from 'lucide-react';
import { DESTINATIONS, asset } from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

export default function AnimatedFormPage() {
  const { navigate, draftTrip, setDraftTrip, loginUser, showToast } = useTravora();

  const [stage, setStage] = useState('intro'); // 'intro' | 'popout'
  const [runKey, setRunKey] = useState(0);
  const [mode, setMode] = useState('signup'); // 'signup' | 'login'
  const [showPass, setShowPass] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [destinationId, setDestinationId] = useState(draftTrip.destinationId);
  const [checkIn, setCheckIn] = useState(draftTrip.checkIn);
  const [checkOut, setCheckOut] = useState(draftTrip.checkOut);
  const [travelers, setTravelers] = useState(draftTrip.travelers);

  useEffect(() => {
    setStage('intro');
    const timer = setTimeout(() => {
      setStage('popout');
    }, 1450);
    return () => clearTimeout(timer);
  }, [runKey]);

  const selectedDest =
    DESTINATIONS.find((d) => d.id === destinationId) || DESTINATIONS[0];

    const handleReplay = () => {
    setRunKey((k) => k + 1);
  };

  const handleSubmit = (e, goTo = 'home') => {
    e.preventDefault();
    setDraftTrip((prev) => ({
      ...prev,
      destinationId,
      checkIn,
      checkOut,
      travelers,
    }));
    loginUser({
      name: mode === 'signup' ? fullName.trim() : '',
      email: email.trim(),
    });
    navigate(goTo);
  };

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden bg-[#061124] px-4 py-8 text-white">
      {/* Visible Backdrop (pic 15.png) */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <img
          src={asset('pic 15.png')}
          alt="Traveler boarding"
          className={`h-full w-full object-cover transition-all duration-1000 ${
            stage === 'popout' ? 'scale-105 opacity-45 blur-sm' : 'scale-100 opacity-65'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#061124]/88 via-[#0B1B36]/65 to-[#061124]/90" />
      </div>

      {/* Animated SVG Flight Route Drawing Before Popout */}
      <svg
        key={`svg-${runKey}`}
        className="pointer-events-none absolute inset-0 z-10 h-full w-full opacity-70"
        viewBox="0 0 1440 800"
        fill="none"
        preserveAspectRatio="xMidYMid slice"
      >
        <path
          d="M 80 650 Q 480 120 920 340 T 1380 150"
          stroke="#E85A34"
          strokeWidth="2.5"
          className="animate-draw-route"
        />
        <path
          d="M 120 180 Q 640 540 1320 280"
          stroke="#93C5FD"
          strokeWidth="1.4"
          strokeOpacity="0.5"
          className="animate-draw-route"
        />
      </svg>

      {/* PHASE 1: Pre-Popout Animated Sequence */}
      {stage === 'intro' && (
        <div
          key={`intro-${runKey}`}
          className="animate-hero-1 relative z-20 flex max-w-md flex-col items-center text-center"
        >
          <div className="relative flex h-20 w-20 items-center justify-center rounded-3xl border border-white/25 bg-[#0B1B36]/70 shadow-2xl backdrop-blur-md">
            <Compass
              className="h-10 w-10 animate-spin text-[#E85A34]"
              style={{ animationDuration: '3s' }}
            />
            <span className="absolute -right-1 -top-1 h-3.5 w-3.5 animate-ping rounded-full bg-[#E85A34]" />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[#E85A34]">
            Travora Concierge
          </p>
          <h2 className="mt-2 text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Unlocking Your Boarding Pass...
          </h2>
          <p className="mt-2 text-xs text-slate-200">
            Preparing your account &amp; curated itinerary builder.
          </p>

          <div className="mt-6 h-1.5 w-64 overflow-hidden rounded-full bg-white/20">
            <div className="animate-stage-sweep h-full w-full rounded-full bg-gradient-to-r from-[#E85A34] to-[#FFB39E]" />
          </div>

          <button
            type="button"
            onClick={() => setStage('popout')}
            className="mt-5 text-xs font-semibold text-slate-300 underline-offset-4 hover:text-white hover:underline"
          >
            Open form immediately
          </button>
        </div>
      )}

      {/* PHASE 2: Spicy Split-Card Pop-Out Form */}
      {stage === 'popout' && (
        <div
          key={`form-${runKey}`}
          className="animate-form-popout relative z-20 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-white/20 bg-white text-[#0B1B36] shadow-2xl md:grid-cols-12"
        >
          {/* Left Visual Showcase Panel */}
          <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B1B36] p-7 text-white md:col-span-5 md:flex">
            <img
              src={selectedDest.image}
              alt={selectedDest.name}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#061124]/95 via-[#0B1B36]/60 to-[#061124]/70" />

            <div className="relative z-10 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-bold backdrop-blur-md">
                <Sparkles className="h-3.5 w-3.5 text-[#E85A34]" />
                Travora Access
              </span>
              <button
                type="button"
                onClick={handleReplay}
                title="Replay intro animation"
                className="inline-flex items-center gap-1 rounded-lg border border-white/20 bg-black/25 px-2.5 py-1 text-[11px] font-semibold text-slate-200 backdrop-blur-md hover:bg-white/20"
              >
                <RotateCcw className="h-3 w-3" />
                Replay
              </button>
            </div>

            <div className="relative z-10 mt-auto">
              <p className="flex items-center gap-1 text-xs font-bold text-[#E85A34]">
                <MapPin className="h-3.5 w-3.5" />
                {selectedDest.country} · {selectedDest.type}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold leading-tight">
                {selectedDest.name}
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-slate-200">
                {selectedDest.shortDesc}
              </p>

              <ul className="mt-5 space-y-2 border-t border-white/15 pt-4 text-xs text-slate-200">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                  Save destinations &amp; custom shortlists
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                  Transparent nightly &amp; guide cost previews
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                  Direct access to verified local tour guides
                </li>
              </ul>
            </div>
          </div>

          {/* Right Form Panel */}
          <div className="p-6 sm:p-8 md:col-span-7">
            <div className="flex items-center justify-between">
              {/* Animated Pill Mode Switcher */}
              <div className="inline-flex rounded-xl bg-slate-100 p-1">
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition-all ${
                    mode === 'signup'
                      ? 'bg-[#0B1B36] text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#0B1B36]'
                  }`}
                >
                  Create Account
                </button>
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition-all ${
                    mode === 'login'
                      ? 'bg-[#0B1B36] text-white shadow-sm'
                      : 'text-slate-500 hover:text-[#0B1B36]'
                  }`}
                >
                  Sign In
                </button>
              </div>

              <button
                type="button"
                onClick={() => navigate('home')}
                title="Skip to Homepage"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-[#0B1B36]"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <h1 className="mt-4 text-xl font-extrabold text-[#0B1B36] sm:text-2xl">
              {mode === 'signup'
                ? 'Join Travora & Set Your First Trip'
                : 'Welcome Back, Explorer'}
            </h1>
            <p className="mt-1 text-xs text-slate-500">
              {mode === 'signup'
                ? 'Create your profile and pre-fill your dream itinerary in one step.'
                : 'Sign in to access your saved destinations and booking previews.'}
            </p>

            <form onSubmit={(e) => handleSubmit(e, 'home')} className="mt-5 space-y-3.5">
              {mode === 'signup' && (
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#0B1B36]">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Alex Rivera"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm transition focus:border-[#E85A34] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E85A34]/20"
                    />
                  </div>
                </div>
              )}

              <div className={mode === 'signup' ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3.5'}>
                <div>
                  <label className="mb-1 block text-xs font-bold text-[#0B1B36]">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="alex@example.com"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm transition focus:border-[#E85A34] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E85A34]/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-[#0B1B36]">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input
                      type={showPass ? 'text' : 'password'}
                      required
                      minLength={6}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-9 text-sm transition focus:border-[#E85A34] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E85A34]/20"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0B1B36]"
                    >
                      {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              </div>

              {mode === 'signup' && (
                <>
                  <div>
                    <label className="mb-1 block text-xs font-bold text-[#0B1B36]">
                      Pick Your First Destination
                    </label>
                    <select
                      value={destinationId}
                      onChange={(e) => setDestinationId(e.target.value)}
                      className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm font-semibold text-[#0B1B36] focus:border-[#E85A34] focus:outline-none"
                    >
                      {DESTINATIONS.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}, {d.country} (${d.pricePerDay}/day)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                        <Calendar className="h-3 w-3 text-[#E85A34]" />
                        Check-in
                      </label>
                      <input
                        type="date"
                        value={checkIn}
                        onChange={(e) => setCheckIn(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-2.5 text-xs focus:border-[#E85A34] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 flex items-center gap-1 text-[11px] font-bold text-slate-600">
                        <Calendar className="h-3 w-3 text-[#E85A34]" />
                        Check-out
                      </label>
                      <input
                        type="date"
                        value={checkOut}
                        onChange={(e) => setCheckOut(e.target.value)}
                        className="h-10 w-full rounded-xl border border-slate-200 px-2.5 text-xs focus:border-[#E85A34] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-[11px] font-bold text-slate-600">
                        Travelers
                      </label>
                      <div className="flex h-10 items-center justify-between rounded-xl border border-slate-200 px-2.5">
                        <button
                          type="button"
                          onClick={() => setTravelers((t) => Math.max(1, t - 1))}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="text-xs font-extrabold">{travelers}</span>
                        <button
                          type="button"
                          onClick={() => setTravelers((t) => Math.min(12, t + 1))}
                          className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 hover:bg-slate-200"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#E85A34] py-3 text-sm font-extrabold text-white shadow-lg shadow-[#E85A34]/25 transition hover:bg-[#D44B27] active:scale-[0.99]"
                >
                  <span>
                    {mode === 'signup'
                      ? 'Create Account & Enter Travora'
                      : 'Sign In & Enter Travora'}
                  </span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </button>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => {
                      loginUser({ name: 'Alex Rivera', email: 'alex@travora.example' });
                      navigate('home');
                    }}
                    className="font-bold text-[#0B1B36] hover:text-[#E85A34]"
                  >
                    ⚡ Quick Demo Login
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('home')}
                    className="font-semibold text-slate-400 hover:text-[#0B1B36]"
                  >
                    Skip as Guest →
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}