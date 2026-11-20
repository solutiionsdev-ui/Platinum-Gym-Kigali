import { RefreshCw } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { CalendarView, type CalClass, type CalPt } from "@/components/crm/calendar-view";
import { DemoButton } from "@/components/crm/shell";
import { PageHead, button } from "@/components/crm/ui";
import { DEMO_TIME, getPtWeek, getRoster } from "@/lib/crm-data";
import { toMinutes } from "@/lib/calendar";
import { demoToday, getClassType, getCoach, getRoomName, getSessions, getTrainers, isFull } from "@/lib/data";

export const metadata: Metadata = { title: "Calendar" };

export default async function CalendarPage({ searchParams }: { searchParams: Promise<{ session?: string }> }) {
  const { session } = await searchParams;
  const now = toMinutes(DEMO_TIME);
  const classes: CalClass[] = getSessions().map((s) => {
    const type = getClassType(s.type)!;
    const start = toMinutes(s.time);
    const state: CalClass["state"] =
      s.day < demoToday || (s.day === demoToday && start + type.mins <= now) ? "done" : s.day === demoToday && start <= now ? "now" : isFull(s) ? "full" : "later";
    const people = getRoster(s.id, s.booked + s.waiting);
    return {
      id: s.id,
      day: s.day,
      time: s.time,
      name: type.name.en,
      coach: getCoach(s.coach)?.name.en ?? "",
      coachSlug: s.coach,
      room: getRoomName(s.room, "en"),
      mins: type.mins,
      booked: s.booked,
      cap: s.cap,
      waiting: s.waiting,
      state,
      roster: people.slice(0, s.booked).map((p, i) => ({ id: p.id, name: p.name, noShow: state === "done" && i % 9 === 4 })),
      waitlist: people.slice(s.booked).map((p) => p.name),
    };
  });
  const pt: CalPt[] = getPtWeek().map((p) => ({ ...p, trainerSlug: p.trainer, trainer: getCoach(p.trainer)?.first.en ?? p.trainer }));
  const coaches = getTrainers().map((c) => ({ slug: c.slug, name: c.name.en }));

  return (
    <>
      <PageHead title="Calendar" sub="Week of 23 – 29 November · classes and personal training · website bookings appear live">
        <Link href="/admin/settings#calendar" className={button.secondary}>
          <RefreshCw aria-hidden className="size-4" /> Google Calendar sync
        </Link>
        <DemoButton message="New class form: type, coach, room, time, repeat weekly. It shows on the website timetable straight away." className={button.primary}>
          Add a class
        </DemoButton>
      </PageHead>
      <CalendarView classes={classes} pt={pt} today={demoToday} nowMin={now} coaches={coaches} initialSession={session} />
    </>
  );
}
