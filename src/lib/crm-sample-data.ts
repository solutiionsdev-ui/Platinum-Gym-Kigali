/**
 * SAMPLE DATA ONLY for the CRM (owner and staff side). Made-up people and numbers, Platinum Gym, Kigali.
 * Read through src/lib/crm-data.ts so the database (step 4) can replace this file.
 * Demo moment: Tuesday 24 November 2026, 16:40. Money in Rwandan francs (RWF).
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
  owes: number; // RWF
  owesFor?: string;
  ptLeft: number | null;
  trainer: string | null;
  source: "Instagram" | "Walk-in" | "Referral" | "Website" | "Google";
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
  { name: "Sandrine Uwimana", phone: "+250 788 482 221", planId: "12m", end: "2027-03-13", status: "active", lastVisit: DEMO_DATE, visits4w: 11, ptLeft: 3, trainer: "patrick", source: "Instagram", since: "2025-03-14" },
  { name: "Olivier Gasana", phone: "+250 783 215 904", planId: "12m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-23", visits4w: 12, owes: 115000, owesFor: "PT · 5 sessions", ptLeft: 5, trainer: "jean-paul", source: "Referral", since: "2024-11-29" },
  { name: "Josiane Kayitesi", phone: "+250 785 330 418", planId: "6m", end: "2027-02-28", status: "active", lastVisit: "2026-11-22", visits4w: 7, owes: 150000, owesFor: "6-month plan, 2nd instalment", source: "Instagram" },
  { name: "Fabrice Murenzi", phone: "+250 787 902 115", planId: "monthly", end: "2026-12-21", status: "active", lastVisit: "2026-11-20", visits4w: 6, owes: 60000, owesFor: "Monthly", source: "Walk-in" },
  { name: "Divine Ishimwe", phone: "+250 788 771 052", planId: "monthly", end: "2026-11-27", status: "expiring", lastVisit: "2026-11-21", visits4w: 8, source: "Website" },
  { name: "Yves Kamanzi", phone: "+250 722 604 337", planId: "3m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-19", visits4w: 5, source: "Google" },
  { name: "Ariane Iradukunda", phone: "+250 788 118 964", planId: "12m", end: "2027-06-30", status: "active", lastVisit: "2026-11-23", visits4w: 13, ptLeft: 1, trainer: "diane", source: "Referral" },
  { name: "Thierry Rukundo", phone: "+250 783 845 201", planId: "monthly", end: "2026-12-01", status: "expiring", lastVisit: DEMO_DATE, visits4w: 9, ptLeft: 6, trainer: "patrick", source: "Instagram" },
  { name: "Gloria Uwera", phone: "+250 785 522 876", planId: "6m", end: "2027-01-31", status: "active", lastVisit: "2026-11-23", visits4w: 10, ptLeft: 6, trainer: "diane", source: "Website" },
  { name: "Didier Bizimana", phone: "+250 788 660 419", planId: "monthly", end: "2026-12-02", status: "active", lastVisit: DEMO_DATE, visits4w: 12, ptLeft: 8, trainer: "diane", source: "Walk-in" },
  { name: "Esther Mukeshimana", phone: "+250 787 113 780", planId: "3m", end: "2027-01-15", status: "active", lastVisit: "2026-11-22", visits4w: 9, ptLeft: 7, trainer: "patrick", source: "Instagram" },
  { name: "Samuel Ntwari", phone: "+250 783 409 662", planId: "3m", end: "2027-02-22", status: "active", lastVisit: DEMO_DATE, visits4w: 1, source: "Website", since: DEMO_DATE },
  { name: "David Karangwa", phone: "+250 722 237 590", planId: "12m", end: "2027-11-23", status: "active", lastVisit: DEMO_DATE, visits4w: 2, source: "Referral", since: "2026-11-17" },
  { name: "Bella Umuhoza", phone: "+250 788 905 314", planId: "pack10", end: "2027-01-23", status: "active", lastVisit: DEMO_DATE, visits4w: 3, source: "Instagram" },
  { name: "Lionel Manzi", phone: "+250 785 744 028", planId: "6m", end: "2027-05-23", status: "active", lastVisit: DEMO_DATE, visits4w: 1, source: "Google", since: DEMO_DATE },
  { name: "Liliane Tuyishime", phone: "+250 787 538 147", planId: "monthly", end: "2026-12-22", status: "active", lastVisit: "2026-11-23", visits4w: 7, source: "Walk-in" },
  { name: "Vanessa Irakoze", phone: "+250 788 287 655", planId: "monthly", end: "2026-12-23", status: "active", lastVisit: DEMO_DATE, visits4w: 4, source: "Website", since: DEMO_DATE },
  { name: "Chantal Uwamahoro", phone: "+250 783 650 913", planId: "12m", end: "2027-04-02", status: "frozen", lastVisit: "2026-10-29", visits4w: 0, source: "Referral" },
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

// First names avoid the coaches' and staff's, so the assistant's "which member?" demo stays clear.
const FIRST = ["Kevin", "Olivier", "Josiane", "Fabrice", "Divine", "Yves", "Ariane", "Thierry", "Gloria", "Didier", "Esther", "Samuel", "David", "Bella", "Lionel", "Liliane", "Vanessa", "Chantal", "Claude", "Ange", "Moses", "Innocent", "Nadine", "Denise", "Fiston", "Gisele", "Herve", "Irene", "Joel", "Keza", "Mireille", "Nathan", "Pacifique", "Regis", "Sonia", "Tresor", "Yvette", "Brian", "Ella", "Cedric", "Arnaud", "Benjamin", "Christine", "Daniel", "Florence", "Henry", "Ivan", "Jessica", "Laura", "Michael", "Nicole", "Peter", "Rachel", "Sarah", "Teddy", "Victor", "Alice", "James", "Sophie", "Joseph"];
const LAST = ["Mugisha", "Uwase", "Niyonzima", "Ingabire", "Habimana", "Uwimana", "Nshuti", "Umutoni", "Nkurunziza", "Mutoni", "Iradukunda", "Hakizimana", "Uwera", "Gasana", "Kamanzi", "Rwigema", "Bizimana", "Ndayisaba", "Tuyishime", "Murenzi", "Kayitesi", "Munyaneza", "Ishimwe", "Irakoze", "Mugabo", "Nsengiyumva", "Uwamahoro", "Byiringiro", "Karangwa", "Ntwari", "Mukeshimana", "Twagirayezu", "Rukundo", "Manzi", "Gatete", "Shema", "Kalisa", "Rutagengwa", "Umuhoza", "Nkusi", "Kimani", "Otieno", "Okafor", "Mensah", "Dubois", "Smith", "Nyiraneza", "Sibomana", "Ruzindana", "Kabera"];
const PREFIXES = ["788", "783", "785", "787", "789", "722", "723", "728", "733", "738"];
const SOURCES: CrmMember["source"][] = ["Instagram", "Instagram", "Instagram", "Walk-in", "Walk-in", "Referral", "Referral", "Website", "Google"];
const TRAINERS = ["patrick", "diane", "jean-paul"];

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
    const start = addDays(n.end, -PLAN_DAYS[n.planId]);
    return {
      id: `m-${String(i + 1).padStart(3, "0")}`,
      start,
      lastVisit: DEMO_DATE,
      visits4w: 6,
      owes: 0,
      ptLeft: null,
      trainer: null,
      source: "Instagram",
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
        phone: `+250 ${PREFIXES[Math.floor(r() * PREFIXES.length)]} ${100 + Math.floor(r() * 900)} ${100 + Math.floor(r() * 900)}`,
        planId, start, end, status,
        lastVisit: addDays(DEMO_DATE, -lastAgo),
        visits4w: status === "frozen" ? 0 : visits4w,
        owes: 0,
        ptLeft: hasPt ? 1 + Math.floor(r() * 9) : null,
        trainer: hasPt ? TRAINERS[Math.floor(r() * 3)] : null,
        source: status === "trial" ? "Website" : SOURCES[Math.floor(r() * SOURCES.length)],
        since: addDays(start, -365 * sinceYears),
      });
    }
  }
  return list;
}

export const members: CrmMember[] = buildMembers();

/** Extra detail for the featured member (Sandrine). Others get generated detail. */
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
      { when: "Today · 20:15", what: "Spin with Eric · Studio 2", status: "Booked", tone: "booked" },
      { when: "Thu 26 · 18:30", what: "Strength with Jean-Paul · Gym floor", status: "Waitlist #2", tone: "waitlist" },
      { when: "Fri 27 · 07:00", what: "PT with Patrick", status: "Booked", tone: "booked" },
    ],
    scans: [
      { date: "14 Mar 2026", weight: "64.2 kg", fat: "27.4%", muscle: "25.1 kg", by: "Patrick Habimana" },
      { date: "15 Jun 2026", weight: "63.0 kg", fat: "25.9%", muscle: "25.6 kg", by: "Patrick Habimana" },
      { date: "12 Sep 2026", weight: "62.1 kg", fat: "24.8%", muscle: "25.9 kg", by: "Diane Mukamana" },
      { date: "10 Nov 2026", weight: "61.8 kg", fat: "24.1%", muscle: "26.2 kg", by: "Patrick Habimana" },
    ],
    scanChange: ["−2.4 kg", "−3.3 pts", "+1.1 kg"],
    payments: [
      { date: "21 Aug 2026", item: "PT · 10 sessions with Patrick", method: "MTN MoMo · Arsène Nkusi", amount: 210000 },
      { date: "14 Mar 2026", item: "12-month membership (renewal)", method: "Card · Clarisse Umutoni", amount: 540000 },
      { date: "14 Mar 2025", item: "12-month membership", method: "Cash · Clarisse Umutoni", amount: 500000 },
    ],
    whatsapp: [
      { text: "Booked into 20:15 Spin by the assistant. Confirmation sent.", when: "Today 16:52" },
      { text: "Class reminder for 20:15 Spin", when: "Scheduled for today 18:15", scheduled: true },
      { text: "PT reminder: tomorrow 07:00 with Patrick", when: "Mon 23 Nov 18:00" },
      { text: "Body scan results with change since March", when: "10 Nov 19:20" },
    ],
    birthday: "2 February",
    emergency: "Jean Uwimana (brother)",
    waiver: "Signed 14 Mar 2025",
    health: "Lower back, no heavy deadlifts. Cleared by a physio in May 2026.",
    note: { text: "Training for the Kigali Peace Marathon 10K in June. Prefers evening classes after work.", by: "Patrick Habimana · 10 Nov" },
  },
};

/* ---------- Leads ---------- */

export type LeadStage = "new" | "contacted" | "trial_booked" | "trial_done" | "joined" | "lost";
export type Lead = { id: string; name: string; stage: LeadStage; source: string; interest: string; when: string; note: string; by?: string };
export const leads: Lead[] = [
  { id: "l1", name: "Brian Mugabo", stage: "new", source: "Website", interest: "HIIT", when: "3 h ago", note: "Asked for an evening class" },
  { id: "l2", name: "Gisele Kalisa", stage: "new", source: "Website", interest: "Yoga", when: "5 h ago", note: "First time at a gym" },
  { id: "l3", name: "Fiston Nkusi", stage: "contacted", source: "Instagram", interest: "Strength", when: "Yesterday", note: "Will reply after checking the schedule", by: "Clarisse" },
  { id: "l4", name: "Denise Shema", stage: "contacted", source: "Walk-in", interest: "Pilates", when: "Yesterday", note: "Wants a student price", by: "Arsène" },
  { id: "l5", name: "Peter Otieno", stage: "contacted", source: "Referral", interest: "Personal training", when: "Sun", note: "Referred by Ariane Iradukunda", by: "Clarisse" },
  { id: "l6", name: "Nadine Rutagengwa", stage: "trial_booked", source: "Website", interest: "Strength", when: "Thu 18:30", note: "Strength with Jean-Paul", by: "Clarisse" },
  { id: "l7", name: "Cedric Gatete", stage: "trial_booked", source: "Instagram", interest: "Spin", when: "Wed 12:30", note: "Spin with Eric", by: "Arsène" },
  { id: "l8", name: "Sonia Byiringiro", stage: "trial_booked", source: "Google", interest: "Yoga", when: "Tue 20:30", note: "Yoga with Aline, tonight", by: "Clarisse" },
  { id: "l9", name: "Joel Sibomana", stage: "trial_booked", source: "Website", interest: "Boxing", when: "Fri 18:30", note: "Boxing with Grace", by: "Arsène" },
  { id: "l10", name: "Irene Nyiraneza", stage: "trial_done", source: "Website", interest: "Spin", when: "Yesterday", note: "No follow-up yet", by: "Clarisse" },
  { id: "l11", name: "Arnaud Dubois", stage: "trial_done", source: "Instagram", interest: "HIIT", when: "Yesterday", note: "Liked it, thinking about 3 months", by: "Arsène" },
  { id: "l12", name: "Samuel Ntwari", stage: "joined", source: "Website", interest: "Strength", when: "Today", note: "3 months", by: "Clarisse" },
  { id: "l13", name: "Lionel Manzi", stage: "joined", source: "Google", interest: "Spin", when: "Today", note: "6 months", by: "Clarisse" },
  { id: "l14", name: "Vanessa Irakoze", stage: "joined", source: "Website", interest: "Pilates", when: "Today", note: "Monthly", by: "Arsène" },
  { id: "l15", name: "David Karangwa", stage: "joined", source: "Referral", interest: "Strength", when: "Mon", note: "12 months", by: "Clarisse" },
  { id: "l16", name: "Teddy Kimani", stage: "lost", source: "Instagram", interest: "HIIT", when: "Sat", note: "Lives too far", by: "Arsène" },
  { id: "l17", name: "Rachel Mensah", stage: "lost", source: "Walk-in", interest: "Yoga", when: "Fri", note: "Price, may come back in January", by: "Clarisse" },
];

/* ---------- Money (November, month to date, RWF) ---------- */

export const money = {
  in: 20050000,
  out: 13100000,
  /** Last 6 months, in millions of RWF. */
  months: [
    { label: "Jun", in: 16.8, out: 12.6 },
    { label: "Jul", in: 15.2, out: 12.4 },
    { label: "Aug", in: 14.1, out: 12.2 },
    { label: "Sep", in: 18.3, out: 12.8 },
    { label: "Oct", in: 21.2, out: 13.0 },
    { label: "Nov", in: 20.1, out: 13.1 },
  ],
  sources: [
    { label: "Memberships", amount: 13650000 },
    { label: "Personal training", amount: 4210000 },
    { label: "Class packs and day passes", amount: 1200000 },
    { label: "Extras (drinks, guest passes)", amount: 990000 },
  ],
  dueSoon: [
    { name: "Divine Ishimwe", item: "Monthly · due Fri 27 Nov", amount: 60000 },
    { name: "Yves Kamanzi", item: "3 months · due Sat 28 Nov", amount: 165000 },
    { name: "Ariane Iradukunda", item: "PT · 10 sessions · due 30 Nov", amount: 210000 },
    { name: "Thierry Rukundo", item: "Monthly · due 1 Dec", amount: 60000 },
    { name: "Gloria Uwera", item: "6-month plan, 2nd instalment · due 1 Dec", amount: 150000 },
    { name: "Didier Bizimana", item: "Monthly · due 2 Dec", amount: 60000 },
  ],
  overdueDays: { "Olivier Gasana": 9, "Josiane Kayitesi": 4, "Fabrice Murenzi": 2 } as Record<string, number>,
  expenses: [
    { label: "Salaries", amount: 4600000 },
    { label: "Rent", amount: 4200000 },
    { label: "Security", amount: 1500000 },
    { label: "Electricity and water", amount: 1100000 },
    { label: "Marketing", amount: 700000 },
    { label: "Equipment repairs", amount: 450000 },
    { label: "Cleaning supplies", amount: 350000 },
    { label: "Internet and software", amount: 200000 },
  ],
  latest: [
    { when: "Today 16:31", member: "Esther Mukeshimana", item: "PT · 5 sessions", method: "MTN MoMo", by: "Clarisse Umutoni", amount: 115000 },
    { when: "Today 15:02", member: "Walk-in", item: "Day pass", method: "Cash", by: "Arsène Nkusi", amount: 10000 },
    { when: "Today 13:45", member: "Samuel Ntwari", item: "3 months", method: "Card", by: "Clarisse Umutoni", amount: 165000 },
    { when: "Today 12:10", member: "David Karangwa", item: "12 months", method: "Bank transfer", by: "Clarisse Umutoni", amount: 540000 },
    { when: "Today 10:40", member: "Bella Umuhoza", item: "10-class pack", method: "Airtel Money", by: "Arsène Nkusi", amount: 90000 },
    { when: "Today 09:15", member: "Lionel Manzi", item: "6 months", method: "Card", by: "Clarisse Umutoni", amount: 300000 },
    { when: "Today 08:30", member: "Vanessa Irakoze", item: "Monthly", method: "MTN MoMo", by: "Arsène Nkusi", amount: 60000 },
    { when: "Mon 19:05", member: "Liliane Tuyishime", item: "Monthly", method: "Cash", by: "Arsène Nkusi", amount: 60000 },
  ],
  collectedToday: 1300000,
  /** Mobile money that came in without a member name: the front desk matches it to a member. */
  unmatched: [
    { network: "MTN MoMo", from: "+250 788 ••• 412", time: "11:02", amount: 60000, guess: "Liliane Tuyishime (Monthly due)" },
    { network: "Airtel Money", from: "+250 733 ••• 118", time: "14:37", amount: 25000, guess: "No match: a single PT session?" },
  ],
};

/* ---------- Team ---------- */

export type Staff = { slug: string; name: string; role: string; pay: string; phone: string; since: string };
export const staff: Staff[] = [
  { slug: "clarisse", name: "Clarisse Umutoni", role: "Front desk", pay: "350,000 RWF a month", phone: "+250 788 455 120", since: "Feb 2024" },
  { slug: "arsene", name: "Arsène Nkusi", role: "Front desk", pay: "350,000 RWF a month", phone: "+250 783 388 412", since: "Sep 2025" },
  { slug: "eric", name: "Eric Mugisha", role: "Coach · Spin and HIIT", pay: "250,000 RWF + 8,000 a class", phone: "+250 785 902 337", since: "Mar 2024" },
  { slug: "aline", name: "Aline Uwase", role: "Coach · Yoga and Pilates", pay: "250,000 RWF + 8,000 a class", phone: "+250 788 610 884", since: "Mar 2024" },
  { slug: "jean-paul", name: "Jean-Paul Niyonzima", role: "Coach and trainer · Strength", pay: "350,000 RWF + 8,000 a class + 15% PT", phone: "+250 787 271 905", since: "Jun 2024" },
  { slug: "grace", name: "Grace Ingabire", role: "Coach · HIIT and Boxing", pay: "250,000 RWF + 8,000 a class", phone: "+250 722 534 260", since: "Jan 2025" },
  { slug: "patrick", name: "Patrick Habimana", role: "Personal trainer · Strength", pay: "250,000 RWF + 15% PT", phone: "+250 783 147 693", since: "Mar 2024" },
  { slug: "diane", name: "Diane Mukamana", role: "Personal trainer · Mobility", pay: "250,000 RWF + 15% PT", phone: "+250 788 829 016", since: "Apr 2025" },
  { slug: "joyce", name: "Joyce Mutoni", role: "Sales and social media", pay: "400,000 RWF a month", phone: "+250 785 466 238", since: "Jul 2025" },
  { slug: "emmanuel", name: "Emmanuel Nkurunziza", role: "Cleaning and maintenance", pay: "200,000 RWF a month", phone: "+250 787 990 514", since: "Feb 2024" },
];

export const coachStats = [
  { slug: "eric", classes: 38, fill: 91, noshow: 6, kept: 94, pt: 0, sold: 0, rating: 4.9 },
  { slug: "jean-paul", classes: 30, fill: 84, noshow: 7, kept: 88, pt: 22, sold: 3, rating: 4.7 },
  { slug: "aline", classes: 34, fill: 78, noshow: 8, kept: 90, pt: 12, sold: 1, rating: 4.8 },
  { slug: "grace", classes: 26, fill: 72, noshow: 11, kept: 81, pt: 8, sold: 1, rating: 4.6 },
  { slug: "patrick", classes: 10, fill: 65, noshow: 9, kept: 86, pt: 64, sold: 5, rating: 4.9 },
  { slug: "diane", classes: 12, fill: 58, noshow: 12, kept: 79, pt: 41, sold: 2, rating: 4.5 },
];

export const deskStats = [
  { name: "Clarisse Umutoni", converted: 9, trials: 14, collected: 8600000, renewals: 31 },
  { name: "Arsène Nkusi", converted: 5, trials: 11, collected: 4550000, renewals: 18 },
];

export const onShift = [
  { name: "Clarisse Umutoni", role: "Front desk", hours: "14:00 – 22:00", now: true },
  { name: "Jean-Paul Niyonzima", role: "Gym floor", hours: "12:00 – 20:00", now: true },
  { name: "Diane Mukamana", role: "Coach", hours: "15:00 – 21:00", now: true },
  { name: "Grace Ingabire", role: "Coach, arrives later", hours: "17:00 – 19:00", now: false },
  { name: "Eric Mugisha", role: "Coach, arrives later", hours: "18:30 – 21:30", now: false },
];

/** Leave request shown on Today and Team. */
export const leaveRequest = {
  name: "Aline Uwase",
  first: "Aline",
  dates: "1 – 3 December",
  reason: "family wedding",
  classes: 4,
  cover: "Diane for Yoga on Tue and Thu, Grace for Pilates on Wed",
};

export const payroll = { base: 2900000, classPay: 1200000, classes: 150, ptCommission: 500000, ptSessions: 147 };

/* ---------- Personal training today ---------- */

export const ptToday = [
  { time: "07:00", member: "Sandrine Uwimana", memberId: "m-001", trainer: "patrick", note: "Done", done: true },
  { time: "08:00", member: "Didier Bizimana", memberId: "m-010", trainer: "diane", note: "Done", done: true },
  { time: "13:00", member: "Thierry Rukundo", memberId: "m-008", trainer: "patrick", note: "Done", done: true },
  { time: "17:00", member: "Esther Mukeshimana", memberId: "m-011", trainer: "patrick", note: "New package today", done: false },
  { time: "18:00", member: "Samuel Ntwari", memberId: "m-012", trainer: "jean-paul", note: "Free consultation", done: false },
  { time: "19:30", member: "Gloria Uwera", memberId: "m-009", trainer: "diane", note: "6 sessions left", done: false },
];

/* ---------- WhatsApp automations ---------- */

export type Automation = { key: string; name: string; when: string; on: boolean; sentWeek: number; text: string };
export const automations: Automation[] = [
  { key: "booking", name: "Booking confirmed", when: "Right after booking", on: true, sentWeek: 312,
    text: "Hi {name}, you're booked: {class} with {coach}, {day} at {time}, {room}. Can't make it? Cancel here: {link}" },
  { key: "class_reminder", name: "Class reminder", when: "2 hours before", on: true, sentWeek: 298,
    text: "{class} with {coach} starts at {time} in {room}. Bring water and a towel. See you there." },
  { key: "pt_reminder", name: "PT session reminder", when: "24 hours and 2 hours before", on: true, sentWeek: 74,
    text: "Reminder: personal training with {trainer} {day} at {time}. Reply here if you need to move it." },
  { key: "waitlist", name: "Spot opened from waitlist", when: "As soon as a spot frees up", on: true, sentWeek: 19,
    text: "Good news, {name}: a spot opened in {class} {day} at {time}. You're booked in. Can't come? Cancel here: {link}" },
  { key: "changed", name: "Class cancelled or moved", when: "As soon as staff change it", on: true, sentWeek: 0,
    text: "Sorry {name}, {class} {day} at {time} is cancelled. Pick another class here: {link}" },
  { key: "payment_due", name: "Payment due", when: "3 days before", on: true, sentWeek: 23,
    text: "Hi {name}, your {plan} payment of {amount} is due on {date}. Pay at the desk, by card, MTN MoMo or Airtel Money." },
  { key: "payment_overdue", name: "Payment overdue", when: "Day 1 and day 7 after", on: true, sentWeek: 5,
    text: "Hi {name}, a friendly reminder that {amount} for {plan} is still open. Reply here if you'd like to arrange it." },
  { key: "expiring", name: "Membership expiring", when: "7 days and 1 day before", on: true, sentWeek: 21,
    text: "Hi {name}, your membership ends on {date}. Renew now and keep your spot in your favourite classes. Reply RENEW." },
  { key: "expired", name: "Expired: renewal offer", when: "Day after expiry", on: true, sentWeek: 4,
    text: "We miss you already, {name}. Renew this week and get 5 extra days on us." },
  { key: "trial", name: "Trial follow-up", when: "Evening of the trial", on: true, sentWeek: 11,
    text: "Thanks for training with us today, {name}! How was it? Join this week and your first month is 50,000 RWF instead of 60,000 RWF." },
  { key: "noshow", name: "Missed class", when: "Same day", on: true, sentWeek: 16,
    text: "We missed you at {class} today, {name}. Everything OK? Book your next class here: {link}" },
  { key: "miss_you", name: "We miss you", when: "No visit for 14 days", on: true, sentWeek: 27,
    text: "Hi {name}, it's been two weeks! Your spot is waiting. Here's this week's timetable: {link}" },
  { key: "pt_low", name: "PT package running low", when: "2 sessions left", on: true, sentWeek: 3,
    text: "You have 2 sessions left with {trainer}. Renew 10 sessions for 210,000 RWF? Reply YES." },
  { key: "welcome", name: "Welcome", when: "When they join", on: true, sentWeek: 6,
    text: "Welcome to {gym}, {name}! Book classes here: {link}. Open 7 days a week. Questions? Just reply." },
  { key: "birthday", name: "Birthday", when: "On the day", on: false, sentWeek: 0,
    text: "Happy birthday, {name}! Bring a friend for a free class this week, on us." },
];

export const previewValues: Record<string, string> = {
  name: "Sandrine", class: "Spin", coach: "Eric", day: "today", time: "20:15", room: "Studio 2",
  link: `${brand.shortLink}/m/7KQ2`, gym: brand.short, trainer: "Patrick", plan: "Monthly", amount: "60,000 RWF", date: "Sat 28 Nov",
};

export const recentMessages = [
  { when: "16:52", to: "Sandrine Uwimana", what: "Booking confirmed · 20:15 Spin", status: "Delivered" },
  { when: "16:45", to: "Olivier Gasana", what: "Payment overdue · 115,000 RWF", status: "Read" },
  { when: "16:45", to: "Josiane Kayitesi", what: "Payment overdue · 150,000 RWF", status: "Delivered" },
  { when: "16:45", to: "Fabrice Murenzi", what: "Payment overdue · 60,000 RWF", status: "Read" },
  { when: "16:31", to: "Esther Mukeshimana", what: "Payment receipt · 115,000 RWF", status: "Read" },
  { when: "15:30", to: "17:30 HIIT (10 members)", what: "Class reminder", status: "Delivered" },
  { when: "14:10", to: "Yves Kamanzi", what: "Membership expiring · Sat 28 Nov", status: "Read" },
  { when: "18:15", to: "20:15 Spin (16 members)", what: "Class reminder", status: "Scheduled" },
];
