"use client";

import clsx from "clsx";
import { useState } from "react";
import { getDict, type Lang } from "@/lib/i18n";
import type { MemberBooking } from "@/lib/types";

/** Upcoming bookings with a Cancel button. In the demo, cancelling only changes this screen. */
export function MemberBookings({ lang, bookings }: { lang: Lang; bookings: MemberBooking[] }) {
  const t = getDict(lang);
  const [cancelled, setCancelled] = useState<string[]>([]);

  return (
    <ul className="flex flex-col">
      {bookings.map((b) => {
        const isCancelled = cancelled.includes(b.id);
        return (
          <li key={b.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-line-soft py-4 last:border-0">
            <div className={clsx("min-w-0 flex-1", isCancelled && "text-faint line-through")}>
              <div className="font-semibold">{b.what[lang]}</div>
              <div className="text-[15px] text-muted">{b.when[lang]}</div>
            </div>
            <span
              className={clsx(
                "inline-flex h-7 items-center rounded-full px-3 text-[13px] font-semibold",
                isCancelled ? "bg-line text-muted" : b.status === "waitlist" ? "bg-[#3a2a12] text-warn" : "bg-[#1f2a10] text-accent",
              )}
            >
              {isCancelled ? t.myBookings.cancelled : b.status === "waitlist" ? t.myBookings.waitlist(b.place ?? 1) : t.myBookings.booked}
            </span>
            {!isCancelled && (
              <button
                type="button"
                onClick={() => setCancelled((c) => [...c, b.id])}
                className="min-h-11 rounded-full border border-control px-4 text-[15px] font-semibold transition hover:border-ink-2"
              >
                {t.myBookings.cancel}
              </button>
            )}
          </li>
        );
      })}
    </ul>
  );
}
