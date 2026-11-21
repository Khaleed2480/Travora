import React, { useState } from 'react';
import { X, MapPin, Clock, Star, CheckCircle2, Send } from 'lucide-react';
import { useTravora } from '../context/TravoraContext';

export default function DetailModals() {
  const {
    detailModal,
    setDetailModal,
    planDestinationTrip,
    bookSpecificHotel,
    selectGuideForTrip,
    showToast,
  } = useTravora();

  const [guideMsg, setGuideMsg] = useState('');

  if (!detailModal) return null;
  const { type, data } = detailModal;

  const close = () => {
    setGuideMsg('');
    setDetailModal(null);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#071226]/70 p-4 backdrop-blur-sm"
      onClick={close}
    >
      <div
        className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={close}
          aria-label="Close modal"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#0B1B36] shadow hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Destination Attractions Modal */}
        {type === 'destination' && (
          <div>
            <img
              src={data.image}
              alt={data.name}
              className="h-56 w-full object-cover"
            />
            <div className="p-6">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>
                  {data.country} · {data.region} · {data.type}
                </span>
                <span className="inline-flex items-center gap-1 font-bold text-[#0B1B36]">
                  <Star className="h-3.5 w-3.5 fill-[#E85A34] text-[#E85A34]" />
                  {data.rating}
                </span>
              </div>
              <h3 className="mt-1 text-2xl font-extrabold text-[#0B1B36]">
                {data.name}
              </h3>
              <p className="mt-2 text-sm text-slate-600">{data.shortDesc}</p>

              <h4 className="mt-6 text-xs font-bold uppercase tracking-wider text-[#E85A34]">
                Top Landmarks &amp; Attractions
              </h4>
              <div className="mt-3 space-y-3">
                {data.attractions.map((att) => (
                  <div
                    key={att.title}
                    className="rounded-xl border border-slate-200 bg-slate-50/70 p-3.5"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-bold text-[#0B1B36]">{att.title}</p>
                      <span className="flex items-center gap-1 text-xs font-medium text-slate-500">
                        <Clock className="h-3.5 w-3.5" />
                        {att.duration}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-slate-600">{att.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">
                  Estimated from{' '}
                  <strong className="text-lg font-extrabold text-[#0B1B36]">
                    ${data.pricePerDay}
                  </strong>
                  /day
                </span>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    planDestinationTrip(data.id);
                  }}
                  className="rounded-xl bg-[#E85A34] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D44B27]"
                >
                  Plan This Trip →
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Hotel Details Modal */}
        {type === 'hotel' && (
          <div>
            <img src={data.image} alt={data.name} className="h-56 w-full object-cover" />
            <div className="p-6">
              <span className="text-xs font-bold text-[#E85A34]">{data.type}</span>
              <h3 className="mt-1 text-2xl font-extrabold text-[#0B1B36]">{data.name}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-[#E85A34]" />
                {data.location} · Check-in {data.checkIn} / Check-out {data.checkOut}
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                {data.description}
              </p>

              <div className="mt-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Included Amenities
                </p>
                <div className="mt-2.5 grid grid-cols-2 gap-2">
                  {data.amenities.map((a) => (
                    <div
                      key={a}
                      className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2 text-xs font-semibold text-[#0B1B36]"
                    >
                      <CheckCircle2 className="h-3.5 w-3.5 text-[#E85A34]" />
                      {a}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-sm text-slate-500">
                  <strong className="text-xl font-extrabold text-[#0B1B36]">
                    ${data.pricePerNight}
                  </strong>{' '}
                  / night
                </span>
                <button
                  type="button"
                  onClick={() => {
                    close();
                    bookSpecificHotel(data);
                  }}
                  className="rounded-xl bg-[#E85A34] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#D44B27]"
                >
                  Select &amp; Book Stay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Guide Contact Modal */}
        {type === 'guide' && (
          <div className="p-6">
            <div className="flex items-center gap-4">
              <img
                src={data.image}
                alt={data.name}
                className="h-16 w-16 rounded-2xl object-cover"
              />
              <div>
                <h3 className="text-xl font-extrabold text-[#0B1B36]">{data.name}</h3>
                <p className="text-xs text-slate-500">
                  {data.regionLabel} · {data.languages.join(', ')}
                </p>
                <p className="mt-0.5 text-xs font-bold text-[#E85A34]">
                  ${data.dailyRate} / day private rate
                </p>
              </div>
            </div>

            <p className="mt-4 text-sm text-slate-600">{data.bio}</p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                showToast(
                  `Inquiry sent to ${data.name} (frontend preview — no live messaging server).`
                );
                close();
              }}
              className="mt-5 space-y-3 border-t border-slate-100 pt-4"
            >
              <label className="block text-xs font-bold text-[#0B1B36]">
                Message {data.name.split(' ')[0]} about dates or custom routes
              </label>
              <textarea
                rows={3}
                required
                value={guideMsg}
                onChange={(e) => setGuideMsg(e.target.value)}
                placeholder="Hi! We are visiting in October for 3 days and would love a dawn heritage walk..."
                className="w-full rounded-xl border border-slate-200 p-3 text-sm focus:border-[#0B1B36] focus:outline-none"
              />
              <div className="flex flex-wrap items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => {
                    close();
                    selectGuideForTrip(data);
                  }}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-[#0B1B36] hover:bg-slate-50"
                >
                  Book Directly in Planner
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-[#E85A34] px-4 py-2 text-xs font-bold text-white hover:bg-[#D44B27]"
                >
                  <Send className="h-3.5 w-3.5" />
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}