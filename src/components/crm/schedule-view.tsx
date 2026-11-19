"use client";

import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Bar, Chip, button } from "./ui";
import { useToast } from "./toast";

export type ScheduleSession = {
  id: string;
  day: number;
  time: string;
  name: string;
  coach: string;
  room: string;
  mins: number;
  booked: number;
  cap: number;
  waiting: number;
  state: "done" | "now" | "later" | "full";
  roster: { id: string; name: string; noShow: boolean }[];
  waitlist: string[];
};

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DATES = [23, 24, 25, 26, 27, 28, 29];
const STATE = {
  done: { label: "Done", cls: "bg-neutral-bg text-neutral" },
  now: { label: "Now", cls: "bg-ok-bg text-ok" },
  full: { label: "Full", cls: "bg-warn-bg text-warn" },
  later: { label: "Upcoming", cls: "bg-soft text-later" },
};

export function ScheduleView({ sessions, today }: { sessions: ScheduleSession[]; today: number }) {
  const toast = useToast();
  const [day, setDay] = useState(today);
  const list = sessions.filter((s) => s.day === day);
  const booked = list.reduce((n, s) => n + s.booked, 0);
  const cap = list.reduce((n, s) => n + s.cap, 0);

  return (
    <>
      <div role="tablist" aria-label="Day" className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d, i) => (
          <button
            key={d}
            type="button"
            role="tab"
            aria-selected={i === day}
            onClick={() => setDay(i)}
            className={clsx(
              "flex min-h-[60px] flex-[1_0_76px] flex-col items-center justify-center rounded-xl border transition",
              i === day ? "border-ink bg-ink text-white" : "border-border bg-surface hover:border-bar-muted",
            )}
          >
            <span className="text-[13px] font-semibold">{d}{i === today ? " · today" : ""}</span>
            <span className="font-mono text-lg">{DATES[i]}</span>
          </button>
        ))}
      </div>

      <div className="text-muted">
        {list.length} classes · {booked} of {cap} spots booked ({cap ? Math.round((booked / cap) * 100) : 0}%)
      </div>

      <div className="flex flex-col gap-2.5">
        {list.map((s) => (
          <details key={s.id} className="group rounded-[14px] border border-border bg-surface">
            <summary className="flex cursor-pointer flex-wrap items-center gap-x-5 gap-y-2 px-5 py-3.5">
              <span className={clsx("w-[52px] font-mono text-lg", s.state === "done" && "text-muted")}>{s.time}</span>
              <span className="min-w-0 flex-[1_1_200px]">
                <span className="block font-semibold">{s.name}</span>
                <span className="block text-sm text-muted">{s.coach} · {s.room} · {s.mins} min</span>
              </span>
              <span className="w-[160px]">
                <Bar pct={(s.booked / s.cap) * 100} cls={s.booked >= s.cap ? "bg-warn" : "bg-ink"} />
                <span className="mt-1 block font-mono text-[13px] text-ink-2">
                  {s.booked}/{s.cap}{s.waiting > 0 ? ` · ${s.waiting} waiting` : ""}
                </span>
              </span>
              <Chip cls={STATE[s.state].cls}>{STATE[s.state].label}</Chip>
              <ChevronDown aria-hidden className="size-5 text-muted transition group-open:rotate-180" />
            </summary>
            <div className="border-t border-divider px-5 py-4">
              <div className="mb-3 flex flex-wrap gap-2">
                {s.state !== "done" && (
                  <>
                    <button type="button" onClick={() => toast(`WhatsApp message sent to the ${s.booked} people booked in ${s.time} ${s.name}`)} className={button.small}>
                      Message the class
                    </button>
                    <button type="button" onClick={() => toast(`${s.time} ${s.name} cancelled. ${s.booked} members got a WhatsApp message with other classes to pick.`)} className={button.small}>
                      Cancel class
                    </button>
                  </>
                )}
                {s.state === "done" && <span className="text-sm text-muted">Attendance taken by {s.coach}.</span>}
              </div>
              <div className="text-[13px] font-semibold text-muted">Booked ({s.roster.length})</div>
              <ul className="mt-1.5 grid gap-x-6 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
                {s.roster.map((r) => (
                  <li key={r.id} className="flex min-h-9 items-center justify-between gap-2 border-b border-divider text-sm">
                    <Link href={`/admin/members/${r.id}`} className="truncate hover:underline">{r.name}</Link>
                    {s.state === "done" && <span className={clsx("text-xs", r.noShow ? "text-bad" : "text-ok")}>{r.noShow ? "No-show" : "Came"}</span>}
                  </li>
                ))}
              </ul>
              {s.waitlist.length > 0 && (
                <>
                  <div className="mt-3 text-[13px] font-semibold text-muted">Waitlist</div>
                  <ol className="mt-1 list-inside list-decimal text-sm">
                    {s.waitlist.map((w) => <li key={w}>{w}</li>)}
                  </ol>
                </>
              )}
            </div>
          </details>
        ))}
      </div>
    </>
  );
}
