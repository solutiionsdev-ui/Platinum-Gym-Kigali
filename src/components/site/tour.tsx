"use client";

import clsx from "clsx";
import { Camera, ChevronLeft, ChevronRight, Play, Rotate3d } from "lucide-react";
import { useState } from "react";
import { Photo, PhotoPlaceholder } from "@/components/ui";
import { brand } from "@/lib/brand";
import type { PhotoKey } from "@/lib/photos";

type Zone = { id: string; name: string; text: string; doHere: string; photos: PhotoKey[]; area: string };

const ZONES: Zone[] = [
  { id: "reception", name: "Reception", area: "reception", photos: ["reception"], text: "Where you check in, pay, get a towel and ask questions. Free WiFi.", doHere: "Show your WhatsApp booking or buy a day pass." },
  { id: "weights", name: "Weights floor", area: "weights", photos: ["floorWide", "coachDumbbells", "dumbbellHand", "technogym"], text: "Technogym machines, racks and free weights. A coach is on the floor to help.", doHere: "Traditional Strength, Akantu, Build Muscle and Tone & Shape." },
  { id: "machines", name: "Machines", area: "machines", photos: ["machineRow", "machineCable", "machinePull"], text: "Machines guide the movement for you: the safest way to start if you are new.", doHere: "Strong Start and Strong & Confident (beginner programs)." },
  { id: "cardio", name: "Cardio zone", area: "cardio", photos: ["cardioBikes", "cardioClimber", "cardioRun", "cardioWalk"], text: "Treadmills, bikes and climbers by the windows.", doHere: "Warm-ups, Lose the Belly, Lose Weight Safely." },
  { id: "studio", name: "Studio", area: "studio", photos: ["studioMural", "studioBag", "stretching"], text: "Where the classes happen, with the boxing bags.", doHere: "Aerobics, Step Aerobics, Abs & Core, Mobility, Boxing." },
  { id: "sauna", name: "Sauna & steam", area: "sauna", photos: [], text: "Relax your muscles after training. Included in every package.", doHere: "10 to 15 minutes after your workout. Drink water after." },
  { id: "changing", name: "Changing rooms", area: "changing", photos: [], text: "Showers and lockers. Towels at the desk.", doHere: "Change before and shower after." },
];

/** Virtual tour: a simple map of the gym; tap a zone to see it. */
export function Tour() {
  const [zoneId, setZoneId] = useState("weights");
  const [i, setI] = useState(0);
  const [video, setVideo] = useState(false);
  const zone = ZONES.find((z) => z.id === zoneId)!;
  const count = zone.photos.length;

  function pick(id: string) {
    setZoneId(id);
    setI(0);
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="grid gap-6 lg:grid-cols-[1fr_1.5fr]">
        {/* Map */}
        <div>
          <div className="mb-3 flex items-center justify-between text-sm text-muted">
            <span>Tap a zone</span>
            <span>Not to scale<span className="hidden sm:inline"> · {brand.size}</span></span>
          </div>
          <div
            role="group"
            aria-label="Gym map"
            className="grid aspect-[4/3] gap-2 rounded-[22px] border border-line bg-surface-2 p-2"
            style={{
              gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
              gridTemplateAreas: `"cardio weights weights studio" "machines weights weights studio" "changing sauna reception reception"`,
            }}
          >
            {ZONES.map((z) => {
              const on = z.id === zoneId;
              return (
                <button
                  key={z.id}
                  type="button"
                  onClick={() => pick(z.id)}
                  aria-pressed={on}
                  style={{ gridArea: z.area }}
                  className={clsx(
                    "flex min-h-11 items-end rounded-2xl border p-2 text-start text-[12px] font-semibold leading-tight hyphens-auto transition sm:p-2.5 sm:text-[15px]",
                    on ? "border-accent bg-accent text-bg" : "border-line bg-surface hover:border-control",
                  )}
                >
                  {z.name}
                </button>
              );
            })}
          </div>
          <p className="mt-3 text-sm text-muted">Entrance is at the reception, bottom right.</p>
        </div>

        {/* Viewer */}
        <div className="flex flex-col gap-4">
          <div className="relative overflow-hidden rounded-[22px] border border-line bg-surface">
            {count > 0 ? (
              <Photo k={zone.photos[i]} alt={`${zone.name}, photo ${i + 1} of ${count}`} className="aspect-[4/3] w-full" />
            ) : (
              <PhotoPlaceholder label={`${zone.name}: 360° photo to shoot`} className="aspect-[4/3] w-full rounded-none border-0">
                <span className="flex items-center gap-2 self-start rounded-full bg-bg px-3 py-1.5 text-ink">
                  <Camera aria-hidden className="size-4" /> We shoot this zone with a 360° camera before launch
                </span>
              </PhotoPlaceholder>
            )}
            {count > 1 && (
              <>
                <button type="button" aria-label="Previous photo" onClick={() => setI((i - 1 + count) % count)}
                  className="absolute start-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-ink backdrop-blur">
                  <ChevronLeft aria-hidden className="size-5" />
                </button>
                <button type="button" aria-label="Next photo" onClick={() => setI((i + 1) % count)}
                  className="absolute end-3 top-1/2 inline-flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-bg/80 text-ink backdrop-blur">
                  <ChevronRight aria-hidden className="size-5" />
                </button>
                <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1.5">
                  {zone.photos.map((p, n) => (
                    <button key={p} type="button" aria-label={`Photo ${n + 1}`} onClick={() => setI(n)}
                      className={clsx("h-2 rounded-full transition-all", n === i ? "w-6 bg-accent" : "w-2 bg-white/60")} />
                  ))}
                </div>
              </>
            )}
            <span className="absolute end-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-bg/80 px-3 py-1.5 text-xs font-semibold text-ink backdrop-blur">
              <Rotate3d aria-hidden className="size-4 text-accent" /> 360° view coming
            </span>
          </div>
          <div>
            <h2 className="font-display text-[40px] uppercase leading-none">{zone.name}</h2>
            <p className="mt-2 text-lg text-ink-2">{zone.text}</p>
            <p className="mt-1 text-muted"><span className="font-semibold text-ink">What you do here:</span> {zone.doHere}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {ZONES.map((z) => (
              <button key={z.id} type="button" onClick={() => pick(z.id)} aria-pressed={z.id === zoneId}
                className={clsx("min-h-11 rounded-full border px-4 text-[15px] font-medium transition", z.id === zoneId ? "border-accent text-accent" : "border-line hover:border-control")}>
                {z.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Video tour: loads only when asked, to save mobile data */}
      <section aria-labelledby="video-h" className="rounded-[24px] border border-line bg-surface p-5 sm:p-8">
        <h2 id="video-h" className="text-2xl font-semibold">Watch the video tour</h2>
        <p className="mt-1 text-muted">The video only loads when you press play, to save your mobile data.</p>
        <div className="mt-5 overflow-hidden rounded-2xl border border-line">
          {video ? (
            <iframe
              title="Platinum Gym video tour"
              src={`https://www.youtube-nocookie.com/embed/${brand.youtubeId}?autoplay=1&rel=0`}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              className="aspect-video w-full"
            />
          ) : (
            <button type="button" onClick={() => setVideo(true)} className="group relative block aspect-video w-full">
              <Photo k="floorDark" alt="" className="absolute inset-0 h-full w-full opacity-70" />
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex size-20 items-center justify-center rounded-full bg-accent text-bg transition group-hover:scale-105">
                  <Play aria-hidden className="ms-1 size-9 fill-current" />
                </span>
              </span>
              <span className="sr-only">Play the video tour</span>
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
