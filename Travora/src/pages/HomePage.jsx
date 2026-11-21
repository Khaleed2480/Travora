import React, { useState } from 'react';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';
import AnimatedHero from '../components/AnimatedHero';
import GlobeJourneyFilm from '../components/GlobeJourneyFilm';
import {
  DestinationCard,
  HotelCard,
  ActivityCard,
  GuideCard,
} from '../components/Cards';
import {
  DESTINATIONS,
  HOTELS,
  ACTIVITIES,
  TOUR_GUIDES,
  TESTIMONIALS,
  TRIP_PREP_BANNER,
} from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

export default function HomePage() {
  const { navigate, showToast, setDetailModal } = useTravora();
  const [playFilmTrigger, setPlayFilmTrigger] = useState(0);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  const featuredDestinations = DESTINATIONS.filter((d) => d.featured);
  const featuredHotels = HOTELS.filter((h) => h.featured);
  const featuredActivities = ACTIVITIES.filter((a) => a.featured);

  const popularAttractions = [
    { ...DESTINATIONS[0].attractions[0], place: 'Amalfi Coast, Italy', dest: DESTINATIONS[0] },
    { ...DESTINATIONS[1].attractions[0], place: 'Kyoto, Japan', dest: DESTINATIONS[1] },
    { ...DESTINATIONS[2].attractions[0], place: 'Maldives Atolls, Maldives', dest: DESTINATIONS[2] },
  ];

  const handleWatchFilm = () => {
    setPlayFilmTrigger((c) => c + 1);
    document.getElementById('journey-film')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleNewsletter = (e) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast(`Subscribed ${newsletterEmail} to Travora Seasonal Dispatches.`);
    setNewsletterEmail('');
  };

  return (
    <div>
      {/* 1. Animated Multi-Layer Hero */}
      <AnimatedHero onWatchFilm={handleWatchFilm} />

      {/* 2. Interactive 3D Global Journey Film */}
      <GlobeJourneyFilm externalPlayTrigger={playFilmTrigger} />

      {/* 3. Popular Destinations */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <p className="text-xs font-bold text-[#E85A34]">Curated Regions</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36] sm:text-3xl">
              Popular Destinations
            </h2>
          </div>
          <button
            type="button"
            onClick={() => navigate('destinations')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1B36] hover:text-[#E85A34]"
          >
            <span>Explore all destinations</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredDestinations.map((dest) => (
            <DestinationCard key={dest.id} destination={dest} variant="compact" />
          ))}
        </div>
      </section>

      {/* 4. Featured Hotels & Accommodation */}
      <section className="border-y border-slate-200/70 bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold text-[#E85A34]">Handpicked Stays</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36] sm:text-3xl">
                Featured Hotels &amp; Accommodation
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('stays', { staysTab: 'hotels' })}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1B36] hover:text-[#E85A34]"
            >
              <span>Browse all stays</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {featuredHotels.map((hotel) => (
              <HotelCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Popular Tourist Attractions + Recommended Travel Experiences */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Left: Landmarks */}
          <div className="lg:col-span-5">
            <p className="text-xs font-bold text-[#E85A34]">Must-See Landmarks</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36]">
              Popular Tourist Attractions
            </h2>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">
              Explore iconic trails, historic estates, and protected districts paired with
              practical visit durations.
            </p>

            <div className="mt-5 space-y-3.5">
              {popularAttractions.map((item) => (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setDetailModal({ type: 'destination', data: item.dest })}
                  className="travora-card block w-full rounded-2xl border border-slate-200/90 bg-white p-4 text-left"
                >
                  <div className="flex items-center justify-between text-[11px] font-medium text-slate-400">
                    <span>{item.place}</span>
                    <span>{item.duration}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-extrabold text-[#0B1B36]">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-500">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>

            {/* Curated Field Notes using pic 15, pic 16, pic 17 */}
            <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200 bg-white p-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E85A34]">
                <Sparkles className="h-3.5 w-3.5" />
                <span>Curated Field Notes</span>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <img
                  src={TRIP_PREP_BANNER.image}
                  alt="Departure ready"
                  className="h-20 w-full rounded-xl object-cover"
                />
                <img
                  src={TRIP_PREP_BANNER.retreatImage}
                  alt="Tropical sanctuary"
                  className="h-20 w-full rounded-xl object-cover"
                />
                <img
                  src={TRIP_PREP_BANNER.campImage}
                  alt="Fireside wilderness"
                  className="h-20 w-full rounded-xl object-cover"
                />
              </div>
              <p className="mt-3 text-xs text-slate-600">
                From departure checklists to remote waterfall retreats and alpine river
                camps, pair every stay with vetted local experiences.
              </p>
            </div>
          </div>

          {/* Right: Experiences Grid */}
          <div className="lg:col-span-7">
            <div className="mb-5 flex items-end justify-between">
              <div>
                <p className="text-xs font-bold text-[#E85A34]">
                  Activities &amp; Adventures
                </p>
                <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36]">
                  Recommended Travel Experiences
                </h2>
              </div>
              <button
                type="button"
                onClick={() => navigate('stays', { staysTab: 'activities' })}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0B1B36] hover:text-[#E85A34]"
              >
                <span>All activities</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {featuredActivities.map((act) => (
                <ActivityCard key={act.id} activity={act} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Verified Local Tour Guides (Deep Navy Contrast Section) */}
      <section className="bg-[#0B1B36] py-16 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold text-[#E85A34]">Local Expertise</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Travel Alongside Verified Local Tour Guides
              </h2>
            </div>
            <button
              type="button"
              onClick={() => navigate('guides')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-200 hover:text-white"
            >
              <span>Meet all tour guides</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {TOUR_GUIDES.map((guide) => (
              <GuideCard key={guide.id} guide={guide} darkSurface />
            ))}
          </div>
        </div>
      </section>

      {/* 7. Traveler Stories / Testimonials */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="mb-7">
          <p className="text-xs font-bold text-[#E85A34]">Traveler Stories</p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36] sm:text-3xl">
            Trusted by Independent &amp; Group Travelers
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200/90 bg-white p-6 shadow-sm"
            >
              <p className="text-xs leading-relaxed text-slate-600">{t.quote}</p>
              <p className="mt-3 text-[11px] font-bold text-[#0B1B36]">{t.highlight}</p>

              <div className="mt-auto flex items-center gap-3 border-t border-slate-100 pt-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B1B36] text-xs font-bold text-white">
                  {t.initials}
                </span>
                <div>
                  <p className="text-xs font-extrabold text-[#0B1B36]">{t.name}</p>
                  <p className="text-[11px] text-slate-400">{t.trip}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 8. Seasonal Travel Dispatches Newsletter */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:flex-row lg:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-[#E85A34]">
              <Compass className="h-3.5 w-3.5" />
              Seasonal Travel Dispatches
            </p>
            <h3 className="mt-1.5 text-xl font-extrabold text-[#0B1B36]">
              Get destination guides &amp; shoulder-season openings
            </h3>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-slate-500">
              Twice a month, we share curated route notes, newly vetted stays, and guide
              availability windows—never spam.
            </p>
          </div>

          <form
            onSubmit={handleNewsletter}
            className="flex w-full max-w-md flex-col gap-2.5 sm:flex-row"
          >
            <input
              type="email"
              required
              value={newsletterEmail}
              onChange={(e) => setNewsletterEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-11 flex-1 rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
            />
            <button
              type="submit"
              className="h-11 rounded-xl bg-[#E85A34] px-6 text-sm font-bold text-white transition hover:bg-[#D44B27]"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}