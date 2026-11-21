import React from 'react';
import { Compass, Mail, Phone, MapPin } from 'lucide-react';
import { useTravora } from '../context/TravoraContext';

export default function Footer() {
  const { navigate, planDestinationTrip } = useTravora();

  const quickRegions = [
    { label: 'Amalfi Coast, Italy', id: 'amalfi-coast' },
    { label: 'Kyoto, Japan', id: 'kyoto' },
    { label: 'Maldives Atolls, Maldives', id: 'maldives-atolls' },
    { label: 'Santorini, Greece', id: 'santorini' },
    { label: 'Banff National Park, Canada', id: 'banff-national-park' },
    { label: 'Marrakech, Morocco', id: 'marrakech' },
  ];

  return (
    <footer className="bg-[#08152C] text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 text-white">
              <Compass className="h-5 w-5 text-[#E85A34]" />
              <span className="text-lg font-extrabold">Travora</span>
            </div>
            <p className="mt-3 text-xs font-bold text-white">
              Discover. Plan. Experience.
            </p>
            <p className="mt-2 max-w-xs text-xs leading-relaxed text-slate-400">
              An all-in-one travel platform uniting destination discovery, curated
              accommodations, local experiences, and trusted tour guides.
            </p>
          </div>

          {/* Explore Platform */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Explore Platform
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              <li>
                <button
                  onClick={() => navigate('home')}
                  className="hover:text-white"
                >
                  Home Overview
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('destinations')}
                  className="hover:text-white"
                >
                  Destinations &amp; Attractions
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('stays', { staysTab: 'hotels' })}
                  className="hover:text-white"
                >
                  Hotels &amp; Activities
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('guides')}
                  className="hover:text-white"
                >
                  Verified Tour Guides
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigate('book')}
                  className="hover:text-white"
                >
                  Trip Planner &amp; Booking
                </button>
              </li>
            </ul>
          </div>

          {/* Featured Regions */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Featured Regions
            </h4>
            <ul className="mt-3.5 space-y-2 text-xs">
              {quickRegions.map((reg) => (
                <li key={reg.id}>
                  <button
                    onClick={() => planDestinationTrip(reg.id)}
                    className="hover:text-white"
                  >
                    {reg.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Traveler Support */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-white">
              Traveler Support
            </h4>
            <ul className="mt-3.5 space-y-2.5 text-xs text-slate-300">
              <li className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-[#E85A34]" />
                <span>concierge@travora.example</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-[#E85A34]" />
                <span>+1 (555) 234-8910</span>
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-[#E85A34]" />
                <span>42 Harbor Exchange, Lisbon &amp; Toronto</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-3 border-t border-white/10 pt-6 text-[11px] text-slate-400 sm:flex-row sm:items-center">
          <p>© 2026 Travora Travel Technologies. All rights reserved.</p>
          <p>
            Interactive frontend MVP — bookings and accounts run locally in your browser
            without live payment processing.
          </p>
        </div>
      </div>
    </footer>
  );
}