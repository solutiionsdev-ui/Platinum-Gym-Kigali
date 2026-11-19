import type { Metadata } from "next";
import { ScheduleView, type ScheduleSession } from "@/components/crm/schedule-view";
import { DemoButton } from "@/components/crm/shell";
import { PageHead, button } from "@/components/crm/ui";
import { DEMO_TIME, getRoster } from "@/lib/crm-data";
import { demoToday, getClassType, getCoach, getRoomName, getSessions, isFull } from "@/lib/data";

export const metadata: Metadata = { title: "Schedule" };

export default function SchedulePage() {
  const [nh, nm] = DEMO_TIME.split(":").map(Number);
  const now = nh * 60 + nm;
  const sessions: ScheduleSession[] = getSessions().map((s) => {
    const type = getClassType(s.type)!;
    const [h, m] = s.time.split(":").map(Number);
    const start = h * 60 + m;
    const state: ScheduleSession["state"] =
      s.day < demoToday || (s.day === demoToday && start + type.mins <= now) ? "done" : s.day === demoToday && start <= now ? "now" : isFull(s) ? "full" : "later";
    const people = getRoster(s.id, s.booked + s.waiting);
    return {
      id: s.id,
      day: s.day,
      time: s.time,
      name: type.name.en,
      coach: getCoach(s.coach)?.name.en ?? "",
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

  return (
    <>
      <PageHead title="Schedule" sub="Week of 23 – 29 November · same timetable the website shows">
        <DemoButton message="New class form: type, coach, room, time, repeat weekly" className={button.primary}>Add a class</DemoButton>
      </PageHead>
      <ScheduleView sessions={sessions} today={demoToday} />
    </>
  );
}
