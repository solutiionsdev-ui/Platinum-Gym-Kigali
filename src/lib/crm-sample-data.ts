/**
 * SAMPLE DATA ONLY for the CRM (owner and staff side). Made-up people and numbers.
 * Read through src/lib/crm-data.ts so the database (step 4) can replace this file.
 * Demo moment: Tuesday 24 November 2026, 16:40. Numbers match the approved CRM canvas.
 */
import { brand } from "./brand";

export const DEMO_DATE = "2026-11-24";

export type MemberStatus = "active" | "expiring" | "frozen" | "expired" | "trial";

export type CrmMember = {
  id: string;
  name: string;
  phone: string;
  planId: "monthly" | "3m" | "6m" | "12m" | "pack10" | "student" | "trial";
  start: string; // ISO date
  end: string; // ISO date
  status: MemberStatus;
  lastVisit: string; // ISO date
  visits4w: number;
  owes: number;
  owesFor?: string;
  ptLeft: number | null;
  trainer: string | null;
  source: "Instagram" | "Walk-in" | "Referral" | "Website" | "Google";
  lang: "English" | "Arabic";
  since: string; // ISO date
};

export const PLAN_LABELS: Record<CrmMember["planId"], string> = {
  monthly: "Monthly",
  "3m": "3 months",
  "6m": "6 months",
  "12m": "12 months",
  pack10: "10-class pack",
  student: "Student monthly",
  trial: "Free trial",
};
const PLAN_DAYS: Record<CrmMember["planId"], number> = { monthly: 30, "3m": 91, "6m": 182, "12m": 365, pack10: 60, student: 30, trial: 7 };

export function addDays(iso: string, n: number) {
  const d = new Date(iso + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}
export function daysBetween(a: string, b: string) {
  return Math.round((new Date(b + "T12:00:00Z").getTime() - new Date(a + "T12:00:00Z").getTime()) / 86400000);
}

/* ---------- Members ---------- */

type Named = Partial<CrmMember> & Pick<CrmMember, "name" | "phone" | "planId" | "end" | "status">;
const named: Named[] = [
  { name: "Rana Haddad", phone: "+961 3 482 221", planId: "12m", end: "2027-03-13", status: "active", lastVisit: DEMO_DATE, visits4w: 11, ptLeft: 3, trainer: "rami", source: "Instagram", since: "2025-03-14" },
  { name: "Hadi Chamoun", phone: "+961 70 215 904", planId: "12m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-23", visits4w: 12, owes: 160, owesFor: "PT · 5 sessions", ptLeft: 5, trainer: "joe", source: "Referral", since: "2024-11-29" },
  { name: "Lynn Sfeir", phone: "+961 71 330 418", planId: "6m", end: "2027-02-28", status: "active", lastVisit: "2026-11-22", visits4w: 7, owes: 140, owesFor: "6-month plan, 2nd instalment", source: "Instagram", lang: "Arabic" },
  { name: "Omar Itani", phone: "+961 76 902 115", planId: "monthly", end: "2026-12-21", status: "active", lastVisit: "2026-11-20", visits4w: 6, owes: 55, owesFor: "Monthly", source: "Walk-in", lang: "Arabic" },
  { name: "Christelle Azar", phone: "+961 3 771 052", planId: "monthly", end: "2026-11-27", status: "expiring", lastVisit: "2026-11-21", visits4w: 8, source: "Website" },
  { name: "Sami Baroud", phone: "+961 81 604 337", planId: "3m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-19", visits4w: 5, source: "Google", lang: "Arabic" },
  { name: "Jana Chidiac", phone: "+961 3 118 964", planId: "12m", end: "2027-06-30", status: "active", lastVisit: "2026-11-23", visits4w: 13, ptLeft: 1, trainer: "nour", source: "Referral" },
  { name: "Marc Abboud", phone: "+961 70 845 201", planId: "monthly", end: "2026-12-01", status: "expiring", lastVisit: DEMO_DATE, visits4w: 9, ptLeft: 6, trainer: "rami", source: "Instagram" },
  { name: "Tala Moussa", phone: "+961 71 522 876", planId: "6m", end: "2027-01-31", status: "active", lastVisit: "2026-11-23", visits4w: 10, ptLeft: 6, trainer: "nour", source: "Website" },
  { name: "Georges Karam", phone: "+961 3 660 419", planId: "monthly", end: "2026-12-02", status: "active", lastVisit: DEMO_DATE, visits4w: 12, ptLeft: 8, trainer: "nour", source: "Walk-in", lang: "Arabic" },
  { name: "Yara Daou", phone: "+961 76 113 780", planId: "3m", end: "2027-01-15", status: "active", lastVisit: "2026-11-22", visits4w: 9, ptLeft: 7, trainer: "rami", source: "Instagram" },
  { name: "Elie Ghanem", phone: "+961 70 409 662", planId: "3m", end: "2027-02-22", status: "active", lastVisit: DEMO_DATE, visits4w: 1, source: "Website", since: DEMO_DATE },
  { name: "Jad Merhi", phone: "+961 81 237 590", planId: "12m", end: "2027-11-23", status: "active", lastVisit: DEMO_DATE, visits4w: 2, source: "Referral", since: "2026-11-17" },
  { name: "Mira Saab", phone: "+961 3 905 314", planId: "pack10", end: "2027-01-23", status: "active", lastVisit: DEMO_DATE, visits4w: 3, source: "Instagram" },
  { name: "Karl Hayek", phone: "+961 71 744 028", planId: "6m", end: "2027-05-23", status: "active", lastVisit: DEMO_DATE, visits4w: 1, source: "Google", since: DEMO_DATE },
  { name: "Lara Nehme", phone: "+961 76 538 147", planId: "monthly", end: "2026-12-22", status: "active", lastVisit: "2026-11-23", visits4w: 7, source: "Walk-in", lang: "Arabic" },
  { name: "Maria Tannous", phone: "+961 3 287 655", planId: "monthly", end: "2026-12-23", status: "active", lastVisit: DEMO_DATE, visits4w: 4, source: "Website", since: DEMO_DATE },
  { name: "Nadia Khalil", phone: "+961 70 650 913", planId: "12m", end: "2027-04-02", status: "frozen", lastVisit: "2026-10-29", visits4w: 0, source: "Referral", lang: "Arabic" },
];

/** Small seeded random generator so the sample members are the same on every load. */
function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const FIRST = ["Ali", "Rita", "Fadi", "Dana", "Paul", "Joelle", "Ziad", "Nadine", "Rawad", "Hiba", "Chris", "Sarah", "Kevin", "Layal", "Rami", "Nour", "Tarek", "Carla", "Wael", "Maya", "Bilal", "Rouba", "Anthony", "Lina", "Hassan", "Perla", "Mohamad", "Cynthia", "Youssef", "Grace", "Karim", "Reem", "Michel", "Dima", "Samer", "Nathalie", "Imad", "Sandra", "Walid", "Jessica", "Firas", "Aya", "Ralph", "Mona", "Bachir", "Ghina", "Toufic", "Rima", "Jean", "Farah", "Nabil", "Zeina", "Antoine", "Hala", "Khaled", "Joanna", "Mazen", "Nayla", "Raymond", "Sirine"];
const LAST = ["Kassem", "Bou Saab", "Nasr", "Mrad", "Aziz", "Harb", "Fares", "Sleiman", "Jaber", "Zein", "Daher", "Antoun", "Rahme", "Bitar", "Khoury", "Haddad", "Saliba", "Nassar", "Frem", "Aoun", "Hajj", "Gemayel", "Salameh", "Yazbek", "Assaf", "Karam", "Chahine", "Maalouf", "Tabet", "Rizk", "Hamdan", "Sabbagh", "Najjar", "Atallah", "Eid", "Makhoul", "Matar", "Feghali", "Abi Khalil", "Ghosn", "Sawaya", "Choueiri", "Mansour", "Akl", "Daou", "Itani", "Baz", "Sayegh", "Hobeika", "Lahoud"];
const PREFIXES = ["3", "70", "71", "76", "78", "79", "81"];
const SOURCES: CrmMember["source"][] = ["Instagram", "Instagram", "Instagram", "Walk-in", "Walk-in", "Referral", "Referral", "Website", "Google"];

function pickPlan(r: () => number): CrmMember["planId"] {
  const x = r();
  if (x < 0.35) return "monthly";
  if (x < 0.55) return "3m";
  if (x < 0.7) return "6m";
  if (x < 0.92) return "12m";
  if (x < 0.97) return "pack10";
  return "student";
}

function buildMembers(): CrmMember[] {
  const r = rng(2026);
  const list: CrmMember[] = named.map((n, i) => {
    const end = n.end;
    const start = addDays(end, -PLAN_DAYS[n.planId]);
    return {
      id: `m-${String(i + 1).padStart(3, "0")}`,
      start,
      lastVisit: DEMO_DATE,
      visits4w: 6,
      owes: 0,
      ptLeft: null,
      trainer: null,
      source: "Instagram",
      lang: "English",
      since: start,
      ...n,
    } as CrmMember;
  });

  const plan: [MemberStatus, number][] = [["active", 459], ["expiring", 10], ["frozen", 8], ["expired", 18], ["trial", 7]];
  const used = new Set(list.map((m) => m.name));
  for (const [status, count] of plan) {
    for (let k = 0; k < count; k++) {
      let name = "";
      do name = `${FIRST[Math.floor(r() * FIRST.length)]} ${LAST[Math.floor(r() * LAST.length)]}`;
      while (used.has(name) && used.size < FIRST.length * LAST.length);
      used.add(name);

      const planId: CrmMember["planId"] = status === "trial" ? "trial" : pickPlan(r);
      const days = PLAN_DAYS[planId];
      let daysLeft: number;
      if (status === "trial") daysLeft = 1 + Math.floor(r() * 6);
      else if (status === "expiring") daysLeft = Math.floor(r() * 8);
      else if (status === "expired") daysLeft = -1 - Math.floor(r() * 60);
      else daysLeft = 8 + Math.floor(r() * Math.max(days - 8, 1));
      const end = addDays(DEMO_DATE, daysLeft);
      const start = addDays(end, -days);

      let lastAgo: number;
      if (status === "expired") lastAgo = Math.max(-daysLeft, 0) + 2 + Math.floor(r() * 20);
      else if (status === "frozen") lastAgo = 15 + Math.floor(r() * 45);
      else if (status === "trial") lastAgo = Math.floor(r() * 4);
      else lastAgo = r() < 0.85 ? Math.floor(r() * 7) : 7 + Math.floor(r() * 25);
      lastAgo = Math.min(lastAgo, daysBetween(start, DEMO_DATE));
      const visits4w = lastAgo > 28 ? 0 : Math.max(1, Math.round((1 - lastAgo / 30) * (2 + r() * 12)));

      const hasPt = (status === "active" || status === "expiring") && r() < 0.12;
      const sinceYears = r() < 0.4 ? Math.floor(r() * 3) : 0;
      list.push({
        id: `m-${String(list.length + 1).padStart(3, "0")}`,
        name,
        phone: `+961 ${PREFIXES[Math.floor(r() * PREFIXES.length)]} ${100 + Math.floor(r() * 900)} ${100 + Math.floor(r() * 900)}`,
        planId, start, end, status,
        lastVisit: addDays(DEMO_DATE, -lastAgo),
        visits4w: status === "frozen" ? 0 : visits4w,
        owes: 0,
        ptLeft: hasPt ? 1 + Math.floor(r() * 9) : null,
        trainer: hasPt ? ["rami", "nour", "joe"][Math.floor(r() * 3)] : null,
        source: status === "trial" ? "Website" : SOURCES[Math.floor(r() * SOURCES.length)],
        lang: r() < 0.3 ? "Arabic" : "English",
        since: addDays(start, -365 * sinceYears),
      });
    }
  }
  return list;
}

export const members: CrmMember[] = buildMembers();

/** Extra detail for the member shown on the design canvas. Others get generated detail. */
export const memberExtras: Record<string, {
  weeks: number[];
  favourites: [string, number][];
  noShows: number;
  upcoming: { when: string; what: string; status: string; tone: "booked" | "waitlist" }[];
  scans: { date: string; weight: string; fat: string; muscle: string; by: string }[];
  scanChange: [string, string, string];
  payments: { date: string; item: string; method: string; amount: number }[];
  whatsapp: { text: string; when: string; scheduled?: boolean }[];
  birthday: string;
  emergency: string;
  waiver: string;
  health: string;
  note: { text: string; by: string };
}> = {
  "m-001": {
    weeks: [2, 3, 3, 2, 4, 3, 3, 2, 3, 4, 3, 2],
    favourites: [["Spin", 14], ["Strength", 9], ["Yoga", 4]],
    noShows: 1,
    upcoming: [
      { when: "Today · 20:15", what: "Spin with Karim · Studio 2", status: "Booked", tone: "booked" },
      { when: "Thu 26 · 18:30", what: "Strength with Joe · Gym floor", status: "Waitlist #2", tone: "waitlist" },
      { when: "Fri 27 · 07:00", what: "PT with Rami", status: "Booked", tone: "booked" },
    ],
    scans: [
      { date: "14 Mar 2026", weight: "64.2 kg", fat: "27.4%", muscle: "25.1 kg", by: "Rami Aoun" },
      { date: "15 Jun 2026", weight: "63.0 kg", fat: "25.9%", muscle: "25.6 kg", by: "Rami Aoun" },
      { date: "12 Sep 2026", weight: "62.1 kg", fat: "24.8%", muscle: "25.9 kg", by: "Nour Fakhoury" },
      { date: "10 Nov 2026", weight: "61.8 kg", fat: "24.1%", muscle: "26.2 kg", by: "Rami Aoun" },
    ],
    scanChange: ["−2.4 kg", "−3.3 pts", "+1.1 kg"],
    payments: [
      { date: "21 Aug 2026", item: "PT · 10 sessions with Rami", method: "Whish · Tony Abi Nader", amount: 300 },
      { date: "14 Mar 2026", item: "12-month membership (renewal)", method: "Card · Sara Mansour", amount: 500 },
      { date: "14 Mar 2025", item: "12-month membership", method: "Cash USD · Sara Mansour", amount: 480 },
    ],
    whatsapp: [
      { text: "Booked into 20:15 Spin by the assistant. Confirmation sent.", when: "Today 16:52" },
      { text: "Class reminder for 20:15 Spin", when: "Scheduled for today 18:15", scheduled: true },
      { text: "PT reminder: tomorrow 07:00 with Rami", when: "Mon 23 Nov 18:00" },
      { text: "Body scan results with change since March", when: "10 Nov 19:20" },
    ],
    birthday: "2 February",
    emergency: "Fadi Haddad (brother)",
    waiver: "Signed 14 Mar 2025",
    health: "Lower back, no heavy deadlifts. Cleared by her physio in May 2026.",
    note: { text: "Training for a 10K in spring. Prefers evening classes after work.", by: "Rami Aoun · 10 Nov" },
  },
};

/* ---------- Leads ---------- */

export type LeadStage = "new" | "contacted" | "trial_booked" | "trial_done" | "joined" | "lost";
export type Lead = { id: string; name: string; stage: LeadStage; source: string; interest: string; when: string; note: string; by?: string };
export const leads: Lead[] = [
  { id: "l1", name: "Ali Kassem", stage: "new", source: "Website", interest: "HIIT", when: "3 h ago", note: "Asked for an evening class" },
  { id: "l2", name: "Rita Bou Saab", stage: "new", source: "Website", interest: "Yoga", when: "5 h ago", note: "First time at a gym" },
  { id: "l3", name: "Fadi Nasr", stage: "contacted", source: "Instagram", interest: "Strength", when: "Yesterday", note: "Will reply after checking his schedule", by: "Sara" },
  { id: "l4", name: "Dana Mrad", stage: "contacted", source: "Walk-in", interest: "Pilates", when: "Yesterday", note: "Wants a student price", by: "Tony" },
  { id: "l5", name: "Paul Aziz", stage: "contacted", source: "Referral", interest: "Personal training", when: "Sun", note: "Referred by Jana Chidiac", by: "Sara" },
  { id: "l6", name: "Joelle Harb", stage: "trial_booked", source: "Website", interest: "Strength", when: "Thu 18:30", note: "Strength with Joe", by: "Sara" },
  { id: "l7", name: "Ziad Fares", stage: "trial_booked", source: "Instagram", interest: "Spin", when: "Wed 12:30", note: "Spin with Karim", by: "Tony" },
  { id: "l8", name: "Nadine Sleiman", stage: "trial_booked", source: "Google", interest: "Yoga", when: "Tue 20:30", note: "Yoga with Maya, tonight", by: "Sara" },
  { id: "l9", name: "Rawad Jaber", stage: "trial_booked", source: "Website", interest: "Boxing", when: "Fri 18:30", note: "Boxing with Lea", by: "Tony" },
  { id: "l10", name: "Hiba Zein", stage: "trial_done", source: "Website", interest: "Spin", when: "Yesterday", note: "No follow-up yet", by: "Sara" },
  { id: "l11", name: "Chris Daher", stage: "trial_done", source: "Instagram", interest: "HIIT", when: "Yesterday", note: "Liked it, thinking about 3 months", by: "Tony" },
  { id: "l12", name: "Elie Ghanem", stage: "joined", source: "Website", interest: "Strength", when: "Today", note: "3 months", by: "Sara" },
  { id: "l13", name: "Karl Hayek", stage: "joined", source: "Google", interest: "Spin", when: "Today", note: "6 months", by: "Sara" },
  { id: "l14", name: "Maria Tannous", stage: "joined", source: "Website", interest: "Pilates", when: "Today", note: "Monthly", by: "Tony" },
  { id: "l15", name: "Jad Merhi", stage: "joined", source: "Referral", interest: "Strength", when: "Mon", note: "12 months", by: "Sara" },
  { id: "l16", name: "Kevin Rahme", stage: "lost", source: "Instagram", interest: "HIIT", when: "Sat", note: "Lives too far", by: "Tony" },
  { id: "l17", name: "Layal Bitar", stage: "lost", source: "Walk-in", interest: "Yoga", when: "Fri", note: "Price, may come back in January", by: "Sara" },
];

/* ---------- Money (November, month to date) ---------- */

export const money = {
  in: 18420,
  out: 11960,
  months: [
    { label: "Jun", in: 15.2, out: 11.4 },
    { label: "Jul", in: 13.8, out: 11.2 },
    { label: "Aug", in: 12.9, out: 11.1 },
    { label: "Sep", in: 16.7, out: 11.6 },
    { label: "Oct", in: 19.3, out: 11.9 },
    { label: "Nov", in: 18.4, out: 12.0 },
  ],
  sources: [
    { label: "Memberships", amount: 12525 },
    { label: "Personal training", amount: 3870 },
    { label: "Class packs and day passes", amount: 1105 },
    { label: "Extras (drinks, guest passes)", amount: 920 },
  ],
  dueSoon: [
    { name: "Christelle Azar", item: "Monthly · due Fri 27 Nov", amount: 55 },
    { name: "Sami Baroud", item: "3 months · due Sat 28 Nov", amount: 150 },
    { name: "Jana Chidiac", item: "PT · 10 sessions · due 30 Nov", amount: 300 },
    { name: "Marc Abboud", item: "Monthly · due 1 Dec", amount: 55 },
    { name: "Tala Moussa", item: "6-month plan, 2nd instalment · due 1 Dec", amount: 140 },
    { name: "Georges Karam", item: "Monthly · due 2 Dec", amount: 55 },
  ],
  overdueDays: { "Hadi Chamoun": 9, "Lynn Sfeir": 4, "Omar Itani": 2 } as Record<string, number>,
  expenses: [
    { label: "Salaries", amount: 5200 },
    { label: "Rent", amount: 4500 },
    { label: "Generator and fuel", amount: 980 },
    { label: "Electricity", amount: 420 },
    { label: "Equipment repairs", amount: 310 },
    { label: "Cleaning", amount: 300 },
    { label: "Marketing", amount: 250 },
  ],
  latest: [
    { when: "Today 16:31", member: "Yara Daou", item: "PT · 5 sessions", method: "Whish", by: "Sara Mansour", amount: 160 },
    { when: "Today 15:02", member: "Walk-in", item: "Day pass", method: "Cash USD", by: "Tony Abi Nader", amount: 10 },
    { when: "Today 13:45", member: "Elie Ghanem", item: "3 months", method: "Card", by: "Sara Mansour", amount: 150 },
    { when: "Today 12:10", member: "Jad Merhi", item: "12 months", method: "Bank transfer", by: "Sara Mansour", amount: 500 },
    { when: "Today 10:40", member: "Mira Saab", item: "10-class pack", method: "OMT", by: "Tony Abi Nader", amount: 80 },
    { when: "Today 09:15", member: "Karl Hayek", item: "6 months", method: "Card", by: "Sara Mansour", amount: 280 },
    { when: "Today 08:30", member: "Maria Tannous", item: "Monthly", method: "Cash USD", by: "Tony Abi Nader", amount: 55 },
    { when: "Mon 19:05", member: "Lara Nehme", item: "Monthly", method: "Cash LBP · 4,922,500 at 89,500", by: "Tony Abi Nader", amount: 55 },
  ],
  collectedToday: 1240,
  yesterdayRate: 89500,
};

/* ---------- Team ---------- */

export type Staff = { slug: string; name: string; role: string; pay: string; phone: string; since: string };
export const staff: Staff[] = [
  { slug: "sara", name: "Sara Mansour", role: "Front desk", pay: "$600 a month", phone: "+961 3 455 120", since: "Feb 2024" },
  { slug: "tony", name: "Tony Abi Nader", role: "Front desk", pay: "$600 a month", phone: "+961 70 388 412", since: "Sep 2025" },
  { slug: "karim", name: "Karim Saliba", role: "Coach · Spin and HIIT", pay: "$200 + $10 a class", phone: "+961 71 902 337", since: "Mar 2024" },
  { slug: "maya", name: "Maya Khoury", role: "Coach · Yoga and Pilates", pay: "$200 + $8 a class", phone: "+961 3 610 884", since: "Mar 2024" },
  { slug: "joe", name: "Joe Nassar", role: "Coach and trainer · Strength", pay: "$300 + $8 a class + 15% PT", phone: "+961 76 271 905", since: "Jun 2024" },
  { slug: "lea", name: "Lea Frem", role: "Coach · HIIT and Boxing", pay: "$200 + $8 a class", phone: "+961 81 534 260", since: "Jan 2025" },
  { slug: "rami", name: "Rami Aoun", role: "Personal trainer · Strength", pay: "$200 + 15% PT", phone: "+961 70 147 693", since: "Mar 2024" },
  { slug: "nour", name: "Nour Fakhoury", role: "Personal trainer · Mobility", pay: "$200 + 15% PT", phone: "+961 3 829 016", since: "Apr 2025" },
  { slug: "celine", name: "Celine Matar", role: "Sales and social media", pay: "$500 a month", phone: "+961 71 466 238", since: "Jul 2025" },
  { slug: "bassam", name: "Bassam Hamdan", role: "Cleaning and maintenance", pay: "$400 a month", phone: "+961 76 990 514", since: "Feb 2024" },
];

export const coachStats = [
  { slug: "karim", classes: 38, fill: 91, noshow: 6, kept: 94, pt: 0, sold: 0, rating: 4.9 },
  { slug: "joe", classes: 30, fill: 84, noshow: 7, kept: 88, pt: 22, sold: 3, rating: 4.7 },
  { slug: "maya", classes: 34, fill: 78, noshow: 8, kept: 90, pt: 12, sold: 1, rating: 4.8 },
  { slug: "lea", classes: 26, fill: 72, noshow: 11, kept: 81, pt: 8, sold: 1, rating: 4.6 },
  { slug: "rami", classes: 10, fill: 65, noshow: 9, kept: 86, pt: 64, sold: 5, rating: 4.9 },
  { slug: "nour", classes: 12, fill: 58, noshow: 12, kept: 79, pt: 41, sold: 2, rating: 4.5 },
];

export const deskStats = [
  { name: "Sara Mansour", converted: 9, trials: 14, collected: 7820, renewals: 31 },
  { name: "Tony Abi Nader", converted: 5, trials: 11, collected: 4150, renewals: 18 },
];

export const onShift = [
  { name: "Sara Mansour", role: "Front desk", hours: "14:00 – 22:00", now: true },
  { name: "Joe Nassar", role: "Gym floor", hours: "12:00 – 20:00", now: true },
  { name: "Nour Fakhoury", role: "Coach", hours: "15:00 – 21:00", now: true },
  { name: "Lea Frem", role: "Coach, arrives later", hours: "17:00 – 19:00", now: false },
  { name: "Karim Saliba", role: "Coach, arrives later", hours: "18:30 – 21:30", now: false },
];

export const payroll = { base: 3400, classPay: 1140, classes: 150, ptCommission: 660, ptSessions: 147 };

/* ---------- Personal training today ---------- */

export const ptToday = [
  { time: "07:00", member: "Rana Haddad", memberId: "m-001", trainer: "rami", note: "Done", done: true },
  { time: "08:00", member: "Georges Karam", memberId: "m-010", trainer: "nour", note: "Done", done: true },
  { time: "13:00", member: "Marc Abboud", memberId: "m-008", trainer: "rami", note: "Done", done: true },
  { time: "17:00", member: "Yara Daou", memberId: "m-011", trainer: "rami", note: "New package today", done: false },
  { time: "18:00", member: "Elie Ghanem", memberId: "m-012", trainer: "joe", note: "Free consultation", done: false },
  { time: "19:30", member: "Tala Moussa", memberId: "m-009", trainer: "nour", note: "6 sessions left", done: false },
];

/* ---------- WhatsApp automations ---------- */

export type Automation = { key: string; name: string; when: string; on: boolean; sentWeek: number; en: string; ar: string };
export const automations: Automation[] = [
  { key: "booking", name: "Booking confirmed", when: "Right after booking", on: true, sentWeek: 312,
    en: "Hi {name}, you're booked: {class} with {coach}, {day} at {time}, {room}. Can't make it? Cancel here: {link}",
    ar: "مرحباً {name}، تم الحجز: {class} مع {coach}، {day} الساعة {time}، {room}. للإلغاء: {link}" },
  { key: "class_reminder", name: "Class reminder", when: "2 hours before", on: true, sentWeek: 298,
    en: "{class} with {coach} starts at {time} in {room}. Bring water and a towel. See you there.",
    ar: "تبدأ حصة {class} مع {coach} الساعة {time} في {room}. أحضروا الماء ومنشفة. نراكم هناك." },
  { key: "pt_reminder", name: "PT session reminder", when: "24 hours and 2 hours before", on: true, sentWeek: 74,
    en: "Reminder: personal training with {trainer} {day} at {time}. Reply here if you need to move it.",
    ar: "تذكير: تدريب شخصي مع {trainer} {day} الساعة {time}. ردّوا هنا إذا أردتم تغيير الموعد." },
  { key: "waitlist", name: "Spot opened from waitlist", when: "As soon as a spot frees up", on: true, sentWeek: 19,
    en: "Good news, {name}: a spot opened in {class} {day} at {time}. You're booked in. Can't come? Cancel here: {link}",
    ar: "خبر جيد يا {name}: فرغ مكان في حصة {class} {day} الساعة {time} وتم حجزه لكم. للإلغاء: {link}" },
  { key: "changed", name: "Class cancelled or moved", when: "As soon as staff change it", on: true, sentWeek: 0,
    en: "Sorry {name}, {class} {day} at {time} is cancelled. Pick another class here: {link}",
    ar: "عذراً {name}، أُلغيت حصة {class} {day} الساعة {time}. اختاروا حصة أخرى من هنا: {link}" },
  { key: "payment_due", name: "Payment due", when: "3 days before", on: true, sentWeek: 23,
    en: "Hi {name}, your {plan} payment of {amount} is due on {date}. Pay at the desk, by card, Whish or OMT.",
    ar: "مرحباً {name}، دفعة اشتراك {plan} بقيمة {amount} مستحقة في {date}. الدفع في الاستقبال أو بالبطاقة أو عبر Whish أو OMT." },
  { key: "payment_overdue", name: "Payment overdue", when: "Day 1 and day 7 after", on: true, sentWeek: 5,
    en: "Hi {name}, a friendly reminder that {amount} for {plan} is still open. Reply here if you'd like to arrange it.",
    ar: "مرحباً {name}، تذكير لطيف بأن مبلغ {amount} لاشتراك {plan} ما زال مستحقاً. ردّوا هنا لترتيب الدفع." },
  { key: "expiring", name: "Membership expiring", when: "7 days and 1 day before", on: true, sentWeek: 21,
    en: "Hi {name}, your membership ends on {date}. Renew now and keep your spot in your favourite classes. Reply RENEW.",
    ar: "مرحباً {name}، ينتهي اشتراككم في {date}. جدّدوا الآن واحتفظوا بأماكنكم في حصصكم المفضّلة. ردّوا بكلمة «تجديد»." },
  { key: "expired", name: "Expired: renewal offer", when: "Day after expiry", on: true, sentWeek: 4,
    en: "We miss you already, {name}. Renew this week and get 5 extra days on us.",
    ar: "اشتقنا لكم يا {name}. جدّدوا هذا الأسبوع واحصلوا على 5 أيام إضافية هدية منا." },
  { key: "trial", name: "Trial follow-up", when: "Evening of the trial", on: true, sentWeek: 11,
    en: "Thanks for training with us today, {name}! How was it? Join this week and your first month is $45 instead of $55.",
    ar: "شكراً لتدرّبكم معنا اليوم يا {name}! كيف كانت التجربة؟ اشتركوا هذا الأسبوع ويصبح الشهر الأول 45$ بدل 55$." },
  { key: "noshow", name: "Missed class", when: "Same day", on: true, sentWeek: 16,
    en: "We missed you at {class} today, {name}. Everything OK? Book your next class here: {link}",
    ar: "افتقدناكم في حصة {class} اليوم يا {name}. هل كل شيء بخير؟ احجزوا حصتكم التالية من هنا: {link}" },
  { key: "miss_you", name: "We miss you", when: "No visit for 14 days", on: true, sentWeek: 27,
    en: "Hi {name}, it's been two weeks! Your spot is waiting. Here's this week's timetable: {link}",
    ar: "مرحباً {name}، مرّ أسبوعان! مكانكم بانتظاركم. هذا جدول الأسبوع: {link}" },
  { key: "pt_low", name: "PT package running low", when: "2 sessions left", on: true, sentWeek: 3,
    en: "You have 2 sessions left with {trainer}. Renew 10 sessions for $300? Reply YES.",
    ar: "بقيت لكم جلستان مع {trainer}. هل تريدون تجديد 10 جلسات بـ 300$؟ ردّوا بـ «نعم»." },
  { key: "welcome", name: "Welcome", when: "When they join", on: true, sentWeek: 6,
    en: "Welcome to {gym}, {name}! Book classes here: {link}. Open daily from 6:00. Questions? Just reply.",
    ar: "أهلاً بكم في {gym} يا {name}! احجزوا الحصص من هنا: {link}. مفتوح يومياً من الساعة 6:00. أي سؤال؟ ردّوا هنا." },
  { key: "birthday", name: "Birthday", when: "On the day", on: false, sentWeek: 0,
    en: "Happy birthday, {name}! Bring a friend for a free class this week, on us.",
    ar: "عيد ميلاد سعيد يا {name}! أحضروا صديقاً لحصة مجانية هذا الأسبوع، هدية منا." },
];

export const previewValues = {
  en: { name: "Rana", class: "Spin", coach: "Karim", day: "today", time: "20:15", room: "Studio 2", link: `${brand.shortLink}/m/7KQ2`, gym: brand.short, trainer: "Rami", plan: "Monthly", amount: "$55", date: "Sat 28 Nov" },
  ar: { name: "رنا", class: "سبين", coach: "كريم", day: "اليوم", time: "20:15", room: "استوديو 2", link: `${brand.shortLink}/m/7KQ2`, gym: brand.shortAr, trainer: "رامي", plan: "الشهري", amount: "55$", date: "السبت 28 تشرين الثاني" },
};

export const recentMessages = [
  { when: "16:52", to: "Rana Haddad", what: "Booking confirmed · 20:15 Spin", status: "Delivered" },
  { when: "16:45", to: "Hadi Chamoun", what: "Payment overdue · $160", status: "Read" },
  { when: "16:45", to: "Lynn Sfeir", what: "Payment overdue · $140", status: "Delivered" },
  { when: "16:45", to: "Omar Itani", what: "Payment overdue · $55", status: "Read" },
  { when: "16:31", to: "Yara Daou", what: "Payment receipt · $160", status: "Read" },
  { when: "15:30", to: "17:30 HIIT (10 members)", what: "Class reminder", status: "Delivered" },
  { when: "14:10", to: "Sami Baroud", what: "Membership expiring · Sat 28 Nov", status: "Read" },
  { when: "18:15", to: "20:15 Spin (16 members)", what: "Class reminder", status: "Scheduled" },
];
