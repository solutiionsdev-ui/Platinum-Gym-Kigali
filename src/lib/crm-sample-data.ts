/**
 * SAMPLE DATA for the CRM (owner and staff side), Platinum Gym, Kigali. Coach names and prices are real; members, money and staff details are made up.
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
  monthly: "1 month",
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
  { name: "Sandrine Uwimana", phone: "+250 788 482 221", planId: "12m", end: "2027-03-13", status: "active", lastVisit: DEMO_DATE, visits4w: 11, ptLeft: 3, trainer: "emmanuel", source: "Instagram", since: "2025-03-14" },
  { name: "Olivier Gasana", phone: "+250 783 215 904", planId: "12m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-23", visits4w: 12, owes: 115000, owesFor: "PT · 5 sessions", ptLeft: 5, trainer: "gael", source: "Referral", since: "2024-11-29" },
  { name: "Josiane Kayitesi", phone: "+250 785 330 418", planId: "6m", end: "2027-02-28", status: "active", lastVisit: "2026-11-22", visits4w: 7, owes: 275000, owesFor: "6 months, 2nd instalment", source: "Instagram" },
  { name: "Fabrice Murenzi", phone: "+250 787 902 115", planId: "monthly", end: "2026-12-21", status: "active", lastVisit: "2026-11-20", visits4w: 6, owes: 120000, owesFor: "1 month", source: "Walk-in" },
  { name: "Divine Ishimwe", phone: "+250 788 771 052", planId: "monthly", end: "2026-11-27", status: "expiring", lastVisit: "2026-11-21", visits4w: 8, source: "Website" },
  { name: "Yves Kamanzi", phone: "+250 722 604 337", planId: "3m", end: "2026-11-28", status: "expiring", lastVisit: "2026-11-19", visits4w: 5, source: "Google" },
  { name: "Ariane Iradukunda", phone: "+250 788 118 964", planId: "12m", end: "2027-06-30", status: "active", lastVisit: "2026-11-23", visits4w: 13, ptLeft: 1, trainer: "mido", source: "Referral" },
  { name: "Thierry Rukundo", phone: "+250 783 845 201", planId: "monthly", end: "2026-12-01", status: "expiring", lastVisit: DEMO_DATE, visits4w: 9, ptLeft: 6, trainer: "emmanuel", source: "Instagram" },
  { name: "Gloria Uwera", phone: "+250 785 522 876", planId: "6m", end: "2027-01-31", status: "active", lastVisit: "2026-11-23", visits4w: 10, ptLeft: 6, trainer: "mido", source: "Website" },
  { name: "Didier Bizimana", phone: "+250 788 660 419", planId: "monthly", end: "2026-12-02", status: "active", lastVisit: DEMO_DATE, visits4w: 12, ptLeft: 8, trainer: "mido", source: "Walk-in" },
  { name: "Esther Mukeshimana", phone: "+250 787 113 780", planId: "3m", end: "2027-01-15", status: "active", lastVisit: "2026-11-22", visits4w: 9, ptLeft: 7, trainer: "emmanuel", source: "Instagram" },
  { name: "Samuel Ntwari", phone: "+250 783 409 662", planId: "3m", end: "2027-02-22", status: "active", lastVisit: DEMO_DATE, visits4w: 1, source: "Website", since: DEMO_DATE },
  { name: "David Karangwa", phone: "+250 722 237 590", planId: "12m", end: "2027-11-23", status: "active", lastVisit: DEMO_DATE, visits4w: 2, source: "Referral", since: "2026-11-17" },
  { name: "Bella Umuhoza", phone: "+250 788 905 314", planId: "monthly", end: "2026-12-23", status: "active", lastVisit: DEMO_DATE, visits4w: 3, source: "Instagram" },
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

// First names avoid the coaches' and staff's names, so the assistant's "which member?" demo stays clear.
const FIRST = ["Kevin", "Olivier", "Josiane", "Fabrice", "Divine", "Yves", "Ariane", "Thierry", "Gloria", "Didier", "Esther", "Samuel", "David", "Bella", "Lionel", "Liliane", "Vanessa", "Chantal", "Claude", "Ange", "Moses", "Innocent", "Nadine", "Denise", "Fiston", "Gisele", "Herve", "Irene", "Joel", "Keza", "Mireille", "Nathan", "Pacifique", "Regis", "Sonia", "Tresor", "Yvette", "Brian", "Ella", "Cedric", "Arnaud", "Benjamin", "Christine", "Daniel", "Florence", "Henry", "Ivan", "Jessica", "Laura", "Michael", "Nicole", "Peter", "Rachel", "Sarah", "Teddy", "Victor", "Alice", "James", "Sophie", "Joseph"];
const LAST = ["Mugisha", "Uwase", "Niyonzima", "Ingabire", "Habimana", "Uwimana", "Nshuti", "Umutoni", "Nkurunziza", "Mutoni", "Iradukunda", "Hakizimana", "Uwera", "Gasana", "Kamanzi", "Rwigema", "Bizimana", "Ndayisaba", "Tuyishime", "Murenzi", "Kayitesi", "Munyaneza", "Ishimwe", "Irakoze", "Mugabo", "Nsengiyumva", "Uwamahoro", "Byiringiro", "Karangwa", "Ntwari", "Mukeshimana", "Twagirayezu", "Rukundo", "Manzi", "Gatete", "Shema", "Kalisa", "Rutagengwa", "Umuhoza", "Nkusi", "Kimani", "Otieno", "Okafor", "Mensah", "Dubois", "Smith", "Nyiraneza", "Sibomana", "Ruzindana", "Kabera"];
const PREFIXES = ["788", "783", "785", "787", "789", "722", "723", "728", "733", "738"];
const SOURCES: CrmMember["source"][] = ["Instagram", "Instagram", "Instagram", "Walk-in", "Walk-in", "Referral", "Referral", "Website", "Google"];
const TRAINERS = ["emmanuel", "mido", "gael"];

function pickPlan(r: () => number): CrmMember["planId"] {
  const x = r();
  if (x < 0.4) return "monthly";
  if (x < 0.65) return "3m";
  if (x < 0.8) return "6m";
  return "12m";
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

  const plan: [MemberStatus, number][] = [["active", 250], ["expiring", 8], ["frozen", 6], ["expired", 15], ["trial", 6]];
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
    favourites: [["Abs & Core", 14], ["Akantu", 9], ["Mobility", 4]],
    noShows: 1,
    upcoming: [
      { when: "Today · 19:30", what: "Abs & Core with Mido · Studio", status: "Booked", tone: "booked" },
      { when: "Fri 27 · 18:30", what: "Boxing with Emmanuel · Boxing area", status: "Waitlist #3", tone: "waitlist" },
      { when: "Sat 28 · 08:00", what: "PT with Emmanuel", status: "Booked", tone: "booked" },
    ],
    scans: [
      { date: "14 Mar 2026", weight: "64.2 kg", fat: "27.4%", muscle: "25.1 kg", by: "Emmanuel" },
      { date: "15 Jun 2026", weight: "63.0 kg", fat: "25.9%", muscle: "25.6 kg", by: "Emmanuel" },
      { date: "12 Sep 2026", weight: "62.1 kg", fat: "24.8%", muscle: "25.9 kg", by: "Mido" },
      { date: "10 Nov 2026", weight: "61.8 kg", fat: "24.1%", muscle: "26.2 kg", by: "Emmanuel" },
    ],
    scanChange: ["−2.4 kg", "−3.3 pts", "+1.1 kg"],
    payments: [
      { date: "21 Aug 2026", item: "PT · 10 sessions with Emmanuel", method: "MTN MoMo · Arsène Nkusi", amount: 210000 },
      { date: "14 Mar 2026", item: "12-month package (renewal)", method: "Card · Clarisse Umutoni", amount: 1000000 },
      { date: "14 Mar 2025", item: "12-month package", method: "Bank transfer · Clarisse Umutoni", amount: 1000000 },
    ],
    whatsapp: [
      { text: "Booked into 19:30 Abs & Core by the assistant. Confirmation sent.", when: "Today 16:52" },
      { text: "Class reminder for 19:30 Abs & Core", when: "Scheduled for today 17:30", scheduled: true },
      { text: "Program check-in: week 5 of Tone & Shape", when: "Mon 23 Nov 18:00" },
      { text: "Body scan results with change since March", when: "10 Nov 19:20" },
    ],
    birthday: "2 February",
    emergency: "Jean Uwimana (brother)",
    waiver: "Signed 14 Mar 2025",
    health: "Lower back, no heavy deadlifts. Cleared by a physio in May 2026.",
    note: { text: "On Tone & Shape, week 5. Training for the Kigali Peace Marathon 10K in June.", by: "Emmanuel · 10 Nov" },
  },
};

/* ---------- Leads ---------- */

export type LeadStage = "new" | "contacted" | "trial_booked" | "trial_done" | "joined" | "lost";
export type Lead = { id: string; name: string; stage: LeadStage; source: string; interest: string; when: string; note: string; by?: string };
export const leads: Lead[] = [
  { id: "l1", name: "Brian Mugabo", stage: "new", source: "Website quiz", interest: "Lose the Belly", when: "3 h ago", note: "Quiz: lose weight · man · trains sometimes" },
  { id: "l2", name: "Gisele Kalisa", stage: "new", source: "Website quiz", interest: "Strong & Confident", when: "5 h ago", note: "Quiz: tone · woman · new to the gym" },
  { id: "l3", name: "Fiston Nkusi", stage: "contacted", source: "Instagram", interest: "Build Muscle", when: "Yesterday", note: "Will reply after checking the schedule", by: "Clarisse" },
  { id: "l4", name: "Denise Shema", stage: "contacted", source: "Walk-in", interest: "Aerobics", when: "Yesterday", note: "Asked about the couple package", by: "Arsène" },
  { id: "l5", name: "Peter Otieno", stage: "contacted", source: "Website", interest: "Online coaching", when: "Sun", note: "Lives in Nairobi, wants a home plan", by: "Clarisse" },
  { id: "l6", name: "Nadine Rutagengwa", stage: "trial_booked", source: "Website", interest: "Tone & Shape", when: "Wed 19:00", note: "Step Aerobics with Donyori", by: "Clarisse" },
  { id: "l7", name: "Cedric Gatete", stage: "trial_booked", source: "Instagram", interest: "Akantu", when: "Wed 06:00", note: "Akantu with Gael", by: "Arsène" },
  { id: "l8", name: "Sonia Byiringiro", stage: "trial_booked", source: "Google", interest: "Lose Weight Safely", when: "Tue 19:30", note: "Abs & Core with Mido, tonight", by: "Clarisse" },
  { id: "l9", name: "Joel Sibomana", stage: "trial_booked", source: "Website", interest: "Boxing", when: "Fri 18:30", note: "Boxing with Emmanuel", by: "Arsène" },
  { id: "l10", name: "Irene Nyiraneza", stage: "trial_done", source: "Website quiz", interest: "Lose Weight Safely", when: "Yesterday", note: "No follow-up yet", by: "Clarisse" },
  { id: "l11", name: "Arnaud Dubois", stage: "trial_done", source: "Instagram", interest: "Akantu", when: "Yesterday", note: "Liked it, thinking about 3 months", by: "Arsène" },
  { id: "l12", name: "Samuel Ntwari", stage: "joined", source: "Website", interest: "Build Muscle", when: "Today", note: "3 months", by: "Clarisse" },
  { id: "l13", name: "Lionel Manzi", stage: "joined", source: "Google", interest: "Akantu", when: "Today", note: "6 months", by: "Clarisse" },
  { id: "l14", name: "Vanessa Irakoze", stage: "joined", source: "Website quiz", interest: "Tone & Shape", when: "Today", note: "1 month", by: "Arsène" },
  { id: "l15", name: "David Karangwa", stage: "joined", source: "Referral", interest: "Build Muscle", when: "Mon", note: "12 months", by: "Clarisse" },
  { id: "l16", name: "Teddy Kimani", stage: "lost", source: "Instagram", interest: "Bootcamp", when: "Sat", note: "Lives too far", by: "Arsène" },
  { id: "l17", name: "Rachel Mensah", stage: "lost", source: "Walk-in", interest: "Mobility", when: "Fri", note: "Price, may come back in January", by: "Clarisse" },
];

/* ---------- Online coaching clients ---------- */

export type OnlineClient = { id: string; name: string; where: string; program: string; week: string; nextCheckIn: string; status: "on_track" | "check_in_due" | "quiet" };
export const onlineClients: OnlineClient[] = [
  { id: "o1", name: "Peter Otieno", where: "Nairobi · home", program: "Lose the Belly (home)", week: "Starts Monday", nextCheckIn: "Mon 30 Nov", status: "on_track" },
  { id: "o2", name: "Aline Mukamana", where: "Brussels · gym", program: "Tone & Shape", week: "Week 3 of 8", nextCheckIn: "Today", status: "check_in_due" },
  { id: "o3", name: "Eric Nshimiyimana", where: "Musanze · home", program: "Build Muscle (home)", week: "Week 6 of 8", nextCheckIn: "Thu 26 Nov", status: "on_track" },
  { id: "o4", name: "Grace Uwineza", where: "Kigali · home", program: "Lose Weight Safely", week: "Week 2 of 6", nextCheckIn: "Today", status: "check_in_due" },
  { id: "o5", name: "Kevin Habimana", where: "Toronto · gym", program: "Akantu (online)", week: "Week 4 of 6", nextCheckIn: "Sat 21 Nov, missed", status: "quiet" },
];

/* ---------- Money (November, month to date, RWF) ---------- */

export const money = {
  in: 28600000,
  out: 16600000,
  /** Last 6 months, in millions of RWF. */
  months: [
    { label: "Jun", in: 22.4, out: 15.6 },
    { label: "Jul", in: 21.0, out: 15.4 },
    { label: "Aug", in: 19.8, out: 15.2 },
    { label: "Sep", in: 24.6, out: 16.0 },
    { label: "Oct", in: 29.4, out: 16.4 },
    { label: "Nov", in: 28.6, out: 16.6 },
  ],
  sources: [
    { label: "Memberships", amount: 21300000 },
    { label: "Personal training", amount: 3900000 },
    { label: "Online coaching", amount: 300000 },
    { label: "Day passes and single classes", amount: 2150000 },
    { label: "Extras (drinks, guest passes)", amount: 950000 },
  ],
  dueSoon: [
    { name: "Divine Ishimwe", item: "1 month · due Fri 27 Nov", amount: 120000 },
    { name: "Yves Kamanzi", item: "3 months · due Sat 28 Nov", amount: 300000 },
    { name: "Ariane Iradukunda", item: "PT · 10 sessions · due 30 Nov", amount: 210000 },
    { name: "Thierry Rukundo", item: "1 month · due 1 Dec", amount: 120000 },
    { name: "Gloria Uwera", item: "6 months, 2nd instalment · due 1 Dec", amount: 275000 },
    { name: "Didier Bizimana", item: "1 month · due 2 Dec", amount: 120000 },
  ],
  overdueDays: { "Olivier Gasana": 9, "Josiane Kayitesi": 4, "Fabrice Murenzi": 2 } as Record<string, number>,
  expenses: [
    { label: "Salaries", amount: 6200000 },
    { label: "Rent", amount: 5500000 },
    { label: "Electricity and water (incl. sauna)", amount: 1600000 },
    { label: "Security", amount: 1500000 },
    { label: "Marketing", amount: 700000 },
    { label: "Equipment repairs", amount: 450000 },
    { label: "Cleaning supplies", amount: 400000 },
    { label: "Internet and software", amount: 250000 },
  ],
  latest: [
    { when: "Today 16:31", member: "Esther Mukeshimana", item: "PT · 5 sessions", method: "MTN MoMo", by: "Clarisse Umutoni", amount: 115000 },
    { when: "Today 15:02", member: "Walk-in", item: "Day pass", method: "Cash", by: "Arsène Nkusi", amount: 10000 },
    { when: "Today 13:45", member: "Samuel Ntwari", item: "3 months", method: "Card", by: "Clarisse Umutoni", amount: 300000 },
    { when: "Today 12:10", member: "David Karangwa", item: "12 months", method: "Bank transfer", by: "Clarisse Umutoni", amount: 1000000 },
    { when: "Today 10:40", member: "Bella Umuhoza", item: "1 month", method: "Airtel Money", by: "Arsène Nkusi", amount: 120000 },
    { when: "Today 09:15", member: "Lionel Manzi", item: "6 months", method: "Card", by: "Clarisse Umutoni", amount: 550000 },
    { when: "Today 08:30", member: "Vanessa Irakoze", item: "1 month", method: "MTN MoMo", by: "Arsène Nkusi", amount: 120000 },
    { when: "Mon 19:05", member: "Liliane Tuyishime", item: "1 month", method: "Cash", by: "Arsène Nkusi", amount: 120000 },
  ],
  collectedToday: 2240000,
  /** Mobile money that came in without a member name: the front desk matches it to a member. */
  unmatched: [
    { network: "MTN MoMo", from: "+250 788 ••• 412", time: "11:02", amount: 120000, guess: "Liliane Tuyishime (1 month due)" },
    { network: "Airtel Money", from: "+250 733 ••• 118", time: "14:37", amount: 25000, guess: "No match: a single PT session?" },
  ],
};

/* ---------- Team ---------- */

export type Staff = { slug: string; name: string; role: string; pay: string; phone: string; since: string };
// Coach names are the gym's real coaches; pay, phones and the other staff are SAMPLE.
export const staff: Staff[] = [
  { slug: "clarisse", name: "Clarisse Umutoni", role: "Front desk", pay: "400,000 RWF a month", phone: "+250 788 455 120", since: "Feb 2024" },
  { slug: "arsene", name: "Arsène Nkusi", role: "Front desk (nights)", pay: "400,000 RWF a month", phone: "+250 783 388 412", since: "Sep 2025" },
  { slug: "emmanuel", name: "Emmanuel", role: "Coach · Strength, Boxing, Bootcamp", pay: "500,000 RWF + 10,000 a class + 15% PT", phone: "+250 785 902 337", since: "Mar 2024" },
  { slug: "mido", name: "Mido", role: "Coach · Abs & Core", pay: "400,000 RWF + 10,000 a class + 15% PT", phone: "+250 788 610 884", since: "Mar 2024" },
  { slug: "donyori", name: "Donyori", role: "Coach · Aerobics & Step", pay: "400,000 RWF + 10,000 a class", phone: "+250 787 271 905", since: "Jun 2024" },
  { slug: "tutor", name: "Tutor", role: "Coach · Mobility", pay: "350,000 RWF + 10,000 a class", phone: "+250 722 534 260", since: "Jan 2025" },
  { slug: "joyce", name: "Joyce Mutoni", role: "Sales, social media and online clients", pay: "450,000 RWF a month", phone: "+250 785 466 238", since: "Jul 2025" },
  { slug: "bosco", name: "Jean Bosco Hakizimana", role: "Cleaning and maintenance", pay: "250,000 RWF a month", phone: "+250 787 990 514", since: "Feb 2024" },
];

export const coachStats = [
  { slug: "gael", classes: 12, fill: 93, noshow: 5, kept: 95, pt: 40, sold: 6, rating: 4.9 },
  { slug: "mido", classes: 16, fill: 88, noshow: 6, kept: 90, pt: 18, sold: 2, rating: 4.8 },
  { slug: "emmanuel", classes: 22, fill: 86, noshow: 7, kept: 89, pt: 28, sold: 3, rating: 4.8 },
  { slug: "donyori", classes: 18, fill: 81, noshow: 8, kept: 87, pt: 0, sold: 0, rating: 4.7 },
  { slug: "tutor", classes: 12, fill: 58, noshow: 12, kept: 78, pt: 10, sold: 1, rating: 4.5 },
];

export const deskStats = [
  { name: "Clarisse Umutoni", converted: 9, trials: 14, collected: 12400000, renewals: 31 },
  { name: "Arsène Nkusi", converted: 5, trials: 11, collected: 6900000, renewals: 18 },
];

export const onShift = [
  { name: "Clarisse Umutoni", role: "Front desk", hours: "14:00 – 22:00", now: true },
  { name: "Emmanuel", role: "Gym floor", hours: "12:00 – 21:00", now: true },
  { name: "Tutor", role: "Coach", hours: "15:00 – 19:00", now: true },
  { name: "Mido", role: "Coach, arrives later", hours: "18:00 – 21:00", now: false },
  { name: "Arsène Nkusi", role: "Night desk, arrives later", hours: "22:00 – 06:00", now: false },
];

/** Leave request shown on Today and Team. */
export const leaveRequest = {
  name: "Donyori",
  first: "Donyori",
  dates: "1 – 3 December",
  reason: "family wedding",
  classes: 3,
  cover: "Mido for Aerobics on Monday, Tutor for Step Aerobics on Wednesday",
};

export const payroll = { base: 4600000, classPay: 800000, classes: 80, ptCommission: 800000, ptSessions: 96 };

/* ---------- Personal training today ---------- */

export const ptToday = [
  { time: "07:00", member: "Sandrine Uwimana", memberId: "m-001", trainer: "emmanuel", note: "Done", done: true },
  { time: "08:00", member: "Didier Bizimana", memberId: "m-010", trainer: "mido", note: "Done", done: true },
  { time: "13:00", member: "Thierry Rukundo", memberId: "m-008", trainer: "gael", note: "Done", done: true },
  { time: "17:00", member: "Esther Mukeshimana", memberId: "m-011", trainer: "emmanuel", note: "New package today", done: false },
  { time: "18:00", member: "Samuel Ntwari", memberId: "m-012", trainer: "gael", note: "Free consultation", done: false },
  { time: "19:30", member: "Gloria Uwera", memberId: "m-009", trainer: "mido", note: "6 sessions left", done: false },
];

/* ---------- WhatsApp automations ---------- */

export type Automation = { key: string; name: string; when: string; on: boolean; sentWeek: number; text: string };
export const automations: Automation[] = [
  { key: "booking", name: "Booking confirmed", when: "Right after booking", on: true, sentWeek: 186,
    text: "Hi {name}, you're booked: {class} with {coach}, {day} at {time}, {room}. Can't make it? Cancel here: {link}" },
  { key: "class_reminder", name: "Class reminder", when: "2 hours before", on: true, sentWeek: 171,
    text: "{class} with {coach} starts at {time} in the {room}. Bring water and a towel. See you there." },
  { key: "program_checkin", name: "Program check-in", when: "Every Monday", on: true, sentWeek: 64,
    text: "Hi {name}, week {week} of {program} starts today. This week: {plan}. Reply DONE after each session." },
  { key: "pt_reminder", name: "PT session reminder", when: "24 hours and 2 hours before", on: true, sentWeek: 52,
    text: "Reminder: personal training with {trainer} {day} at {time}. Reply here if you need to move it." },
  { key: "waitlist", name: "Spot opened from waitlist", when: "As soon as a spot frees up", on: true, sentWeek: 14,
    text: "Good news, {name}: a spot opened in {class} {day} at {time}. You're booked in. Can't come? Cancel here: {link}" },
  { key: "changed", name: "Class cancelled or moved", when: "As soon as staff change it", on: true, sentWeek: 0,
    text: "Sorry {name}, {class} {day} at {time} is cancelled. Pick another class here: {link}" },
  { key: "payment_due", name: "Payment due", when: "3 days before", on: true, sentWeek: 19,
    text: "Hi {name}, your {plan} payment of {amount} is due on {date}. Pay at the desk, by card, MTN MoMo or Airtel Money." },
  { key: "payment_overdue", name: "Payment overdue", when: "Day 1 and day 7 after", on: true, sentWeek: 5,
    text: "Hi {name}, a friendly reminder that {amount} for {plan} is still open. Reply here if you'd like to arrange it." },
  { key: "expiring", name: "Package ending", when: "7 days and 1 day before", on: true, sentWeek: 15,
    text: "Hi {name}, your package ends on {date}. Renew now and keep going with your program. Reply RENEW." },
  { key: "expired", name: "Expired: come back offer", when: "Day after it ends", on: true, sentWeek: 3,
    text: "We miss you already, {name}. Renew this week and get 5 extra days on us." },
  { key: "trial", name: "Trial follow-up", when: "Evening of the trial", on: true, sentWeek: 9,
    text: "Thanks for training with us today, {name}! How was it? Your coach suggests {program} for you. Reply YES and we'll set it up." },
  { key: "noshow", name: "Missed class", when: "Same day", on: true, sentWeek: 12,
    text: "We missed you at {class} today, {name}. Everything OK? Book your next class here: {link}" },
  { key: "miss_you", name: "We miss you", when: "No visit for 14 days", on: true, sentWeek: 21,
    text: "Hi {name}, it's been two weeks! Your spot is waiting. Here's this week's timetable: {link}" },
  { key: "pt_low", name: "PT package running low", when: "2 sessions left", on: true, sentWeek: 3,
    text: "You have 2 sessions left with {trainer}. Renew 10 sessions for 210,000 RWF? Reply YES." },
  { key: "welcome", name: "Welcome", when: "When they join", on: true, sentWeek: 6,
    text: "Welcome to {gym}, {name}! We're open 24 hours. Book classes here: {link}. Your first visit: bring water, a towel and clean sports shoes." },
];

export const previewValues: Record<string, string> = {
  name: "Sandrine", class: "Abs & Core", coach: "Mido", day: "today", time: "19:30", room: "Studio",
  link: `${brand.shortLink}/m/7KQ2`, gym: brand.short, trainer: "Emmanuel", plan: "1 month", amount: "120,000 RWF", date: "Sat 28 Nov",
  week: "5", program: "Tone & Shape",
};

export const recentMessages = [
  { when: "16:52", to: "Sandrine Uwimana", what: "Booking confirmed · 19:30 Abs & Core", status: "Delivered" },
  { when: "16:45", to: "Olivier Gasana", what: "Payment overdue · 115,000 RWF", status: "Read" },
  { when: "16:45", to: "Josiane Kayitesi", what: "Payment overdue · 275,000 RWF", status: "Delivered" },
  { when: "16:45", to: "Fabrice Murenzi", what: "Payment overdue · 120,000 RWF", status: "Read" },
  { when: "16:31", to: "Esther Mukeshimana", what: "Payment receipt · 115,000 RWF", status: "Read" },
  { when: "09:00", to: "Online clients (5)", what: "Program check-in · Monday plan", status: "Read" },
  { when: "14:10", to: "Yves Kamanzi", what: "Package ending · Sat 28 Nov", status: "Read" },
  { when: "17:30", to: "19:30 Abs & Core (11 members)", what: "Class reminder", status: "Scheduled" },
];
