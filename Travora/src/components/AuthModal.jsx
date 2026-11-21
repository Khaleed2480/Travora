import React, { useState } from 'react';
import {
  X,
  Compass,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { useTravora } from '../context/TravoraContext';
import { asset } from '../data/travelData';

export default function AuthModal() {
  const { authModalOpen, setAuthModalOpen, authMode, setAuthMode, loginUser, showToast } =
    useTravora();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  if (!authModalOpen) return null;

  const sideImage =
    authMode === 'signup'
      ? asset('pic 12.png')
      : authMode === 'forgot'
      ? asset('pic 11.png')
      : asset('pic 4.png');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (authMode === 'forgot') {
      showToast(`Password reset link simulated for ${email}.`);
      setAuthMode('login');
      return;
    }
    loginUser({ name: authMode === 'signup' ? name : '', email });
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#061124]/75 p-4 backdrop-blur-md"
      onClick={() => setAuthModalOpen(false)}
    >
      <div
        className="animate-form-popout relative grid w-full max-w-3xl overflow-hidden rounded-3xl border border-white/15 bg-white shadow-2xl md:grid-cols-12"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left Visual Column */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0B1B36] p-6 text-white md:col-span-5 md:flex">
          <img
            src={sideImage}
            alt="Travora destination"
            className="animate-ken-burns absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#061124]/95 via-[#0B1B36]/55 to-[#061124]/65" />

          <div className="relative z-10 flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md">
              <Compass className="h-4 w-4 text-[#E85A34]" />
            </span>
            <span className="text-base font-extrabold tracking-tight">Travora</span>
          </div>

          <div className="relative z-10 mt-auto">
            <span className="inline-flex items-center gap-1 rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider backdrop-blur-md">
              <Sparkles className="h-3 w-3 text-[#E85A34]" />
              Member Perks
            </span>
            <h4 className="mt-2 text-lg font-extrabold leading-snug">
              {authMode === 'signup'
                ? 'Plan smarter from your first trip.'
                : authMode === 'forgot'
                ? 'Quick account recovery.'
                : 'Your saved journeys await.'}
            </h4>
            <ul className="mt-3 space-y-1.5 text-[11px] text-slate-200">
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                Sync destination shortlists
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                Instant itinerary cost previews
              </li>
            </ul>
          </div>
        </div>

        {/* Right Form Column */}
        <div className="relative p-6 sm:p-7 md:col-span-7">
          <button
            type="button"
            onClick={() => setAuthModalOpen(false)}
            className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-[#0B1B36]"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Pill Switcher */}
          {authMode !== 'forgot' && (
            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition ${
                  authMode === 'login'
                    ? 'bg-[#0B1B36] text-white shadow-sm'
                    : 'text-slate-500 hover:text-[#0B1B36]'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('signup')}
                className={`rounded-lg px-4 py-1.5 text-xs font-extrabold transition ${
                  authMode === 'signup'
                    ? 'bg-[#0B1B36] text-white shadow-sm'
                    : 'text-slate-500 hover:text-[#0B1B36]'
                }`}
              >
                Sign Up
              </button>
            </div>
          )}

          <h3 className="mt-4 text-xl font-extrabold text-[#0B1B36]">
            {authMode === 'login' && 'Sign in to Travora'}
            {authMode === 'signup' && 'Create your Travora account'}
            {authMode === 'forgot' && 'Reset your password'}
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Frontend MVP — profile, shortlist, and booking previews run locally in your
            browser.
          </p>

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            {authMode === 'signup' && (
              <div>
                <label className="mb-1 block text-xs font-bold text-[#0B1B36]">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Rivera"
                    className="h-10 w-full rounded-xl border border-slate-200 bg-slate-50 pl-9 pr-3 text-sm transition focus:border-[#E85A34] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#E85A34]/20"
                  />
                </div>
              </div>
            )}

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

            {authMode !== 'forgot' && (
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
                    {showPass ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#E85A34] py-2.5 text-sm font-extrabold text-white shadow-md shadow-[#E85A34]/25 transition hover:bg-[#D44B27]"
            >
              <span>
                {authMode === 'login' && 'Sign In'}
                {authMode === 'signup' && 'Create Account'}
                {authMode === 'forgot' && 'Send Reset Preview'}
              </span>
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </form>

          <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4 text-xs">
            {authMode === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => setAuthMode('forgot')}
                  className="font-semibold text-slate-500 hover:text-[#0B1B36]"
                >
                  Forgot password?
                </button>
                <button
                  type="button"
                  onClick={() => loginUser({ name: 'Alex Rivera', email: 'alex@travora.example' })}
                  className="font-bold text-[#0B1B36] hover:text-[#E85A34]"
                >
                  ⚡ Quick Demo Sign In
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => setAuthMode('login')}
                className="font-bold text-[#0B1B36]"
              >
                ← Back to Sign In
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}