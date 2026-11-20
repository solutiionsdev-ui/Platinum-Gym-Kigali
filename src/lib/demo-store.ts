/**
 * The demo link between the website and the CRM, until the database (step 4).
 *
 * Bookings and forms sent on the website are kept in this browser (localStorage). CRM screens read them
 * and update live, also across tabs: book on the website in one tab, see it in the CRM in another.
 * Each device keeps its own demo data; CRM Settings has a button to clear it.
 */
import { useSyncExternalStore } from "react";
import type { Session } from "./types";

export type WebBooking = { id: string; at: number; sessionId: string; name: string; phone: string; trial: boolean; waitlist: boolean };
export type WebLeadKind = "trial" | "consult" | "plan" | "program" | "online";
export type WebLead = { id: string; at: number; kind: WebLeadKind; name: string; phone: string; interest: string; details?: string };
export type DemoData = { bookings: WebBooking[]; leads: WebLead[] };

const KEY = "platinum-demo-v1";
const EVENT = "platinum-demo-change";
const EMPTY: DemoData = { bookings: [], leads: [] };
const MAX = 60;

let storageOk = true;
let cacheRaw: string | null = null;
let cacheData: DemoData = EMPTY;

function parse(raw: string | null): DemoData {
  if (!raw) return EMPTY;
  try {
    const p = JSON.parse(raw);
    return { bookings: Array.isArray(p?.bookings) ? p.bookings : [], leads: Array.isArray(p?.leads) ? p.leads : [] };
  } catch {
    return EMPTY;
  }
}

/** Current demo data in this browser. Same object until something changes (needed by useSyncExternalStore). */
export function readDemoData(): DemoData {
  if (typeof window === "undefined" || !storageOk) return cacheData;
  let raw: string | null = null;
  try {
    raw = window.localStorage.getItem(KEY);
  } catch {
    storageOk = false;
    return cacheData;
  }
  if (raw !== cacheRaw) {
    cacheRaw = raw;
    cacheData = parse(raw);
  }
  return cacheData;
}

function save(next: DemoData) {
  cacheData = next;
  const raw = JSON.stringify(next);
  try {
    window.localStorage.setItem(KEY, raw);
    cacheRaw = raw;
  } catch {
    // Private window or storage blocked: keep it in memory so the demo still works on this page.
    storageOk = false;
  }
  window.dispatchEvent(new Event(EVENT));
}

function subscribe(onChange: () => void) {
  const onStorage = (e: StorageEvent) => {
    if (e.key === null || e.key === KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(EVENT, onChange);
  };
}

/** Demo data, live. Empty on the server and during the first render, then this browser's data. */
export function useDemoData(): DemoData {
  return useSyncExternalStore(subscribe, readDemoData, () => EMPTY);
}

const uid = () => Math.random().toString(36).slice(2, 10);

export function addWebBooking(b: Omit<WebBooking, "id" | "at">): WebBooking {
  const d = readDemoData();
  const booking = { ...b, id: uid(), at: Date.now() };
  save({ ...d, bookings: [booking, ...d.bookings].slice(0, MAX) });
  return booking;
}

export function addWebLead(l: Omit<WebLead, "id" | "at">) {
  const d = readDemoData();
  save({ ...d, leads: [{ ...l, id: uid(), at: Date.now() }, ...d.leads].slice(0, MAX) });
}

export function clearDemoData() {
  cacheData = EMPTY;
  cacheRaw = null;
  try {
    window.localStorage.removeItem(KEY);
  } catch {
    /* nothing stored */
  }
  window.dispatchEvent(new Event(EVENT));
}

/** A session's numbers after the website bookings made in this browser. */
export function withWebBookings<S extends Pick<Session, "id" | "booked" | "cap" | "waiting">>(s: S, data: DemoData): S {
  let { booked, waiting } = s;
  for (const b of data.bookings) {
    if (b.sessionId !== s.id) continue;
    if (!b.waitlist && booked < s.cap) booked++;
    else waiting++;
  }
  return booked === s.booked && waiting === s.waiting ? s : { ...s, booked, waiting };
}

export function timeAgo(at: number) {
  const s = Math.max(0, (Date.now() - at) / 1000);
  if (s < 60) return "Just now";
  if (s < 3600) return `${Math.floor(s / 60)} min ago`;
  if (s < 86400) return `${Math.floor(s / 3600)} h ago`;
  return `${Math.floor(s / 86400)} days ago`;
}

export const WEB_LEAD_SOURCE: Record<WebLeadKind, string> = {
  trial: "Website · free trial form",
  consult: "Website · PT consultation",
  plan: "Website · package request",
  program: "Website · program request",
  online: "Website · online coaching",
};
