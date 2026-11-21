import React, { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  RotateCw,
  Pause,
  ChevronDown,
  ChevronUp,
  ArrowRight,
} from 'lucide-react';
import { DESTINATIONS } from '../data/travelData';
import { useTravora } from '../context/TravoraContext';

const deg2rad = (d) => (d * Math.PI) / 180;

// Convert lat/lon to 3D unit sphere vector
function latLonToVec(lat, lon) {
  const phi = deg2rad(90 - lat);
  const theta = deg2rad(lon + 180);
  return {
    x: -Math.sin(phi) * Math.cos(theta),
    y: Math.cos(phi),
    z: Math.sin(phi) * Math.sin(theta),
  };
}

// Rotate 3D point by yaw (Y) & pitch (X)
function rotatePoint(p, yaw, pitch) {
  const cosY = Math.cos(yaw);
  const sinY = Math.sin(yaw);
  const x1 = p.x * cosY - p.z * sinY;
  const z1 = p.x * sinY + p.z * cosY;

  const cosP = Math.cos(pitch);
  const sinP = Math.sin(pitch);
  const y2 = p.y * cosP - z1 * sinP;
  const z2 = p.y * sinP + z1 * cosP;

  return { x: x1, y: y2, z: z2 };
}

// Stylized continent polygons (lat, lon pairs) for clean globe landmasses
const CONTINENT_POLYGONS = [
  [
    [60, -135], [68, -100], [58, -75], [44, -66], [30, -82], [20, -96], [15, -88], [32, -117], [48, -125],
  ],
  [
    [10, -75], [5, -52], [-12, -38], [-35, -55], [-54, -68], [-38, -73], [-10, -78],
  ],
  [
    [36, -9], [44, -8], [52, 4], [60, 10], [66, 26], [55, 36], [42, 28], [38, 15], [40, 2],
  ],
  [
    [35, -6], [32, 32], [12, 48], [-12, 40], [-34, 20], [-20, 12], [6, 2], [15, -17],
  ],
  [
    [66, 35], [70, 105], [60, 155], [40, 138], [22, 118], [10, 104], [12, 77], [25, 56], [40, 42],
  ],
  [
    [-14, 128], [-12, 142], [-28, 153], [-38, 144], [-32, 115],
  ],
];

export default function GlobeJourneyFilm({ externalPlayTrigger }) {
  const { planDestinationTrip, setDetailModal } = useTravora();
  const canvasRef = useRef(null);
  const containerRef = useRef(null);

  const [stopIdx, setStopIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showControls, setShowControls] = useState(true);

  const rotationRef = useRef({ yaw: -1.9, pitch: 0.45 });
  const targetRotRef = useRef({ yaw: -1.9, pitch: 0.45 });
  const dragRef = useRef({ active: false, lastX: 0, lastY: 0 });

  const activeDest = DESTINATIONS[stopIdx];

  const focusStop = (idx) => {
    setStopIdx(idx);
    const d = DESTINATIONS[idx];
    targetRotRef.current = {
      yaw: -deg2rad(d.coords.lon + 90),
      pitch: deg2rad(d.coords.lat * 0.55),
    };
  };

  useEffect(() => {
    focusStop(0);
  }, []);

  useEffect(() => {
    if (externalPlayTrigger > 0) {
      setIsPlaying(true);
    }
  }, [externalPlayTrigger]);

  // Auto-advance camera reel when playing
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setStopIdx((prev) => {
        const next = (prev + 1) % DESTINATIONS.length;
        const d = DESTINATIONS[next];
        targetRotRef.current = {
          yaw: -deg2rad(d.coords.lon + 90),
          pitch: deg2rad(d.coords.lat * 0.55),
        };
        return next;
      });
    }, 4500);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // 3D Canvas render loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    let animId;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);

    let tick = 0;

    const draw = () => {
      tick += 0.02;
      const rect = container.getBoundingClientRect();
      const w = rect.width;
      const h = rect.height;
      const cx = w * 0.52;
      const cy = h * 0.5;
      const radius = Math.min(w, h) * 0.43;

      if (!dragRef.current.active) {
        rotationRef.current.yaw += (targetRotRef.current.yaw - rotationRef.current.yaw) * 0.05;
        rotationRef.current.pitch += (targetRotRef.current.pitch - rotationRef.current.pitch) * 0.05;
      }

      const { yaw, pitch } = rotationRef.current;

      ctx.clearRect(0, 0, w, h);

      // Ambient dark ocean glow
      const bgGlow = ctx.createRadialGradient(cx, cy, radius * 0.2, cx, cy, radius * 1.45);
      bgGlow.addColorStop(0, 'rgba(56, 114, 210, 0.28)');
      bgGlow.addColorStop(0.7, 'rgba(11, 27, 54, 0.1)');
      bgGlow.addColorStop(1, 'rgba(6, 15, 32, 0)');
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, w, h);

      // Sphere shading
      const sphereGrad = ctx.createRadialGradient(
        cx - radius * 0.35,
        cy - radius * 0.35,
        radius * 0.1,
        cx,
        cy,
        radius
      );
      sphereGrad.addColorStop(0, '#3364B0');
      sphereGrad.addColorStop(0.55, '#193B73');
      sphereGrad.addColorStop(1, '#0A1935');

      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = sphereGrad;
      ctx.fill();

      ctx.strokeStyle = 'rgba(120, 175, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Clip interior for graticule & continents
      ctx.save();
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.clip();

      ctx.strokeStyle = 'rgba(148, 197, 255, 0.12)';
      ctx.lineWidth = 0.8;

      for (let lat = -60; lat <= 60; lat += 30) {
        ctx.beginPath();
        let started = false;
        for (let lon = -180; lon <= 180; lon += 10) {
          const r = rotatePoint(latLonToVec(lat, lon), yaw, pitch);
          if (r.z > 0) {
            const px = cx + r.x * radius;
            const py = cy - r.y * radius;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      for (let lon = -180; lon < 180; lon += 30) {
        ctx.beginPath();
        let started = false;
        for (let lat = -85; lat <= 85; lat += 8) {
          const r = rotatePoint(latLonToVec(lat, lon), yaw, pitch);
          if (r.z > 0) {
            const px = cx + r.x * radius;
            const py = cy - r.y * radius;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        ctx.stroke();
      }

      // Stylized Continents
      CONTINENT_POLYGONS.forEach((poly) => {
        ctx.beginPath();
        let visibleCount = 0;
        poly.forEach(([lat, lon], idx) => {
          const r = rotatePoint(latLonToVec(lat, lon), yaw, pitch);
          if (r.z > -0.15) visibleCount++;
          const px = cx + r.x * radius;
          const py = cy - r.y * radius;
          if (idx === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        });
        ctx.closePath();
        if (visibleCount > 1) {
          ctx.fillStyle = 'rgba(146, 189, 245, 0.24)';
          ctx.fill();
          ctx.strokeStyle = 'rgba(186, 219, 255, 0.35)';
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      });

      ctx.restore();

      // Great-circle Flight Arcs
      for (let i = 0; i < DESTINATIONS.length; i++) {
        const a = DESTINATIONS[i];
        const b = DESTINATIONS[(i + 1) % DESTINATIONS.length];
        const va = latLonToVec(a.coords.lat, a.coords.lon);
        const vb = latLonToVec(b.coords.lat, b.coords.lon);

        ctx.beginPath();
        let started = false;
        const steps = 36;
        for (let s = 0; s <= steps; s++) {
          const t = s / steps;
          const interp = {
            x: va.x * (1 - t) + vb.x * t,
            y: va.y * (1 - t) + vb.y * t,
            z: va.z * (1 - t) + vb.z * t,
          };
          const len = Math.hypot(interp.x, interp.y, interp.z) || 1;
          const lift = 1 + Math.sin(t * Math.PI) * 0.14;
          const unit = {
            x: (interp.x / len) * lift,
            y: (interp.y / len) * lift,
            z: (interp.z / len) * lift,
          };
          const r = rotatePoint(unit, yaw, pitch);
          if (r.z > 0.02) {
            const px = cx + r.x * radius;
            const py = cy - r.y * radius;
            if (!started) {
              ctx.moveTo(px, py);
              started = true;
            } else {
              ctx.lineTo(px, py);
            }
          } else {
            started = false;
          }
        }
        const isCurrentLeg = i === stopIdx || (i + 1) % DESTINATIONS.length === stopIdx;
        ctx.strokeStyle = isCurrentLeg
          ? 'rgba(232, 90, 52, 0.92)'
          : 'rgba(232, 90, 52, 0.42)';
        ctx.lineWidth = isCurrentLeg ? 2.6 : 1.5;
        ctx.stroke();
      }

      // Destination Waypoint Pins
      DESTINATIONS.forEach((d, idx) => {
        const r = rotatePoint(latLonToVec(d.coords.lat, d.coords.lon), yaw, pitch);
        if (r.z > 0.05) {
          const px = cx + r.x * radius;
          const py = cy - r.y * radius;
          const isActive = idx === stopIdx;

          if (isActive) {
            const pulseR = 10 + Math.sin(tick * 2.5) * 4;
            ctx.beginPath();
            ctx.arc(px, py, pulseR, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(232, 90, 52, 0.25)';
            ctx.fill();
          }

          ctx.beginPath();
          ctx.arc(px, py, isActive ? 6.5 : 4.2, 0, Math.PI * 2);
          ctx.fillStyle = isActive ? '#E85A34' : '#FFFFFF';
          ctx.fill();
          ctx.strokeStyle = isActive ? '#FFFFFF' : '#E85A34';
          ctx.lineWidth = 2;
          ctx.stroke();
        }
      });

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, [stopIdx]);

  const onPointerDown = (e) => {
    setIsPlaying(false);
    dragRef.current = { active: true, lastX: e.clientX, lastY: e.clientY };
  };

  const onPointerMove = (e) => {
    if (!dragRef.current.active) return;
    const dx = e.clientX - dragRef.current.lastX;
    const dy = e.clientY - dragRef.current.lastY;
    dragRef.current.lastX = e.clientX;
    dragRef.current.lastY = e.clientY;

    rotationRef.current.yaw += dx * 0.0065;
    rotationRef.current.pitch = Math.max(
      -1.1,
      Math.min(1.1, rotationRef.current.pitch + dy * 0.0065)
    );
    targetRotRef.current = { ...rotationRef.current };
  };

  const onPointerUp = () => {
    dragRef.current.active = false;
  };

  return (
    <section id="journey-film" className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
      <div className="mb-5 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-[#E85A34]">
            3D Route Animation
          </p>
          <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-[#0B1B36] sm:text-3xl">
            Interactive 3D Global Journey Film
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-slate-500 sm:text-sm">
          Watch the continuous 3D camera flythrough across Travora&apos;s destinations, drag
          the globe to orbit freely, or jump directly to any stop.
        </p>
      </div>

      <div
        ref={containerRef}
        className="relative h-[430px] w-full overflow-hidden rounded-2xl bg-[#071328] shadow-2xl sm:h-[490px]"
      >
        <canvas
          ref={canvasRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
          className="h-full w-full cursor-grab touch-none active:cursor-grabbing"
        />

        {/* Top-Left Stop HUD Card */}
        <div className="absolute left-4 top-4 max-w-xs rounded-2xl border border-white/15 bg-[#09162B]/85 p-4 text-white backdrop-blur-md sm:left-6 sm:top-6">
          <p className="text-[11px] font-semibold text-slate-300">
            Stop {stopIdx + 1} of {DESTINATIONS.length} · {activeDest.region}
          </p>
          <h3 className="mt-1 flex items-center gap-1.5 text-base font-extrabold sm:text-lg">
            <MapPin className="h-4 w-4 shrink-0 text-[#E85A34]" />
            <span>
              {activeDest.name}, {activeDest.country}
            </span>
          </h3>
          <div className="mt-3 flex items-center gap-3 text-xs font-bold">
            <button
              type="button"
              onClick={() => setDetailModal({ type: 'destination', data: activeDest })}
              className="text-white/90 transition hover:text-white"
            >
              Explore Attractions
            </button>
            <span className="text-white/25">|</span>
            <button
              type="button"
              onClick={() => planDestinationTrip(activeDest.id)}
              className="inline-flex items-center gap-1 text-[#E85A34] transition hover:text-[#ff7652]"
            >
              <span>Plan This Stop</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Top-Right Camera Toggle */}
        <button
          type="button"
          onClick={() => setIsPlaying((p) => !p)}
          className="absolute right-4 top-4 inline-flex items-center gap-2 rounded-xl border border-white/15 bg-[#09162B]/85 px-3.5 py-2 text-xs font-semibold text-white backdrop-blur-md transition hover:bg-white/15 sm:right-6 sm:top-6"
        >
          {isPlaying ? (
            <>
              <Pause className="h-3.5 w-3.5 text-[#E85A34]" />
              <span>Pause Camera Reel</span>
            </>
          ) : (
            <>
              <RotateCw className="h-3.5 w-3.5 text-[#E85A34]" />
              <span>Resume Camera Reel</span>
            </>
          )}
        </button>

        {/* Bottom-Left Collapsible Timeline Scrubber */}
        <div className="absolute bottom-4 left-4 right-4 max-w-xl sm:bottom-6 sm:left-6">
          <button
            type="button"
            onClick={() => setShowControls((s) => !s)}
            className="mb-2 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-[#09162B]/85 px-3 py-1.5 text-[11px] font-semibold text-slate-200 backdrop-blur-md hover:text-white"
          >
            {showControls ? (
              <>
                <ChevronDown className="h-3.5 w-3.5" />
                <span>Hide Controls</span>
              </>
            ) : (
              <>
                <ChevronUp className="h-3.5 w-3.5" />
                <span>Show Route Scrubber</span>
              </>
            )}
          </button>

          {showControls && (
            <div className="rounded-2xl border border-white/15 bg-[#09162B]/90 p-3.5 backdrop-blur-md">
              <input
                type="range"
                min={0}
                max={DESTINATIONS.length - 1}
                value={stopIdx}
                onChange={(e) => {
                  setIsPlaying(false);
                  focusStop(Number(e.target.value));
                }}
                className="mb-3 h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-white/20 accent-[#E85A34]"
              />

              <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                {DESTINATIONS.map((dest, idx) => {
                  const active = idx === stopIdx;
                  return (
                    <button
                      key={dest.id}
                      type="button"
                      onClick={() => {
                        setIsPlaying(false);
                        focusStop(idx);
                      }}
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-bold transition ${
                        active
                          ? 'bg-white text-[#0B1B36]'
                          : 'bg-white/10 text-slate-300 hover:bg-white/20 hover:text-white'
                      }`}
                    >
                      {dest.name.split(' ')[0]}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}