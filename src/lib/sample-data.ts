/**
 * SAMPLE DATA ONLY. Made-up classes, coaches, prices and people for the Platinum Gym (Kigali) demo.
 * Everything here is read through src/lib/data.ts, so the database (step 4) can replace this file.
 * The demo day is Tuesday 24 November 2026, 16:40 (same as the CRM screens).
 */
import type { Text } from "./i18n";
import type {
  ClassType, Coach, CompareRow, DemoMember, Facility, Faq, Pass, Plan, PtPackage, RoomKey, Session,
} from "./types";

export const DEMO_TODAY = 1; // Tuesday
export const DEMO_NOW = "16:40";
export const WEEK_DATES = [23, 24, 25, 26, 27, 28, 29];

const t = (en: string): Text => ({ en });

export const rooms: Record<RoomKey, Text> = {
  studio1: t("Studio 1"),
  studio2: t("Studio 2"),
  floor: t("Gym floor"),
  turf: t("Turf"),
};

export const classTypes: ClassType[] = [
  { slug: "spin", name: t("Spin"), mins: 45, level: 3, perWeek: 9, coaches: ["eric"], text: t("Indoor cycling to loud music. Ride at your own resistance."), photo: t("Spin studio, lights down") },
  { slug: "hiit", name: t("HIIT"), mins: 40, level: 3, perWeek: 8, coaches: ["grace"], text: t("Short bursts, short rests. Done in 40 minutes, felt for two days."), photo: t("HIIT circuit on the turf") },
  { slug: "strength", name: t("Strength"), mins: 55, level: 2, perWeek: 7, coaches: ["jean-paul"], text: t("Coached lifting in small groups: squat, press, deadlift, done right."), photo: t("Barbell class at the racks") },
  { slug: "boxing", name: t("Boxing"), mins: 50, level: 2, perWeek: 5, coaches: ["grace"], text: t("Technique, pads and bag rounds. Gloves available at the desk."), photo: t("Pads and gloves session") },
  { slug: "yoga", name: t("Yoga"), mins: 60, level: 1, perWeek: 6, coaches: ["aline"], text: t("Flow and stretch classes to balance the hard days."), photo: t("Yoga studio, morning light") },
  { slug: "pilates", name: t("Pilates"), mins: 50, level: 1, perWeek: 5, coaches: ["aline"], text: t("Core, posture and control. Good for backs that sit all day."), photo: t("Mat Pilates class") },
];

export const coaches: Coach[] = [
  {
    slug: "eric", name: t("Eric Mugisha"), first: t("Eric"), role: t("Spin & HIIT"), trainer: false,
    bio: t("Former track cyclist. These Spin classes fill up first, so book early."),
    specialties: [t("Indoor cycling"), t("Conditioning")],
  },
  {
    slug: "aline", name: t("Aline Uwase"), first: t("Aline"), role: t("Yoga & Pilates"), trainer: false,
    bio: t("Certified yoga and mat Pilates teacher. Calm classes that still make you work."),
    specialties: [t("Vinyasa yoga"), t("Mat Pilates")],
  },
  {
    slug: "jean-paul", name: t("Jean-Paul Niyonzima"), first: t("Jean-Paul"), role: t("Strength & powerlifting"), trainer: true,
    bio: t("Competitive powerlifter. Teaches the big lifts step by step, from your first squat."),
    specialties: [t("Barbell technique"), t("Powerlifting")],
  },
  {
    slug: "grace", name: t("Grace Ingabire"), first: t("Grace"), role: t("HIIT & Boxing"), trainer: false,
    bio: t("Amateur boxer. Fast, loud classes with clean technique."),
    specialties: [t("Boxing"), t("Circuit training")],
  },
  {
    slug: "patrick", name: t("Patrick Habimana"), first: t("Patrick"), role: t("Personal trainer · strength"), trainer: true,
    bio: t("Builds strength plans around busy schedules and old injuries. Tracks every session."),
    specialties: [t("Strength"), t("Body recomposition"), t("Coming back from injury")],
  },
  {
    slug: "diane", name: t("Diane Mukamana"), first: t("Diane"), role: t("Personal trainer · mobility"), trainer: true,
    bio: t("Mobility and posture work for desk-bound backs, runners and anyone who feels stiff."),
    specialties: [t("Mobility"), t("Posture"), t("Running")],
  },
];

type Row = [time: string, type: string, coach: string, room: RoomKey, cap: number, booked: number, waiting?: number];
const weekRows: Row[][] = [
  [["06:30", "spin", "eric", "studio2", 20, 18], ["07:30", "strength", "jean-paul", "floor", 12, 9], ["12:30", "hiit", "grace", "turf", 16, 7], ["17:30", "boxing", "grace", "studio1", 14, 11], ["19:00", "spin", "eric", "studio2", 20, 20, 3], ["20:30", "yoga", "aline", "studio1", 18, 9]],
  [["07:00", "pilates", "aline", "studio1", 14, 8], ["09:00", "spin", "eric", "studio2", 20, 15], ["12:30", "strength", "jean-paul", "floor", 12, 12, 1], ["14:00", "yoga", "aline", "studio1", 18, 7], ["17:30", "hiit", "grace", "turf", 16, 10], ["18:30", "strength", "jean-paul", "floor", 12, 9], ["19:00", "spin", "eric", "studio2", 20, 20, 5], ["20:15", "spin", "eric", "studio2", 20, 16], ["20:30", "yoga", "aline", "studio1", 18, 9]],
  [["06:30", "hiit", "grace", "turf", 16, 12], ["07:30", "yoga", "aline", "studio1", 18, 6], ["12:30", "spin", "eric", "studio2", 20, 11], ["18:00", "boxing", "grace", "studio1", 14, 14, 2], ["19:00", "strength", "jean-paul", "floor", 12, 7], ["20:00", "pilates", "aline", "studio1", 14, 10]],
  [["07:00", "spin", "eric", "studio2", 20, 13], ["12:30", "hiit", "grace", "turf", 16, 9], ["17:30", "strength", "jean-paul", "floor", 12, 10], ["18:30", "strength", "jean-paul", "floor", 12, 12, 2], ["19:00", "spin", "eric", "studio2", 20, 19], ["20:30", "yoga", "aline", "studio1", 18, 12]],
  [["06:30", "strength", "jean-paul", "floor", 12, 8], ["07:30", "pilates", "aline", "studio1", 14, 9], ["17:30", "hiit", "grace", "turf", 16, 16, 4], ["18:30", "boxing", "grace", "studio1", 14, 6], ["19:30", "spin", "eric", "studio2", 20, 12]],
  [["09:00", "pilates", "aline", "studio1", 14, 3], ["10:00", "spin", "eric", "studio2", 20, 17], ["11:00", "strength", "jean-paul", "floor", 12, 11], ["12:00", "hiit", "grace", "turf", 16, 8]],
  [["09:00", "yoga", "aline", "studio1", 18, 14], ["10:00", "spin", "eric", "studio2", 20, 9], ["11:00", "boxing", "grace", "studio1", 14, 5]],
];

export const sessions: Session[] = weekRows.flatMap((rows, day) =>
  rows.map(([time, type, coach, room, cap, booked, waiting = 0]) => ({
    id: `${day}-${time.replace(":", "")}-${type}`,
    day, time, type, coach, room, cap, booked, waiting,
  })),
);

export const plans: Plan[] = [
  { id: "monthly", name: t("Monthly"), price: 60000, best: false, per: t("per month, stop any month"), points: [t("Gym floor and every class"), t("Sauna and recovery area")] },
  { id: "3m", name: t("3 months"), price: 165000, best: false, per: t("55,000 RWF a month"), points: [t("Everything in Monthly"), t("Up to 10 freeze days"), t("Body scan every month")] },
  { id: "6m", name: t("6 months"), price: 300000, best: false, per: t("50,000 RWF a month"), points: [t("Everything in 3 months"), t("Up to 20 freeze days"), t("1 guest pass a month")] },
  { id: "12m", name: t("12 months"), price: 540000, best: true, per: t("45,000 RWF a month"), points: [t("Everything in 6 months"), t("Up to 30 freeze days"), t("2 guest passes a month")] },
];

export const passes: Pass[] = [
  { name: t("Student monthly"), note: t("Valid student card, classes before 17:00"), price: 40000 },
  { name: t("10-class pack"), note: t("Any class, use within 2 months"), price: 90000 },
  { name: t("Day pass"), note: t("Gym floor and one class"), price: 10000 },
];

const YES = t("Yes");
const NONE = t("None");
export const compareRows: CompareRow[] = [
  { label: t("Gym floor, all opening hours"), values: [YES, YES, YES, YES] },
  { label: t("All group classes"), values: [YES, YES, YES, YES] },
  { label: t("Sauna and recovery area"), values: [YES, YES, YES, YES] },
  { label: t("Body-composition scan"), values: [t("Every 3 months"), t("Every month"), t("Every month"), t("Every month")] },
  { label: t("Freeze days"), values: [NONE, t("10"), t("20"), t("30")] },
  { label: t("Guest passes"), values: [NONE, NONE, t("1 a month"), t("2 a month")] },
  { label: t("Price per month (RWF)"), values: [t("60,000"), t("55,000"), t("50,000"), t("45,000")] },
];

export const ptPackages: PtPackage[] = [
  { name: t("Single session"), price: 25000, per: t("per session"), note: t("Try it, or top up between packages.") },
  { name: t("5 sessions"), price: 115000, per: t("23,000 RWF each"), note: t("Use within 6 weeks.") },
  { name: t("10 sessions"), price: 210000, per: t("21,000 RWF each"), note: t("Use within 3 months. Includes a written plan.") },
];

export const faqs: Faq[] = [
  { q: t("Can I freeze my membership?"), a: t("3, 6 and 12-month plans come with freeze days for travel or injury. Ask at the desk or on WhatsApp and your end date moves by the days you freeze.") },
  { q: t("How late can I cancel a class?"), a: t("Up to 2 hours before it starts, from the link in your WhatsApp confirmation. Later than that, a class pack loses one class.") },
  { q: t("Which payment methods do you accept?"), a: t("Cash, card, MTN MoMo and Airtel Money. You get the receipt on WhatsApp.") },
  { q: t("I have never trained before. Where do I start?"), a: t("Book a free trial class or a free consultation with a trainer. We will suggest the right classes for your level.") },
];

export const facilities: Facility[] = [
  { title: t("Gym floor"), text: t("Racks, free weights up to 50 kg, cable machines and cardio."), photo: t("Gym floor with racks") },
  { title: t("Studios"), text: t("Two studios: Spin with 20 bikes, and a quiet studio for Yoga, Pilates and Boxing."), photo: t("Spin studio") },
  { title: t("Turf"), text: t("20 metres of turf for sleds, HIIT circuits and conditioning."), photo: t("Turf lane with sleds") },
  { title: t("Sauna and recovery"), text: t("Sauna, foam rollers and a stretching zone to finish your session."), photo: t("Sauna and stretching zone") },
  { title: t("Body scan"), text: t("A monthly body-composition scan: weight, body fat and muscle, tracked over time."), photo: t("Body-composition scanner") },
  { title: t("Changing rooms"), text: t("Showers, lockers with your own code and towels at the desk."), photo: t("Changing room and lockers") },
];

/** The member page reached from WhatsApp links: /en/m/7KQ2 */
export const demoMembers: DemoMember[] = [
  {
    code: "7KQ2",
    name: t("Sandrine Uwimana"),
    first: t("Sandrine"),
    plan: t("12 months · all access"),
    ends: t("13 March 2027"),
    daysLeft: 109,
    ptLeft: 3,
    trainer: "patrick",
    bookings: [
      { id: "b1", when: t("Today · 20:15"), what: t("Spin with Eric · Studio 2"), status: "booked" },
      { id: "b2", when: t("Thu 26 Nov · 18:30"), what: t("Strength with Jean-Paul · Gym floor"), status: "waitlist", place: 2 },
      { id: "b3", when: t("Fri 27 Nov · 07:00"), what: t("Personal training with Patrick"), status: "booked" },
    ],
  },
];
