/**
 * Every page reads data through these functions. Today they return sample data;
 * in step 4 they will read from Supabase without the pages changing.
 */
import { money } from "./brand";
import type { Lang } from "./i18n";
import {
  benefits, classTypes, coaches, compareRows, demoMembers, DEMO_NOW, DEMO_TODAY, facilities, faqs, passes, plans, ptPackages, rooms, sessions, WEEK_DATES,
} from "./sample-data";
import type { RoomKey, Session } from "./types";

export const demoToday = DEMO_TODAY;
export const demoNow = DEMO_NOW;
export const weekDates = WEEK_DATES;

export const getClassTypes = () => classTypes;
export const getClassType = (slug: string) => classTypes.find((c) => c.slug === slug);
export const getCoaches = () => coaches;
export const getCoach = (slug: string) => coaches.find((c) => c.slug === slug);
export const getTrainers = () => coaches.filter((c) => c.trainer);
export const getRoomName = (room: RoomKey, lang: Lang) => rooms[room][lang];
export const getPlans = () => plans;
export const getPasses = () => passes;
export const getCompareRows = () => compareRows;
export const getBenefits = () => benefits;
export const getPtPackages = () => ptPackages;
export const getFaqs = () => faqs;
export const getFacilities = () => facilities;
export const getDemoMember = (code: string) => demoMembers.find((m) => m.code.toLowerCase() === code.toLowerCase());
export const getDemoMemberCodes = () => demoMembers.map((m) => m.code);

export const getSessions = () => sessions;
export const getSessionsForDay = (day: number) => sessions.filter((s) => s.day === day);
export const getSessionsForType = (slug: string) => sessions.filter((s) => s.type === slug);
export const getSessionsForCoach = (slug: string) => sessions.filter((s) => s.coach === slug);

/** Already happened in the demo week (before Tuesday 16:40). */
export function isPast(s: Session) {
  return s.day < DEMO_TODAY || (s.day === DEMO_TODAY && s.time < DEMO_NOW);
}

export const spotsLeft = (s: Session) => Math.max(s.cap - s.booked, 0);
export const isFull = (s: Session) => spotsLeft(s) === 0;

/** Classes still to come today, for the "Today at …" strip. */
export const getUpcomingToday = () => getSessionsForDay(DEMO_TODAY).filter((s) => !isPast(s));

/** The next class today that still has room, for the hero card. */
export const getNextOpenClass = () => getUpcomingToday().find((s) => !isFull(s));

/** "60,000 RWF" */
export const formatPrice = (n: number) => money(n);

/** Two hours before a class, for the reminder message. */
export function reminderTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  return `${String(Math.max(h - 2, 0)).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
