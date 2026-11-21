import React from 'react';
import {
  Bookmark,
  Star,
  MapPin,
  Clock,
  ArrowRight,
  MessageSquare,
} from 'lucide-react';
import { useTravora } from '../context/TravoraContext';

export function DestinationCard({ destination, variant = 'compact' }) {
  const { savedIds, toggleSaveDestination, setDetailModal, planDestinationTrip } =
    useTravora();
  const isSaved = savedIds.includes(destination.id);

  return (
    <article className="travora-card flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={destination.image}
          alt={destination.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
        <button
          type="button"
          onClick={() => toggleSaveDestination(destination.id)}
          aria-label={`Save ${destination.name}`}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full shadow-md transition ${
            isSaved
              ? 'bg-white text-[#E85A34]'
              : 'bg-white/90 text-slate-600 hover:bg-white hover:text-[#E85A34]'
          }`}
        >
          <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
        </button>
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {destination.country}
            {variant === 'full' ? ` · ${destination.region}` : ''} · {destination.type}
          </span>
          <span className="inline-flex items-center gap-1 font-bold text-[#0B1B36]">
            <Star className="h-3.5 w-3.5 fill-[#E85A34] text-[#E85A34]" />
            {destination.rating}
          </span>
        </div>

        <h3 className="mt-1.5 text-lg font-extrabold text-[#0B1B36]">
          {destination.name}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {destination.shortDesc}
        </p>

        {variant === 'full' && (
          <div className="mt-3 border-t border-slate-100 pt-3">
            <p className="text-[11px] font-bold text-[#0B1B36]">Popular Attractions</p>
            <ul className="mt-1.5 space-y-1">
              {destination.attractions.slice(0, 2).map((att) => (
                <li key={att.title} className="truncate text-[11px] text-slate-500">
                  · {att.title} ({att.duration})
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs">
          {variant === 'compact' ? (
            <>
              <span className="font-medium text-slate-500">
                From{' '}
                <strong className="font-extrabold text-[#0B1B36]">
                  ${destination.pricePerDay}/day
                </strong>
              </span>
              <button
                type="button"
                onClick={() => setDetailModal({ type: 'destination', data: destination })}
                className="font-bold text-[#0B1B36] transition hover:text-[#E85A34]"
              >
                View attractions
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setDetailModal({ type: 'destination', data: destination })}
                className="font-bold text-[#0B1B36] hover:text-[#E85A34]"
              >
                See All {destination.attractions.length} Attractions
              </button>
              <button
                type="button"
                onClick={() => planDestinationTrip(destination.id)}
                className="rounded-lg bg-[#E85A34] px-3.5 py-1.5 font-bold text-white transition hover:bg-[#D44B27]"
              >
                Plan Trip
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}

export function HotelCard({ hotel, showDetailsButton = false }) {
  const { bookSpecificHotel, setDetailModal } = useTravora();

  return (
    <article className="travora-card flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={hotel.image}
          alt={hotel.name}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-500">{hotel.type}</span>
          <span className="inline-flex items-center gap-1 font-bold text-[#0B1B36]">
            <Star className="h-3.5 w-3.5 fill-[#E85A34] text-[#E85A34]" />
            {hotel.rating}{' '}
            <span className="font-normal text-slate-400">({hotel.reviews})</span>
          </span>
        </div>

        <h3 className="mt-1.5 text-lg font-extrabold text-[#0B1B36]">{hotel.name}</h3>
        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
          <MapPin className="h-3.5 w-3.5 text-[#E85A34]" />
          {hotel.location}
        </p>

        {showDetailsButton && (
          <>
            <p className="mt-2.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
              {hotel.description}
            </p>
            <p className="mt-2.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
              <Clock className="h-3.5 w-3.5 text-slate-400" />
              In {hotel.checkIn} · Out {hotel.checkOut}
            </p>
          </>
        )}

        <p className="mt-2.5 text-[11px] text-slate-400">
          {hotel.amenities.slice(0, showDetailsButton ? 4 : 3).join(' · ')}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            <strong className="text-lg font-extrabold text-[#0B1B36]">
              ${hotel.pricePerNight}
            </strong>{' '}
            / night
          </p>

          {showDetailsButton ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDetailModal({ type: 'hotel', data: hotel })}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-[#0B1B36] transition hover:bg-slate-50"
              >
                Details
              </button>
              <button
                type="button"
                onClick={() => bookSpecificHotel(hotel)}
                className="rounded-lg bg-[#E85A34] px-3.5 py-1.5 text-xs font-bold text-white transition hover:bg-[#D44B27]"
              >
                Book
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => bookSpecificHotel(hotel)}
              className="rounded-lg bg-[#0B1B36] px-4 py-2 text-xs font-bold text-white transition hover:bg-[#152D57]"
            >
              Book Stay
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export function ActivityCard({ activity }) {
  const { addActivityToTrip } = useTravora();

  return (
    <article className="travora-card flex flex-col overflow-hidden rounded-2xl border border-slate-200/90 bg-white">
      <div className="aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={activity.image}
          alt={activity.title}
          className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
        />
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-center justify-between text-[11px] font-medium text-slate-500">
          <span>{activity.category}</span>
          <span>{activity.duration}</span>
        </div>

        <h3 className="mt-1.5 text-sm font-extrabold leading-snug text-[#0B1B36]">
          {activity.title}
        </h3>
        <p className="mt-1 text-xs text-slate-500">{activity.location}</p>

        <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3.5">
          <span className="text-xs text-slate-500">
            <strong className="text-sm font-extrabold text-[#0B1B36]">
              ${activity.price}
            </strong>{' '}
            / guest
          </span>
          <button
            type="button"
            onClick={() => addActivityToTrip(activity)}
            className="inline-flex items-center gap-1 text-xs font-bold text-[#E85A34] transition hover:text-[#c7421e]"
          >
            <span>Add to Trip</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function GuideCard({ guide, darkSurface = false }) {
  const { selectGuideForTrip, setDetailModal } = useTravora();

  return (
    <article
      className={`flex flex-col rounded-2xl border p-5 transition-all duration-300 hover:-translate-y-1 ${
        darkSurface
          ? 'border-white/10 bg-[#132544] text-white'
          : 'border-slate-200 bg-white text-[#0B1B36] shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3.5">
        <img
          src={guide.image}
          alt={guide.name}
          className="h-14 w-14 rounded-xl object-cover ring-2 ring-white/10"
        />
        <div>
          <h3 className="text-base font-extrabold">{guide.name}</h3>
          <p
            className={`flex items-center gap-1 text-xs ${
              darkSurface ? 'text-slate-300' : 'text-slate-500'
            }`}
          >
            {!darkSurface && <MapPin className="h-3 w-3 text-[#E85A34]" />}
            {guide.regionLabel}
          </p>
          <p className="mt-0.5 flex items-center gap-1 text-[11px] font-semibold">
            {!darkSurface && (
              <Star className="h-3 w-3 fill-[#E85A34] text-[#E85A34]" />
            )}
            <span className={darkSurface ? 'text-slate-300' : 'text-[#0B1B36]'}>
              {guide.rating} {darkSurface ? 'rating · ' : '· '}
              {guide.toursCompleted} tours · {guide.experienceYears} yrs exp
            </span>
          </p>
        </div>
      </div>

      <p
        className={`mt-4 text-xs leading-relaxed ${
          darkSurface ? 'text-slate-300' : 'text-slate-600'
        }`}
      >
        {guide.bio}
      </p>

      {!darkSurface && (
        <div className="mt-4 space-y-1.5 border-t border-slate-100 pt-3.5 text-[11px] text-slate-500">
          <p>
            <strong className="text-[#0B1B36]">Languages:</strong>{' '}
            {guide.languages.join(', ')}
          </p>
          <p>
            <strong className="text-[#0B1B36]">Availability:</strong> {guide.availability}
          </p>
          <p className="text-slate-400">Focus: {guide.focus.join(' · ')}</p>
        </div>
      )}

      <div
        className={`mt-auto pt-4 ${
          darkSurface
            ? 'flex items-center justify-between'
            : 'border-t border-slate-100'
        }`}
      >
        {darkSurface ? (
          <>
            <span className="text-xs text-slate-300">
              <strong className="text-base font-extrabold text-white">
                ${guide.dailyRate}
              </strong>{' '}
              / day
            </span>
            <button
              type="button"
              onClick={() => setDetailModal({ type: 'guide', data: guide })}
              className="rounded-lg bg-[#E85A34] px-3.5 py-2 text-xs font-bold text-white transition hover:bg-[#D44B27]"
            >
              Contact Guide
            </button>
          </>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between text-xs">
              <span className="text-slate-500">Full-day private rate</span>
              <span className="text-slate-500">
                <strong className="text-base font-extrabold text-[#0B1B36]">
                  ${guide.dailyRate}
                </strong>{' '}
                / day
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => setDetailModal({ type: 'guide', data: guide })}
                className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-bold text-[#0B1B36] transition hover:bg-slate-50"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                Contact
              </button>
              <button
                type="button"
                onClick={() => selectGuideForTrip(guide)}
                className="rounded-lg bg-[#E85A34] py-2 text-xs font-bold text-white transition hover:bg-[#D44B27]"
              >
                Book Guide
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
}