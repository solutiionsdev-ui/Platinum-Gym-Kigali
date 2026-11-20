/**
 * Calendar helpers shared by the website ("Add to my calendar"), the CRM calendar and the
 * calendar feed at /api/calendar that Google Calendar, Apple Calendar or Outlook can subscribe to.
 */
import { brand } from "./brand";
import { getClassType, getCoach, getRoomName } from "./data";
import type { Session } from "./types";

/** The demo week starts Monday 23 November 2026. Kigali is UTC+2 all year (no daylight saving). */
const WEEK_START_UTC = Date.UTC(2026, 10, 23);
const KIGALI_UTC_OFFSET_HOURS = 2;
export const KIGALI_TZ = "Africa/Kigali";

export function toMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function fromMinutes(min: number) {
  return `${String(Math.floor(min / 60)).padStart(2, "0")}:${String(min % 60).padStart(2, "0")}`;
}

/** Start of a session as a real moment in time (Kigali clock). */
export function startDate(day: number, time: string) {
  return new Date(WEEK_START_UTC + day * 86_400_000 + (toMinutes(time) - KIGALI_UTC_OFFSET_HOURS * 60) * 60_000);
}

/** 20261124T163000Z */
const stamp = (d: Date) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");

export type CalEvent = { uid: string; title: string; details: string; location: string; start: Date; end: Date; weekly?: boolean };

export function sessionEvent(s: Session): CalEvent {
  const type = getClassType(s.type)!;
  const coach = getCoach(s.coach);
  const start = startDate(s.day, s.time);
  return {
    uid: `class-${s.id}`,
    title: `${type.name.en} · ${brand.name}`,
    details: `${type.oneLine.en} With ${coach?.first.en ?? "your coach"}, ${getRoomName(s.room, "en")}. Can't make it? Cancel on WhatsApp.`,
    location: `${brand.name}, ${brand.address.en}`,
    start,
    end: new Date(start.getTime() + type.mins * 60_000),
  };
}

/** Opens Google Calendar with the class filled in, ready to save. */
export function googleCalendarUrl(s: Session) {
  const e = sessionEvent(s);
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${stamp(e.start)}/${stamp(e.end)}`,
    details: e.details,
    location: e.location,
    ctz: KIGALI_TZ,
  });
  return `https://calendar.google.com/calendar/render?${q.toString()}`;
}

/** .ics file for one class: Apple Calendar, Outlook and others. */
export const icsUrl = (s: Session) => `/api/calendar?session=${encodeURIComponent(s.id)}`;

const esc = (t: string) => t.replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");

export function icsCalendar(name: string, events: CalEvent[]) {
  const now = stamp(new Date());
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Platinum Gym//Demo//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${esc(name)}`,
    `X-WR-TIMEZONE:${KIGALI_TZ}`,
  ];
  for (const e of events) {
    lines.push(
      "BEGIN:VEVENT",
      `UID:${e.uid}@${brand.shortLink}`,
      `DTSTAMP:${now}`,
      `DTSTART:${stamp(e.start)}`,
      `DTEND:${stamp(e.end)}`,
      `SUMMARY:${esc(e.title)}`,
      `DESCRIPTION:${esc(e.details)}`,
      `LOCATION:${esc(e.location)}`,
    );
    if (e.weekly) lines.push("RRULE:FREQ=WEEKLY");
    lines.push("END:VEVENT");
  }
  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
