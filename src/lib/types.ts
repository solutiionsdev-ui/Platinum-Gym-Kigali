import type { Text } from "./i18n";

export type Level = 1 | 2 | 3;
export type RoomKey = "studio1" | "studio2" | "floor" | "turf";

export type ClassType = {
  slug: string;
  name: Text;
  mins: number;
  level: Level;
  perWeek: number;
  text: Text;
  photo: Text;
  coaches: string[];
};

export type Coach = {
  slug: string;
  name: Text;
  first: Text;
  role: Text;
  bio: Text;
  specialties: Text[];
  /** Offers one-to-one personal training. */
  trainer: boolean;
};

export type Session = {
  id: string;
  /** 0 = Monday … 6 = Sunday of the demo week (23 – 29 November). */
  day: number;
  time: string;
  type: string;
  coach: string;
  room: RoomKey;
  cap: number;
  booked: number;
  /** People already waiting when the class is full. */
  waiting: number;
};

export type Plan = {
  id: string;
  name: Text;
  price: number;
  per: Text;
  points: Text[];
  best: boolean;
};

export type Pass = { name: Text; note: Text; price: number };
export type CompareRow = { label: Text; values: [Text, Text, Text, Text] };
export type PtPackage = { name: Text; price: number; per: Text; note: Text };
export type Faq = { q: Text; a: Text };
export type Facility = { title: Text; text: Text; photo: Text };

export type MemberBooking = {
  id: string;
  when: Text;
  what: Text;
  status: "booked" | "waitlist";
  place?: number;
};

export type DemoMember = {
  code: string;
  name: Text;
  first: Text;
  plan: Text;
  ends: Text;
  daysLeft: number;
  ptLeft: number;
  trainer: string;
  bookings: MemberBooking[];
};
