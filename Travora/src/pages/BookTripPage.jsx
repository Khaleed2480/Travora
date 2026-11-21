import React, { useState, useMemo } from 'react';
import { Minus, Plus, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { DESTINATIONS, HOTELS, ACTIVITIES, TOUR_GUIDES } from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

export default function BookTripPage() {
  const { draftTrip, setDraftTrip, user, confirmBookingPreview, navigate } =
    useTravora();

  const [leadName, setLeadName] = useState(user?.name || '');
  const [leadEmail, setLeadEmail] = useState(user?.email || '');
  const [notes, setNotes] = useState('');
  const [confirmedRecord, setConfirmedRecord] = useState(null);

  const selectedDestination =
    DESTINATIONS.find((d) => d.id === draftTrip.destinationId) || DESTINATIONS[0];

  const availableHotels = HOTELS.filter(
    (h) => h.destinationId === selectedDestination.id
  );
  const selectedHotel = HOTELS.find((h) => h.id === draftTrip.hotelId) || null;

  const availableActivities = ACTIVITIES.filter(
    (a) => a.destinationId === selectedDestination.id
  );
  const selectedGuide = TOUR_GUIDES.find((g) => g.id === draftTrip.guideId) || null;

  const nights = useMemo(() => {
    const start = new Date(draftTrip.checkIn);
    const end = new Date(draftTrip.checkOut);
    const diff = Math.round((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }, [draftTrip.checkIn, draftTrip.checkOut]);

  const selectedActivitiesList = ACTIVITIES.filter((a) =>
    draftTrip.activityIds.includes(a.id)
  );

  const hotelCost = selectedHotel ? selectedHotel.pricePerNight * nights : 0;
  const activitiesCost = selectedActivitiesList.reduce(
    (sum, a) => sum + a.price * draftTrip.travelers,
    0
  );
  const guideCost = selectedGuide ? selectedGuide.dailyRate : 0;
  const subtotal = hotelCost + activitiesCost + guideCost;
  const taxes = Math.round(subtotal * 0.12);
  const estimatedTotal = subtotal + taxes;

  const handleDestinationChange = (newId) => {
    const firstHotel = HOTELS.find((h) => h.destinationId === newId);
    const firstActivity = ACTIVITIES.find((a) => a.destinationId === newId);
    setDraftTrip((prev) => ({
      ...prev,
      destinationId: newId,
      hotelId: firstHotel ? firstHotel.id : '',
      activityIds: firstActivity ? [firstActivity.id] : [],
      guideId: '',
    }));
  };

  const toggleActivity = (id) => {
    setDraftTrip((prev) => ({
      ...prev,
      activityIds: prev.activityIds.includes(id)
        ? prev.activityIds.filter((item) => item !== id)
        : [...prev.activityIds, id],
    }));
  };

  const handleConfirm = (e) => {
    e.preventDefault();
    const record = confirmBookingPreview({
      destinationName: selectedDestination.name,
      country: selectedDestination.country,
      image: selectedDestination.image,
      checkIn: draftTrip.checkIn,
      checkOut: draftTrip.checkOut,
      nights,
      travelers: draftTrip.travelers,
      hotelName: selectedHotel?.name || 'Accommodation skipped',
      activitiesCount: selectedActivitiesList.length,
      guideName: selectedGuide?.name || 'None',
      estimatedTotal,
      leadName: leadName || 'Alex Rivera',
      leadEmail: leadEmail || 'alex@example.com',
      notes,
    });
    setConfirmedRecord(record);
  };

  if (confirmedRecord) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-lg">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#E85A34]">
            Preview Reference · {confirmedRecord.id}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold text-[#0B1B36]">
            Itinerary Preview Saved!
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            Your trip plan to <strong>{confirmedRecord.destinationName}</strong> (
            {confirmedRecord.nights} nights · {confirmedRecord.travelers} travelers) has
            been recorded locally in your Booking History. No live payment was processed.
          </p>

          <div className="mt-6 rounded-xl bg-slate-50 p-4 text-left text-xs text-slate-600">
            <div className="flex justify-between py-1">
              <span>Stay</span>
              <strong className="text-[#0B1B36]">{confirmedRecord.hotelName}</strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Experiences</span>
              <strong className="text-[#0B1B36]">
                {confirmedRecord.activitiesCount} selected
              </strong>
            </div>
            <div className="flex justify-between py-1">
              <span>Private Tour Guide</span>
              <strong className="text-[#0B1B36]">{confirmedRecord.guideName}</strong>
            </div>
            <div className="mt-2 flex justify-between border-t border-slate-200 pt-2 text-sm">
              <span className="font-bold text-[#0B1B36]">Estimated Total</span>
              <strong className="font-extrabold text-[#E85A34]">
                ${confirmedRecord.estimatedTotal.toLocaleString()}
              </strong>
            </div>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('profile')}
              className="inline-flex items-center gap-1.5 rounded-xl bg-[#0B1B36] px-5 py-2.5 text-xs font-bold text-white"
            >
              View Booking History
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setConfirmedRecord(null)}
              className="rounded-xl border border-slate-200 px-5 py-2.5 text-xs font-bold text-[#0B1B36]"
            >
              Modify Another Trip
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-2xl">
        <p className="text-xs font-bold text-[#E85A34]">
          Trip Planner &amp; Booking Preview
        </p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-[#0B1B36] sm:text-4xl">
          Build &amp; Review Your Itinerary
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Select your destination, travel dates, group size, accommodation, local
          activities, and optional tour guide for a clear cost estimate.
        </p>
      </div>

      <form onSubmit={handleConfirm} className="mt-8 grid gap-8 lg:grid-cols-12">
        {/* Left Column: 4 Steps */}
        <div className="space-y-6 lg:col-span-8">
          {/* 01. Destination, Dates & Travelers */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#0B1B36]">
              01. Destination, Dates &amp; Travelers
            </h2>
            <div className="mt-4 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Destination
                </label>
                <select
                  value={draftTrip.destinationId}
                  onChange={(e) => handleDestinationChange(e.target.value)}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-semibold text-[#0B1B36] focus:border-[#0B1B36] focus:outline-none"
                >
                  {DESTINATIONS.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}, {d.country} ({d.type})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Check-in Date
                  </label>
                  <input
                    type="date"
                    value={draftTrip.checkIn}
                    onChange={(e) =>
                      setDraftTrip((p) => ({ ...p, checkIn: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium focus:border-[#0B1B36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Check-out Date
                  </label>
                  <input
                    type="date"
                    value={draftTrip.checkOut}
                    onChange={(e) =>
                      setDraftTrip((p) => ({ ...p, checkOut: e.target.value }))
                    }
                    className="h-11 w-full rounded-xl border border-slate-200 px-3 text-sm font-medium focus:border-[#0B1B36] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-600">
                    Travelers
                  </label>
                  <div className="flex h-11 items-center justify-between rounded-xl border border-slate-200 px-3">
                    <button
                      type="button"
                      onClick={() =>
                        setDraftTrip((p) => ({
                          ...p,
                          travelers: Math.max(1, p.travelers - 1),
                        }))
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[#0B1B36] hover:bg-slate-200"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="text-sm font-extrabold text-[#0B1B36]">
                      {draftTrip.travelers}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftTrip((p) => ({
                          ...p,
                          travelers: Math.min(12, p.travelers + 1),
                        }))
                      }
                      className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-[#0B1B36] hover:bg-slate-200"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 02. Accommodation */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-[#0B1B36]">
                02. Accommodation
              </h2>
              <button
                type="button"
                onClick={() => setDraftTrip((p) => ({ ...p, hotelId: '' }))}
                className="text-xs font-semibold text-slate-400 hover:text-[#0B1B36]"
              >
                Skip hotel
              </button>
            </div>

            <div className="mt-4 space-y-3">
              {availableHotels.map((hotel) => {
                const selected = draftTrip.hotelId === hotel.id;
                return (
                  <button
                    key={hotel.id}
                    type="button"
                    onClick={() => setDraftTrip((p) => ({ ...p, hotelId: hotel.id }))}
                    className={`flex w-full items-center justify-between rounded-xl border p-3.5 text-left transition ${
                      selected
                        ? 'border-[#0B1B36] bg-slate-50/70 ring-1 ring-[#0B1B36]'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <img
                        src={hotel.image}
                        alt={hotel.name}
                        className="h-12 w-16 rounded-lg object-cover"
                      />
                      <div>
                        <p className="text-sm font-extrabold text-[#0B1B36]">
                          {hotel.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {hotel.location} · Check-in {hotel.checkIn}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-extrabold text-[#0B1B36]">
                        ${hotel.pricePerNight}
                      </p>
                      <p className="text-[11px] text-slate-400">per night</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* 03. Experiences & Tour Guide */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#0B1B36]">
              03. Experiences &amp; Tour Guide (Optional)
            </h2>
            <p className="mt-3 text-xs font-semibold text-slate-500">
              Experiences in {selectedDestination.name}
            </p>

            <div className="mt-2.5 space-y-2.5">
              {availableActivities.length > 0 ? (
                availableActivities.map((act) => {
                  const checked = draftTrip.activityIds.includes(act.id);
                  return (
                    <label
                      key={act.id}
                      className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                        checked
                          ? 'border-[#0B1B36] bg-slate-50/70'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleActivity(act.id)}
                          className="h-4 w-4 rounded accent-[#0B1B36]"
                        />
                        <div>
                          <p className="text-xs font-extrabold text-[#0B1B36]">
                            {act.title}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {act.category} · {act.duration}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-extrabold text-[#0B1B36]">
                        ${act.price}/guest
                      </span>
                    </label>
                  );
                })
              ) : (
                <p className="rounded-xl bg-slate-50 p-3 text-xs text-slate-500">
                  No pre-listed activities for this stop yet — attach a local guide below.
                </p>
              )}
            </div>

            <div className="mt-5">
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Optional Dedicated Tour Guide (1 Full Day)
              </label>
              <select
                value={draftTrip.guideId}
                onChange={(e) =>
                  setDraftTrip((p) => ({ ...p, guideId: e.target.value }))
                }
                className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm font-medium text-[#0B1B36] focus:border-[#0B1B36] focus:outline-none"
              >
                <option value="">No private guide selected</option>
                {TOUR_GUIDES.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name} — {g.regionLabel} (${g.dailyRate}/day)
                  </option>
                ))}
              </select>
            </div>
          </section>

          {/* 04. Lead Traveler Contact */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-[#0B1B36]">
              04. Lead Traveler Contact
            </h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={leadEmail}
                  onChange={(e) => setLeadEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="mb-1.5 block text-xs font-bold text-slate-600">
                Special Preferences (Optional)
              </label>
              <textarea
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Dietary notes, late check-in, accessibility requests..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-sm focus:border-[#0B1B36] focus:bg-white focus:outline-none"
              />
            </div>
          </section>
        </div>

        {/* Right Column: Sticky Cost Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3.5 border-b border-slate-100 pb-4">
              <img
                src={selectedDestination.image}
                alt={selectedDestination.name}
                className="h-14 w-16 rounded-xl object-cover"
              />
              <div>
                <p className="text-[11px] font-medium text-slate-400">
                  {selectedDestination.country} · {selectedDestination.type}
                </p>
                <h3 className="text-base font-extrabold text-[#0B1B36]">
                  {selectedDestination.name}
                </h3>
                <p className="text-xs text-slate-500">
                  {nights} nights · {draftTrip.travelers} travelers
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Accommodation ({nights} nights)</span>
                <strong className="text-[#0B1B36]">${hotelCost.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Selected Experiences ({selectedActivitiesList.length})</span>
                <strong className="text-[#0B1B36]">
                  ${activitiesCost.toLocaleString()}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Private Tour Guide</span>
                <strong className="text-[#0B1B36]">${guideCost.toLocaleString()}</strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Estimated Taxes &amp; Fees (12%)</span>
                <strong className="text-[#0B1B36]">${taxes.toLocaleString()}</strong>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-200 pt-4">
              <span className="text-sm font-bold text-[#0B1B36]">Estimated Total</span>
              <span className="text-2xl font-extrabold text-[#0B1B36]">
                ${estimatedTotal.toLocaleString()}
              </span>
            </div>

            <div className="mt-4 flex items-start gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 text-[11px] leading-relaxed text-slate-500">
              <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-slate-400" />
              <span>
                Frontend Booking Preview: Confirming generates an itinerary record in
                your local Booking History. No live payment or card billing occurs.
              </span>
            </div>

            <button
              type="submit"
              className="mt-5 w-full rounded-xl bg-[#E85A34] py-3 text-sm font-bold text-white shadow-md shadow-[#E85A34]/20 transition hover:bg-[#D44B27] active:scale-[0.99]"
            >
              Confirm Booking Preview
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}