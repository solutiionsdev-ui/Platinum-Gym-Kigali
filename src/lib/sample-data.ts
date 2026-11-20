/**
 * Platinum Gym (Kigali) website data.
 * REAL (from platinumgymkigali.com, 20 Nov 2026): class types, coach names, prices, benefits, 24/7 opening, founder story.
 * SAMPLE: the extra timetable sessions and how full they are, PT package prices, the featured member.
 * Read through src/lib/data.ts so the database (step 4) can replace this file.
 * The demo day is Tuesday 24 November 2026, 16:40.
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
  studio1: t("Studio"),
  studio2: t("Boxing area"),
  floor: t("Weights floor"),
  turf: t("Functional area"),
};

export const classTypes: ClassType[] = [
  {
    slug: "akantu", name: t("Akantu"), mins: 90, level: 3, perWeek: 3, coaches: ["gael"], image: "floorDark",
    oneLine: t("Our signature 90-minute session: stretch, cardio, balance and fat-burn in one."),
    text: t("Gael's own format. You warm up and stretch, build stamina, work on balance, then finish with a fat-burning round. One class that trains everything."),
    photo: t("Akantu session on the floor"),
  },
  {
    slug: "traditional", name: t("Traditional Strength"), aka: t("Traditional class"), mins: 60, level: 3, perWeek: 2, coaches: ["emmanuel"], image: "coachDumbbells",
    oneLine: t("Lift weights with a coach who shows you how."),
    text: t("Free weights and the big lifts (squat, press, deadlift) in a small group. The coach corrects your form so you get strong safely."),
    photo: t("Coach with dumbbells"),
  },
  {
    slug: "abs", name: t("Abs & Core"), aka: t("Abs Condition"), mins: 60, level: 3, perWeek: 3, coaches: ["mido"], image: "floorPair",
    oneLine: t("Work your belly and back: a stronger middle, better posture."),
    text: t("Bodyweight and light-weight exercises for the middle of your body. Good for a flatter belly and fewer back aches."),
    photo: t("Core training"),
  },
  {
    slug: "boxing", name: t("Boxing"), mins: 60, level: 3, perWeek: 2, coaches: ["emmanuel"], image: "studioBag",
    oneLine: t("Punch pads and bags. Great for fitness and for stress."),
    text: t("Punch combinations, footwork and fitness rounds on pads and bags. Gloves at the desk. No fighting, no experience needed."),
    photo: t("Boxing bag in the studio"),
  },
  {
    slug: "aerobics", name: t("Aerobics"), mins: 30, level: 2, perWeek: 3, coaches: ["donyori"], image: "studioMural",
    oneLine: t("Move to music, burn calories, have fun."),
    text: t("Simple dance-style cardio that is easy to follow. Good for beginners and for losing weight."),
    photo: t("Aerobics studio"),
  },
  {
    slug: "steps", name: t("Step Aerobics"), aka: t("Steps"), mins: 45, level: 2, perWeek: 1, coaches: ["donyori"], image: "cardioRun",
    oneLine: t("Cardio on a low step, to music."),
    text: t("Step up and down a low platform to music. Strong legs, a strong heart, and easy to learn."),
    photo: t("Step class"),
  },
  {
    slug: "mobility", name: t("Mobility"), mins: 45, level: 2, perWeek: 3, coaches: ["tutor"], image: "stretching",
    oneLine: t("Gentle stretching: move better, feel less pain."),
    text: t("Slow stretching and joint work. Lower impact, good after a long day at a desk or a hard workout."),
    photo: t("Stretching on the mat"),
  },
  {
    slug: "bootcamp", name: t("Bootcamp"), mins: 60, level: 3, perWeek: 2, coaches: ["emmanuel", "gael"], image: "team",
    oneLine: t("A big group workout led by all our trainers."),
    text: t("Circuits, running and bodyweight work in a big, loud group. The Saturday class is led by the whole coaching team."),
    photo: t("Coaches and members together"),
  },
];

export const coaches: Coach[] = [
  {
    slug: "gael", name: t("Gael"), first: t("Gael"), role: t("Founder & head coach"), trainer: true,
    bio: t("More than 15 years in professional sports and fitness. Gael trained Miss Rwanda contestants, created the Akantu program and built Platinum Gym in Rebero."),
    specialties: [t("Akantu"), t("Fat loss"), t("Body transformation")],
  },
  {
    slug: "emmanuel", name: t("Emmanuel"), first: t("Emmanuel"), role: t("Coach · Strength & Boxing"), trainer: true,
    bio: t("Leads Traditional Strength, Boxing and the morning Bootcamp. Book a personal session for one-to-one help with lifting."),
    specialties: [t("Weights"), t("Boxing"), t("Muscle building")],
  },
  {
    slug: "mido", name: t("Mido"), first: t("Mido"), role: t("Coach · Abs & Core"), trainer: true,
    bio: t("Leads Abs & Core. Good with back aches, posture and getting a flatter belly safely."),
    specialties: [t("Core"), t("Posture"), t("Weight loss")],
  },
  {
    slug: "donyori", name: t("Donyori"), first: t("Donyori"), role: t("Coach · Aerobics & Step"), trainer: true,
    bio: t("Leads Aerobics and Step Aerobics: music, energy and classes anyone can follow."),
    specialties: [t("Cardio"), t("Weight loss"), t("Group energy")],
  },
  {
    slug: "tutor", name: t("Tutor"), first: t("Tutor"), role: t("Coach · Mobility"), trainer: true,
    bio: t("Leads Mobility. Helps you move without pain and recover between hard sessions."),
    specialties: [t("Stretching"), t("Recovery"), t("Beginners")],
  },
];

type Row = [time: string, type: string, coach: string, room: RoomKey, cap: number, booked: number, waiting?: number];
// Evening classes match the gym's current timetable; the morning sessions are added for the demo.
const weekRows: Row[][] = [
  [["06:00", "akantu", "gael", "floor", 15, 12], ["18:00", "traditional", "emmanuel", "floor", 15, 13], ["19:00", "aerobics", "donyori", "studio1", 20, 17]],
  [["06:00", "mobility", "tutor", "studio1", 15, 9], ["18:30", "abs", "mido", "studio1", 15, 15, 5], ["19:30", "abs", "mido", "studio1", 15, 11], ["20:00", "boxing", "emmanuel", "studio2", 12, 7]],
  [["06:00", "akantu", "gael", "floor", 15, 14], ["18:00", "traditional", "emmanuel", "floor", 15, 15, 2], ["19:00", "steps", "donyori", "studio1", 20, 12]],
  [["06:00", "bootcamp", "emmanuel", "turf", 30, 18], ["18:30", "mobility", "tutor", "studio1", 15, 8], ["19:30", "aerobics", "donyori", "studio1", 20, 14]],
  [["06:00", "akantu", "gael", "floor", 15, 11], ["18:30", "boxing", "emmanuel", "studio2", 12, 12, 2], ["19:30", "abs", "mido", "studio1", 15, 9]],
  [["07:30", "mobility", "tutor", "studio1", 15, 4], ["10:00", "bootcamp", "gael", "turf", 30, 24]],
  [["09:00", "aerobics", "donyori", "studio1", 20, 10]],
];

export const sessions: Session[] = weekRows.flatMap((rows, day) =>
  rows.map(([time, type, coach, room, cap, booked, waiting = 0]) => ({
    id: `${day}-${time.replace(":", "")}-${type}`,
    day, time, type, coach, room, cap, booked, waiting,
  })),
);

/** What every package includes (same for all, from the gym's website). */
export const benefits: Text[] = [
  t("All equipment, open 24 hours"),
  t("Every group class"),
  t("Sauna & steam room"),
  t("Showers & lockers"),
  t("Coaches on the floor"),
  t("Free WiFi and yoga mats"),
];

export const plans: Plan[] = [
  { id: "monthly", name: t("1 month"), price: 120000, best: false, per: t("Stop any month"), points: [t("Everything included")] },
  { id: "3m", name: t("3 months"), price: 300000, best: true, per: t("100,000 RWF a month"), points: [t("Everything included"), t("You save 60,000 RWF")] },
  { id: "6m", name: t("6 months"), price: 550000, best: false, per: t("About 92,000 RWF a month"), points: [t("Everything included"), t("You save 170,000 RWF")] },
  { id: "12m", name: t("12 months"), price: 1000000, best: false, per: t("About 83,000 RWF a month · 2,740 RWF a day"), points: [t("Everything included"), t("You save 440,000 RWF")] },
];

export const passes: Pass[] = [
  { name: t("Day pass"), note: t("The whole gym for one day, plus any class"), price: 10000 },
  { name: t("One class"), note: t("Aerobics and Mobility 7,000 RWF · other classes 10,000 RWF"), price: 7000 },
  { name: t("Couple, family or group of 5"), note: t("Train together and pay less per person"), price: 0 },
];

/** Kept for compatibility; the Memberships page now shows `benefits`. */
export const compareRows: CompareRow[] = [];

export const ptPackages: PtPackage[] = [
  { name: t("Single session"), price: 25000, per: t("per session"), note: t("Try it, or top up between packages.") },
  { name: t("5 sessions"), price: 115000, per: t("23,000 RWF each"), note: t("Use within 6 weeks.") },
  { name: t("10 sessions"), price: 210000, per: t("21,000 RWF each"), note: t("Use within 3 months. Includes a written plan.") },
];

export const faqs: Faq[] = [
  { q: t("Is the gym really open 24 hours?"), a: t("Yes, every day. Classes run in the evenings and on weekend mornings. Book a personal session if you want a coach at another time.") },
  { q: t("I have never trained before. Where do I start?"), a: t("Take the 3-question quiz on the home page. It tells you which program, class and package fit you, and a coach shows you around on your first visit.") },
  { q: t("Will lifting weights make women big and bulky?"), a: t("No. It is very hard for women to build big muscles. Weights make you firm and strong, and your body burns more calories even when you rest.") },
  { q: t("How do I pay?"), a: t("Cash, card, MTN MoMo or Airtel Money at the desk. Your receipt comes on WhatsApp.") },
  { q: t("Can I train with my partner or friends?"), a: t("Yes. Couple, family and group-of-5 packages cost less per person. Ask us for the price.") },
];

export const facilities: Facility[] = [
  { title: t("Weights floor"), text: t("Technogym machines, racks and free weights, for every level."), photo: t("Weights floor"), image: "floorWide" },
  { title: t("Cardio zone"), text: t("Treadmills, bikes and climbers by the windows."), photo: t("Cardio zone"), image: "cardioBikes" },
  { title: t("Studio"), text: t("Classes, stretching and the boxing bags."), photo: t("Studio"), image: "studioMural" },
  { title: t("Sauna & steam"), text: t("Relax your muscles after training. Included in every package."), photo: t("Sauna and steam room") },
  { title: t("Changing rooms"), text: t("Showers and lockers, with towels at the desk."), photo: t("Changing rooms") },
  { title: t("WiFi & drinks"), text: t("Free WiFi, yoga mats and refreshments on site."), photo: t("Reception"), image: "reception" },
];

/** The member page reached from WhatsApp links: /en/m/7KQ2 (sample member). */
export const demoMembers: DemoMember[] = [
  {
    code: "7KQ2",
    name: t("Sandrine Uwimana"),
    first: t("Sandrine"),
    plan: t("12 months · everything included"),
    ends: t("13 March 2027"),
    daysLeft: 109,
    ptLeft: 3,
    trainer: "emmanuel",
    bookings: [
      { id: "b1", when: t("Today · 19:30"), what: t("Abs & Core with Mido · Studio"), status: "booked" },
      { id: "b2", when: t("Fri 27 Nov · 18:30"), what: t("Boxing with Emmanuel · Boxing area"), status: "waitlist", place: 3 },
      { id: "b3", when: t("Sat 28 Nov · 08:00"), what: t("Personal training with Emmanuel"), status: "booked" },
    ],
  },
];
