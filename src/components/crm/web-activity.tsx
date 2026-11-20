"use client";

import { CalendarCheck, ExternalLink, Laptop, ListOrdered, UserPlus } from "lucide-react";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import { getClassType, getSessions } from "@/lib/data";
import { timeAgo, useDemoData, WEB_LEAD_SOURCE, type WebBooking, type WebLead } from "@/lib/demo-store";
import { Chip } from "./ui";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [23, 24, 25, 26, 27, 28, 29];

/** "Abs & Core · Tue 24, 19:30" for a website booking. */
export function sessionLabel(sessionId: string) {
  const s = getSessions().find((x) => x.id === sessionId);
  if (!s) return "a class";
  return `${getClassType(s.type)?.name.en} · ${DAYS[s.day]} ${DATES[s.day]}, ${s.time}`;
}

/** Re-renders every 30 seconds so "2 min ago" stays right. */
export function useTick(ms = 30_000) {
  const [, set] = useState(0);
  useEffect(() => {
    const id = setInterval(() => set((n) => n + 1), ms);
    return () => clearInterval(id);
  }, [ms]);
}

type Item =
  | { kind: "booking"; at: number; b: WebBooking }
  | { kind: "lead"; at: number; l: WebLead };

/** Today page: everything that came in from the website, newest first, live. */
export function WebActivity() {
  const data = useDemoData();
  useTick();
  const items: Item[] = [
    ...data.bookings.map((b) => ({ kind: "booking" as const, at: b.at, b })),
    ...data.leads.map((l) => ({ kind: "lead" as const, at: l.at, l })),
  ].sort((a, b) => b.at - a.at);

  return (
    <section aria-labelledby="web-h" className="min-w-0 rounded-[14px] border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-3.5">
        <h2 id="web-h" className="flex items-center gap-2.5 text-base font-semibold">
          <span className="relative flex size-2.5">
            <span aria-hidden className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
            <span aria-hidden className="relative inline-flex size-2.5 rounded-full bg-accent" />
          </span>
          From the website, live
          {items.length > 0 && <span className="font-mono font-normal text-muted">{items.length}</span>}
        </h2>
        <span className="text-[13px] text-muted">Bookings and forms land here the moment they&apos;re sent</span>
      </div>
      {items.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-muted">
          <span>Nothing new yet. Book a class or send a form on the website and it appears here, in the calendar and in leads.</span>
          <Link href="/en/classes" target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:underline">
            Open the website <ExternalLink aria-hidden className="size-3.5" />
          </Link>
        </div>
      ) : (
        <ul>
          {items.slice(0, 6).map((it) => (
            <li key={it.kind === "booking" ? it.b.id : it.l.id} className="flex flex-wrap items-center gap-3.5 border-b border-divider px-5 py-3 last:border-0">
              {it.kind === "booking" ? <BookingRow b={it.b} /> : <LeadRow l={it.l} />}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function Icon({ children }: { children: ReactNode }) {
  return <span className="flex size-[34px] shrink-0 items-center justify-center rounded-[10px] bg-accent/25 text-[#5c4300]">{children}</span>;
}

function BookingRow({ b }: { b: WebBooking }) {
  return (
    <>
      <Icon>{b.waitlist ? <ListOrdered aria-hidden className="size-[18px]" /> : <CalendarCheck aria-hidden className="size-[18px]" />}</Icon>
      <div className="min-w-0 flex-[1_1_240px]">
        <div className="font-semibold">
          {b.name} {b.waitlist ? "joined the waitlist" : "booked"} <span className="font-normal text-ink-2">{sessionLabel(b.sessionId)}</span>
        </div>
        <div className="text-sm text-muted">
          <span className="font-mono">{b.phone}</span> · {timeAgo(b.at)} · WhatsApp confirmation sent
        </div>
      </div>
      {b.trial && <Chip cls="bg-trial-bg text-trial">First visit</Chip>}
      <Link href={`/admin/schedule?session=${encodeURIComponent(b.sessionId)}`} className="inline-flex h-10 items-center rounded-[10px] border border-border px-3.5 text-sm font-semibold hover:border-bar-muted">
        See in calendar
      </Link>
    </>
  );
}

function LeadRow({ l }: { l: WebLead }) {
  const online = l.kind === "online";
  return (
    <>
      <Icon>{online ? <Laptop aria-hidden className="size-[18px]" /> : <UserPlus aria-hidden className="size-[18px]" />}</Icon>
      <div className="min-w-0 flex-[1_1_240px]">
        <div className="font-semibold">
          {l.name} <span className="font-normal text-ink-2">· {l.interest || "Not sure yet"}</span>
        </div>
        <div className="text-sm text-muted">
          {WEB_LEAD_SOURCE[l.kind]} · <span className="font-mono">{l.phone}</span> · {timeAgo(l.at)}
        </div>
      </div>
      <Link href={online ? "/admin/training#online" : "/admin/members/leads"} className="inline-flex h-10 items-center rounded-[10px] border border-border px-3.5 text-sm font-semibold hover:border-bar-muted">
        {online ? "Open online clients" : "Open leads"}
      </Link>
    </>
  );
}
