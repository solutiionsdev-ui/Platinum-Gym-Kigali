/**
 * Every CRM page reads data through these functions. Sample data today; Supabase in step 4.
 * The timetable is shared with the website (src/lib/data.ts), so both sides always agree.
 */
import { money } from "./brand";
import { getClassType, getCoach, getSessionsForDay, isFull, isPast, spotsLeft, demoToday } from "./data";
import {
  automations, coachStats, DEMO_DATE, daysBetween, deskStats, leads, leaveRequest, memberExtras, members, money as moneyData, onlineClients, onShift, payroll, PLAN_LABELS, previewValues,
  ptToday, recentMessages, staff, type CrmMember, type MemberStatus,
} from "./crm-sample-data";

export { DEMO_DATE, PLAN_LABELS, type CrmMember, type MemberStatus };
export const DEMO_TIME = "16:40";

export const PLAN_PRICES: Record<CrmMember["planId"], number> = { monthly: 120000, "3m": 300000, "6m": 550000, "12m": 1000000, pack10: 90000, student: 80000, trial: 0 };

/* ---------- Formatting ---------- */

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export function fmtDate(iso: string, withYear = true) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]}${withYear ? " " + y : ""}`;
}
export const rwf = money;
export const daysLeft = (m: CrmMember) => daysBetween(DEMO_DATE, m.end);
export function lastVisitLabel(iso: string) {
  const ago = daysBetween(iso, DEMO_DATE);
  if (ago <= 0) return "Today";
  if (ago === 1) return "Yesterday";
  if (ago < 14) return `${ago} days ago`;
  return `${Math.round(ago / 7)} weeks ago`;
}

/** Status chip colors and labels. Color is only ever used for status. */
export const STATUS: Record<MemberStatus, { label: string; cls: string }> = {
  active: { label: "Active", cls: "bg-ok-bg text-ok" },
  expiring: { label: "Ending soon", cls: "bg-warn-bg text-warn" },
  frozen: { label: "Frozen", cls: "bg-info-bg text-info" },
  expired: { label: "Expired", cls: "bg-bad-bg text-bad" },
  trial: { label: "Trial", cls: "bg-trial-bg text-trial" },
};

/* ---------- Members ---------- */

export const getMembers = () => members;
export const getMember = (id: string) => members.find((m) => m.id === id);
export const findMemberByName = (name: string) => members.find((m) => m.name === name);
export const activeCount = () => members.filter((m) => m.status === "active" || m.status === "expiring").length;
export function statusCounts() {
  const c: Record<MemberStatus, number> = { active: 0, expiring: 0, frozen: 0, expired: 0, trial: 0 };
  for (const m of members) c[m.status]++;
  return c;
}
export const getOverdue = () =>
  members.filter((m) => m.owes > 0).map((m) => ({ ...m, daysLate: moneyData.overdueDays[m.name] ?? 1 })).sort((a, b) => b.daysLate - a.daysLate);
export const getExpiringSoon = () => members.filter((m) => m.status === "expiring").sort((a, b) => a.end.localeCompare(b.end));
export const getNotSeen = (days = 14) =>
  members.filter((m) => (m.status === "active" || m.status === "expiring") && daysBetween(m.lastVisit, DEMO_DATE) >= days);
export const getPtClients = (trainer: string) => members.filter((m) => m.trainer === trainer && m.ptLeft !== null);

/** Members booked into a class, picked the same way every time so lists stay stable. */
export function getRoster(sessionId: string, count: number) {
  let h = 0;
  for (const ch of sessionId) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const pool = members.filter((m) => m.status === "active" || m.status === "expiring" || m.status === "trial");
  const out: CrmMember[] = [];
  for (let i = 0; out.length < Math.min(count, pool.length) && i < pool.length * 2; i++) {
    const m = pool[(h + i * 37) % pool.length];
    if (!out.includes(m)) out.push(m);
  }
  return out;
}

/** Everything the member page shows. The canvas member has hand-written detail; others are generated. */
export function getMemberDetail(m: CrmMember) {
  const extra = memberExtras[m.id];
  if (extra) return extra;
  let seed = 0;
  for (const ch of m.id) seed = (seed * 31 + ch.charCodeAt(0)) >>> 0;
  const rand = () => ((seed = (seed * 1103515245 + 12345) >>> 0) % 1000) / 1000;
  const perWeek = m.visits4w / 4;
  const weeks = Array.from({ length: 12 }, (_, i) =>
    m.status === "frozen" && i > 7 ? 0 : Math.max(0, Math.round(perWeek + (rand() - 0.5) * 2)),
  );
  const types = ["Akantu", "Traditional Strength", "Abs & Core", "Boxing", "Aerobics", "Mobility"];
  const a = types[Math.floor(rand() * 6)];
  const b = types.filter((t) => t !== a)[Math.floor(rand() * 5)];
  const methods = ["Cash", "Card", "MTN MoMo", "Airtel Money", "Bank transfer"];
  const desk = rand() < 0.6 ? "Clarisse Umutoni" : "Arsène Nkusi";
  const payments = m.planId === "trial" ? [] : [{ date: fmtDate(m.start), item: `${PLAN_LABELS[m.planId]} membership`, method: `${methods[Math.floor(rand() * 5)]} · ${desk}`, amount: PLAN_PRICES[m.planId] }];
  const wa: { text: string; when: string; scheduled?: boolean }[] = [];
  if (m.owes > 0) wa.push({ text: `Payment overdue reminder · ${rwf(m.owes)}`, when: "Today 16:45" });
  if (m.status === "expiring") wa.push({ text: `Membership ends ${fmtDate(m.end, false)}: renewal reminder`, when: "This week" });
  if (m.status === "expired") wa.push({ text: "Renewal offer: 5 extra days if renewed this week", when: fmtDate(addDaysIso(m.end, 1), false) });
  if (m.status === "trial") wa.push({ text: "Trial follow-up with first-month offer", when: "Evening of the trial" });
  if (m.status === "frozen") wa.push({ text: "Freeze confirmed, new end date sent", when: "Last month" });
  if (m.status === "active") wa.push({ text: "Class reminder", when: lastVisitLabel(m.lastVisit) });
  wa.push({ text: "Welcome message with booking link", when: fmtDate(m.since) });
  return {
    weeks,
    favourites: [[a, Math.round(m.visits4w * 1.6)], [b, Math.round(m.visits4w * 0.8)]] as [string, number][],
    noShows: Math.floor(rand() * 3),
    upcoming: [] as { when: string; what: string; status: string; tone: "booked" | "waitlist" }[],
    scans: [] as { date: string; weight: string; fat: string; muscle: string; by: string }[],
    scanChange: ["", "", ""] as [string, string, string],
    payments,
    whatsapp: wa,
    birthday: "Not given",
    emergency: "Not given",
    waiver: m.planId === "trial" ? "Signed at trial" : `Signed ${fmtDate(m.since)}`,
    health: "",
    note: null as null | { text: string; by: string },
  };
}

function addDaysIso(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

/* ---------- Today ---------- */

export function getTodayClasses() {
  return getSessionsForDay(demoToday).map((s) => {
    const type = getClassType(s.type)!;
    const [h, m] = s.time.split(":").map(Number);
    const endMin = h * 60 + m + type.mins;
    const [nh, nm] = DEMO_TIME.split(":").map(Number);
    const nowMin = nh * 60 + nm;
    const state: "done" | "now" | "full" | "later" =
      endMin <= nowMin ? "done" : h * 60 + m <= nowMin ? "now" : isFull(s) ? "full" : "later";
    return { ...s, name: type.name.en, coachName: getCoach(s.coach)?.first.en ?? "", state };
  });
}

/** Classes coming up in the next days that are nearly empty (under 30% booked). */
export function getQuietClasses() {
  const out = [];
  for (let day = demoToday; day < 7; day++) {
    for (const s of getSessionsForDay(day)) {
      if (!isPast(s) && s.booked / s.cap < 0.3) out.push(s);
    }
  }
  return out;
}

/** Full classes still to come today, with people waiting. */
export const getFullWithWaitlist = () => getSessionsForDay(demoToday).filter((s) => !isPast(s) && isFull(s) && s.waiting > 0);
export { spotsLeft };

export const getPtToday = () => ptToday;

/* ---------- Leads, money, team, messages ---------- */

export const getLeads = () => leads;
export const getMoney = () => moneyData;
export const getLeaveRequest = () => leaveRequest;
export const getOnlineClients = () => onlineClients;
export const getStaff = () => staff;
export const getCoachStats = () => coachStats;
export const getDeskStats = () => deskStats;
export const getOnShift = () => onShift;
export const getPayroll = () => payroll;
export const getAutomations = () => automations;
export const getRecentMessages = () => recentMessages;

export function fillTemplate(text: string) {
  const v = previewValues;
  return text.replace(/\{(\w+)\}/g, (_, k: string) => v[k] ?? `{${k}}`);
}
