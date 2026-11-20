"use client";

import clsx from "clsx";
import { CalendarDays, Dumbbell, ExternalLink, Globe, ListOrdered, X } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { fromMinutes, toMinutes } from "@/lib/calendar";
import { timeAgo, useDemoData, withWebBookings, type DemoData } from "@/lib/demo-store";
import { useToast } from "./toast";
import { Bar, Chip, button } from "./ui";
import { useTick } from "./web-activity";

export type CalClass = {
  id: string;
  day: number;
  time: string;
  name: string;
  coach: string;
  coachSlug: string;
  room: string;
  mins: number;
  booked: number;
  cap: number;
  waiting: number;
  state: "done" | "now" | "later" | "full";
  roster: { id: string; name: string; noShow: boolean }[];
  waitlist: string[];
};

export type CalPt = { id: string; day: number; time: string; mins: number; member: string; memberId: string; trainer: string; trainerSlug: string; note: string; done: boolean };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYS_LONG = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const DATES = [23, 24, 25, 26, 27, 28, 29];
const HOUR_PX = 56;
const STATE = {
  done: { label: "Done", cls: "bg-neutral-bg text-neutral" },
  now: { label: "Now", cls: "bg-ok-bg text-ok" },
  full: { label: "Full", cls: "bg-warn-bg text-warn" },
  later: { label: "Upcoming", cls: "bg-soft text-later" },
};

type Ev =
  | { kind: "class"; id: string; day: number; start: number; end: number; c: CalClass; web: number }
  | { kind: "pt"; id: string; day: number; start: number; end: number; p: CalPt };

/** Class numbers after website bookings made in this browser. */
function liveClass(c: CalClass, data: DemoData): CalClass {
  const live = withWebBookings(c, data);
  if (live === c) return c;
  return { ...live, state: c.state === "later" && live.booked >= live.cap ? "full" : c.state };
}

/** Side by side when events overlap (e.g. a PT session during a class). */
function layout(evts: Ev[]) {
  const sorted = [...evts].sort((a, b) => a.start - b.start || b.end - a.end);
  const out: { e: Ev; lane: number; lanes: number }[] = [];
  let cluster: Ev[] = [];
  let clusterEnd = -1;
  const flush = () => {
    const laneEnds: number[] = [];
    const placed = cluster.map((e) => {
      let lane = laneEnds.findIndex((end) => end <= e.start);
      if (lane === -1) {
        lane = laneEnds.length;
        laneEnds.push(e.end);
      } else laneEnds[lane] = e.end;
      return { e, lane };
    });
    for (const p of placed) out.push({ ...p, lanes: laneEnds.length });
    cluster = [];
    clusterEnd = -1;
  };
  for (const e of sorted) {
    if (cluster.length && e.start >= clusterEnd) flush();
    cluster.push(e);
    clusterEnd = Math.max(clusterEnd, e.end);
  }
  if (cluster.length) flush();
  return out;
}

export function CalendarView({
  classes, pt, today, nowMin, coaches, initialSession,
}: { classes: CalClass[]; pt: CalPt[]; today: number; nowMin: number; coaches: { slug: string; name: string }[]; initialSession?: string }) {
  const data = useDemoData();
  useTick();
  const initial = classes.find((c) => c.id === initialSession);
  const [view, setView] = useState<"week" | "day">("week");
  const [day, setDay] = useState(initial?.day ?? today);
  const [coach, setCoach] = useState("all");
  const [show, setShow] = useState({ classes: true, pt: true });
  const [selected, setSelected] = useState<string | undefined>(initial?.id);

  // Phones start on the day list; the week grid is easier on a bigger screen.
  useEffect(() => {
    if (window.matchMedia("(max-width: 767px)").matches) setView("day");
  }, []);

  const events = useMemo<Ev[]>(() => {
    const list: Ev[] = [];
    if (show.classes) {
      for (const c of classes) {
        if (coach !== "all" && c.coachSlug !== coach) continue;
        const live = liveClass(c, data);
        const start = toMinutes(c.time);
        list.push({ kind: "class", id: c.id, day: c.day, start, end: start + c.mins, c: live, web: data.bookings.filter((b) => b.sessionId === c.id).length });
      }
    }
    if (show.pt) {
      for (const p of pt) {
        if (coach !== "all" && p.trainerSlug !== coach) continue;
        const start = toMinutes(p.time);
        list.push({ kind: "pt", id: p.id, day: p.day, start, end: start + p.mins, p });
      }
    }
    return list;
  }, [classes, pt, data, coach, show]);

  const first = Math.floor(Math.min(...classes.map((c) => toMinutes(c.time)), ...pt.map((p) => toMinutes(p.time))) / 60);
  const last = Math.ceil(Math.max(...classes.map((c) => toMinutes(c.time) + c.mins), ...pt.map((p) => toMinutes(p.time) + p.mins)) / 60);
  const hours = Array.from({ length: last - first }, (_, i) => first + i);
  const sel = events.find((e) => e.id === selected);

  const weekClasses = events.filter((e) => e.kind === "class") as Extract<Ev, { kind: "class" }>[];
  const booked = weekClasses.reduce((n, e) => n + e.c.booked, 0);
  const cap = weekClasses.reduce((n, e) => n + e.c.cap, 0);
  const webCount = data.bookings.length;

  return (
    <>
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div role="tablist" aria-label="View" className="inline-flex rounded-[10px] border border-border bg-surface p-1">
          {(["week", "day"] as const).map((v) => (
            <button key={v} type="button" role="tab" aria-selected={view === v} onClick={() => setView(v)}
              className={clsx("h-9 rounded-[7px] px-4 text-sm font-semibold transition", view === v ? "bg-side text-white" : "text-ink-2 hover:text-ink")}>
              {v === "week" ? "Week" : "Day"}
            </button>
          ))}
        </div>
        <label className="sr-only" htmlFor="cal-coach">Coach</label>
        <select id="cal-coach" value={coach} onChange={(e) => setCoach(e.target.value)} className="h-11 rounded-[10px] border border-border bg-surface px-3 font-medium">
          <option value="all">All coaches</option>
          {coaches.map((c) => <option key={c.slug} value={c.slug}>{c.name}</option>)}
        </select>
        {([["classes", "Classes", CalendarDays], ["pt", "Personal training", Dumbbell]] as const).map(([k, label, Icon]) => (
          <button key={k} type="button" aria-pressed={show[k]} onClick={() => setShow((s) => ({ ...s, [k]: !s[k] }))}
            className={clsx("inline-flex h-11 items-center gap-2 rounded-[10px] border px-3.5 text-sm font-semibold transition",
              show[k] ? "border-ink bg-surface text-ink" : "border-border bg-transparent text-muted line-through")}>
            <Icon aria-hidden className="size-4" /> {label}
          </button>
        ))}
        <span className="ms-auto text-sm text-muted">
          {weekClasses.length} classes · {events.length - weekClasses.length} PT · {booked}/{cap} spots booked ({cap ? Math.round((booked / cap) * 100) : 0}%)
          {webCount > 0 && <> · <strong className="text-ink">{webCount} from the website</strong></>}
        </span>
      </div>

      {view === "week" ? (
        <div className="overflow-x-auto rounded-[14px] border border-border bg-surface">
          <div className="min-w-[960px]">
            {/* Day headers */}
            <div className="sticky top-0 z-10 grid grid-cols-[56px_repeat(7,minmax(0,1fr))] border-b border-divider bg-surface">
              <div />
              {DAYS.map((d, i) => (
                <button key={d} type="button" onClick={() => { setDay(i); setView("day"); }}
                  className="flex flex-col items-center gap-0.5 border-s border-divider py-2.5 hover:bg-bg" aria-label={`${DAYS_LONG[i]} ${DATES[i]} November, open the day`}>
                  <span className={clsx("text-xs font-semibold uppercase tracking-[0.08em]", i === today ? "text-ink" : "text-muted")}>{d}</span>
                  <span className={clsx("flex size-8 items-center justify-center rounded-full font-mono text-[15px]", i === today ? "bg-accent font-semibold text-ink" : "text-ink-2")}>{DATES[i]}</span>
                </button>
              ))}
            </div>
            {/* Grid */}
            <div className="relative grid grid-cols-[56px_repeat(7,minmax(0,1fr))]" style={{ height: hours.length * HOUR_PX }}>
              <div className="relative">
                {hours.map((h, i) => (
                  <span key={h} className="absolute end-2 -translate-y-1/2 font-mono text-[11px] text-muted" style={{ top: i * HOUR_PX }}>
                    {i === 0 ? "" : `${String(h).padStart(2, "0")}:00`}
                  </span>
                ))}
              </div>
              {DAYS.map((d, i) => (
                <div key={d} className={clsx("relative border-s border-divider", i === today && "bg-accent/[0.06]")}>
                  {hours.map((h, j) => (
                    <div key={h} aria-hidden className="absolute inset-x-0 border-t border-divider" style={{ top: j * HOUR_PX }} />
                  ))}
                  {layout(events.filter((e) => e.day === i)).map(({ e, lane, lanes }) => (
                    <EventBlock key={e.id} e={e} lane={lane} lanes={lanes} top={((e.start - first * 60) * HOUR_PX) / 60} on={selected === e.id} onClick={() => setSelected(e.id)} />
                  ))}
                  {i === today && nowMin > first * 60 && nowMin < last * 60 && (
                    <div aria-label={`Now, ${fromMinutes(nowMin)}`} className="pointer-events-none absolute inset-x-0 z-10 flex items-center" style={{ top: ((nowMin - first * 60) * HOUR_PX) / 60 }}>
                      <span className="-ms-1 size-2.5 rounded-full bg-ink" />
                      <span className="h-0.5 flex-1 bg-ink" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <DayList day={day} setDay={setDay} today={today} events={events.filter((e) => e.day === day)} onPick={setSelected} />
      )}

      <p className="flex flex-wrap items-center gap-x-5 gap-y-1 text-[13px] text-muted">
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1 rounded-full bg-accent" /> Class</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1 rounded-full bg-warn" /> Full</span>
        <span className="inline-flex items-center gap-1.5"><span className="h-3 w-1 rounded-full bg-side" /> Personal training</span>
        <span className="inline-flex items-center gap-1.5"><Globe aria-hidden className="size-3.5" /> Booked on the website</span>
      </p>

      {sel && <Panel e={sel} data={data} onClose={() => setSelected(undefined)} />}
    </>
  );
}

function EventBlock({ e, lane, lanes, top, on, onClick }: { e: Ev; lane: number; lanes: number; top: number; on: boolean; onClick: () => void }) {
  const height = ((e.end - e.start) * HOUR_PX) / 60 - 3;
  const isClass = e.kind === "class";
  const done = isClass ? e.c.state === "done" : e.p.done;
  const full = isClass && e.c.booked >= e.c.cap;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={on}
      className={clsx(
        "absolute z-[1] flex flex-col overflow-hidden rounded-md border border-s-[3px] px-1.5 py-1 text-start leading-tight transition hover:z-[2] hover:shadow-md",
        isClass ? "border-border bg-surface" : "border-transparent bg-[#ecebe5]",
        isClass ? (full ? "border-s-warn" : "border-s-accent") : "border-s-side",
        done && "opacity-55",
        on && "ring-2 ring-ink",
      )}
      style={{ top: top + 1, height, left: `calc(${(lane / lanes) * 100}% + 2px)`, width: `calc(${100 / lanes}% - 4px)` }}
    >
      <span className={clsx("flex min-w-0 items-center gap-1 font-mono text-[11px] text-muted", height < 34 && "-mt-0.5")}>
        <span className="shrink-0">{fromMinutes(e.start)}</span>
        {isClass && e.web > 0 && (
          <span className="inline-flex shrink-0 items-center gap-0.5 rounded bg-accent px-1 font-sans text-[10px] font-bold text-ink">
            <Globe aria-hidden className="size-2.5" />{e.web}
          </span>
        )}
        {/* Short sessions (30 min): name on the same line as the time */}
        {height < 34 && <span className="truncate font-sans text-[12px] font-semibold text-ink">{isClass ? e.c.name : `PT · ${e.p.member.split(" ")[0]}`}</span>}
      </span>
      {height >= 34 && <span className="truncate text-[12px] font-semibold">{isClass ? e.c.name : `PT · ${e.p.member.split(" ")[0]}`}</span>}
      {height > 40 && (
        <span className="truncate text-[11px] text-muted">
          {isClass ? `${e.c.coach.split(" ")[0]} · ${e.c.booked}/${e.c.cap}` : e.p.trainer}
        </span>
      )}
    </button>
  );
}

function DayList({ day, setDay, today, events, onPick }: { day: number; setDay: (d: number) => void; today: number; events: Ev[]; onPick: (id: string) => void }) {
  const list = [...events].sort((a, b) => a.start - b.start);
  return (
    <>
      <div role="tablist" aria-label="Day" className="flex gap-2 overflow-x-auto pb-1">
        {DAYS.map((d, i) => (
          <button key={d} type="button" role="tab" aria-selected={i === day} onClick={() => setDay(i)}
            className={clsx("flex min-h-[60px] flex-[1_0_76px] flex-col items-center justify-center rounded-xl border transition",
              i === day ? "border-side bg-side text-white" : "border-border bg-surface hover:border-bar-muted")}>
            <span className="text-[13px] font-semibold">{d}{i === today ? " · today" : ""}</span>
            <span className={clsx("font-mono text-lg", i === day && "text-accent")}>{DATES[i]}</span>
          </button>
        ))}
      </div>
      <div className="flex flex-col gap-2.5">
        {list.length === 0 && <div className="rounded-[14px] border border-dashed border-border p-8 text-center text-muted">Nothing on this day with these filters.</div>}
        {list.map((e) =>
          e.kind === "class" ? (
            <button key={e.id} type="button" onClick={() => onPick(e.id)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[14px] border border-border border-s-[4px] border-s-accent bg-surface px-5 py-3.5 text-start hover:border-bar-muted">
              <span className={clsx("w-[52px] font-mono text-lg", e.c.state === "done" && "text-muted")}>{e.c.time}</span>
              <span className="min-w-0 flex-[1_1_200px]">
                <span className="block font-semibold">{e.c.name}{e.web > 0 && <span className="ms-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-ink">+{e.web} website</span>}</span>
                <span className="block text-sm text-muted">{e.c.coach} · {e.c.room} · {e.c.mins} min</span>
              </span>
              <span className="w-[150px]">
                <Bar pct={(e.c.booked / e.c.cap) * 100} cls={e.c.booked >= e.c.cap ? "bg-warn" : "bg-ink"} />
                <span className="mt-1 block font-mono text-[13px] text-ink-2">{e.c.booked}/{e.c.cap}{e.c.waiting > 0 ? ` · ${e.c.waiting} waiting` : ""}</span>
              </span>
              <Chip cls={STATE[e.c.state].cls}>{STATE[e.c.state].label}</Chip>
            </button>
          ) : (
            <button key={e.id} type="button" onClick={() => onPick(e.id)}
              className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-[14px] border border-border border-s-[4px] border-s-side bg-surface px-5 py-3.5 text-start hover:border-bar-muted">
              <span className={clsx("w-[52px] font-mono text-lg", e.p.done && "text-muted")}>{e.p.time}</span>
              <span className="min-w-0 flex-[1_1_200px]">
                <span className="block font-semibold">PT · {e.p.member}</span>
                <span className="block text-sm text-muted">with {e.p.trainer} · {e.p.note}</span>
              </span>
              <Chip cls={e.p.done ? "bg-neutral-bg text-neutral" : "bg-soft text-later"}>{e.p.done ? "Done" : "Upcoming"}</Chip>
            </button>
          ),
        )}
      </div>
    </>
  );
}

/** Details of a class or PT session, opened from the calendar. */
function Panel({ e, data, onClose }: { e: Ev; data: DemoData; onClose: () => void }) {
  const toast = useToast();
  useEffect(() => {
    const onKey = (k: KeyboardEvent) => k.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  const when = `${DAYS_LONG[e.day]} ${DATES[e.day]} Nov · ${fromMinutes(e.start)}–${fromMinutes(e.end)}`;

  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label={e.kind === "class" ? e.c.name : `Personal training with ${e.p.member}`}>
      <div aria-hidden className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="absolute inset-y-0 end-0 flex w-full max-w-[420px] flex-col overflow-y-auto bg-surface shadow-2xl">
        <div className="flex items-start justify-between gap-3 border-b border-divider px-5 py-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">{e.kind === "class" ? "Class" : "Personal training"}</div>
            <h2 className="text-xl font-semibold">{e.kind === "class" ? e.c.name : e.p.member}</h2>
            <div className="text-sm text-muted">{when}</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="inline-flex size-10 shrink-0 items-center justify-center rounded-full border border-border">
            <X aria-hidden className="size-[18px]" />
          </button>
        </div>

        {e.kind === "class" ? (
          <ClassDetail e={e} data={data} toast={toast} />
        ) : (
          <div className="flex flex-col gap-4 px-5 py-4">
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div><dt className="text-muted">Trainer</dt><dd className="font-semibold">{e.p.trainer}</dd></div>
              <div><dt className="text-muted">Status</dt><dd className="font-semibold">{e.p.done ? "Done" : "Upcoming"}</dd></div>
              <div className="col-span-2"><dt className="text-muted">Note</dt><dd>{e.p.note}</dd></div>
            </dl>
            <div className="flex flex-wrap gap-2">
              <Link href={`/admin/members/${e.p.memberId}`} className={button.secondary}>Open {e.p.member.split(" ")[0]}&apos;s page</Link>
              {!e.p.done && (
                <>
                  <button type="button" className={button.small} onClick={() => toast(`Reminder sent to ${e.p.member} on WhatsApp`)}>Send reminder</button>
                  <button type="button" className={button.small} onClick={() => toast(`Move session: pick a new time. ${e.p.member} and ${e.p.trainer} get a WhatsApp message.`)}>Move</button>
                </>
              )}
            </div>
            <p className="text-[13px] text-muted">With Google Calendar sync on, this session is also in {e.p.trainer}&apos;s calendar.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ClassDetail({ e, data, toast }: { e: Extract<Ev, { kind: "class" }>; data: DemoData; toast: (t: string) => void }) {
  const c = e.c;
  // Same rule as withWebBookings: website bookings take the free spots in order, the rest wait.
  let spots = c.booked - c.roster.length;
  const webBookedIn: DemoData["bookings"] = [];
  const webWaiting: DemoData["bookings"] = [];
  for (const b of data.bookings.filter((x) => x.sessionId === c.id)) {
    if (!b.waitlist && spots > 0) {
      webBookedIn.push(b);
      spots--;
    } else webWaiting.push(b);
  }
  return (
    <div className="flex flex-col gap-4 px-5 py-4">
      <div className="flex items-center gap-2 text-sm text-ink-2">
        <span>with <strong>{c.coach}</strong> · {c.room}</span>
        <Chip cls={STATE[c.state].cls}>{STATE[c.state].label}</Chip>
      </div>
      <div>
        <Bar pct={(c.booked / c.cap) * 100} cls={c.booked >= c.cap ? "bg-warn" : "bg-ink"} />
        <div className="mt-1.5 font-mono text-sm">{c.booked}/{c.cap} booked{c.waiting > 0 ? ` · ${c.waiting} waiting` : ""}</div>
      </div>
      {c.state !== "done" && (
        <div className="flex flex-wrap gap-2">
          <button type="button" className={button.small} onClick={() => toast(`WhatsApp message sent to the ${c.booked} people booked in ${c.time} ${c.name}`)}>Message the class</button>
          <button type="button" className={button.small} onClick={() => toast(`Add a member to ${c.time} ${c.name}: search by name or phone`)}>Add a member</button>
          <button type="button" className={button.small} onClick={() => toast(`${c.time} ${c.name} cancelled. ${c.booked} members got a WhatsApp message with other classes to pick.`)}>Cancel class</button>
        </div>
      )}

      <div>
        <div className="text-[13px] font-semibold text-muted">Booked ({c.booked})</div>
        <ul className="mt-1.5">
          {webBookedIn.map((b) => (
            <li key={b.id} className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-b border-divider bg-accent/10 px-2 text-sm">
              <span className="font-medium">{b.name} <span className="font-mono text-xs text-muted">{b.phone}</span></span>
              <span className="flex items-center gap-1.5">
                {b.trial && <Chip cls="bg-trial-bg text-trial">First visit</Chip>}
                <span className="inline-flex items-center gap-1 text-xs font-semibold"><Globe aria-hidden className="size-3.5" /> Website · {timeAgo(b.at)}</span>
              </span>
            </li>
          ))}
          {c.roster.map((r) => (
            <li key={r.id} className="flex min-h-10 items-center justify-between gap-2 border-b border-divider px-2 text-sm">
              <Link href={`/admin/members/${r.id}`} className="truncate hover:underline">{r.name}</Link>
              {c.state === "done" && <span className={clsx("text-xs", r.noShow ? "text-bad" : "text-ok")}>{r.noShow ? "No-show" : "Came"}</span>}
            </li>
          ))}
        </ul>
      </div>

      {(c.waitlist.length > 0 || webWaiting.length > 0) && (
        <div>
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-muted"><ListOrdered aria-hidden className="size-4" /> Waitlist ({c.waiting})</div>
          <ol className="mt-1 list-inside list-decimal text-sm">
            {c.waitlist.map((w) => <li key={w} className="py-1">{w}</li>)}
            {webWaiting.map((b) => (
              <li key={b.id} className="bg-accent/10 py-1">
                {b.name} <span className="text-xs font-semibold"><Globe aria-hidden className="inline size-3.5" /> Website</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <Link href={`/en/classes?session=${encodeURIComponent(c.id)}`} target="_blank" className="inline-flex items-center gap-1.5 text-sm font-semibold text-link hover:underline">
        See this class on the website <ExternalLink aria-hidden className="size-3.5" />
      </Link>
    </div>
  );
}
