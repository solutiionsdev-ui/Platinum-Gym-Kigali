"use client";

import clsx from "clsx";
import { CalendarCheck, CalendarPlus, Check, ChevronLeft, ChevronRight, Download, X } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { WhatsAppBubble } from "@/components/ui";
import { brand } from "@/lib/brand";
import { googleCalendarUrl, icsUrl } from "@/lib/calendar";
import {
  demoToday, getClassType, getClassTypes, getCoach, getRoomName, getSessions, getSessionsForDay, isFull, isPast, reminderTime, spotsLeft, weekDates,
} from "@/lib/data";
import { addWebBooking, useDemoData, withWebBookings } from "@/lib/demo-store";
import { getDict, type Lang } from "@/lib/i18n";
import type { Session } from "@/lib/types";

type Step = "form" | "done";

export function Timetable({ lang, initialType = "all", initialSession }: { lang: Lang; initialType?: string; initialSession?: string }) {
  const t = getDict(lang);
  const preselected = useMemo(() => getSessions().find((s) => s.id === initialSession && !isPast(s)), [initialSession]);
  const [day, setDay] = useState(preselected?.day ?? demoToday);
  const [filter, setFilter] = useState(getClassType(initialType) ? initialType : "all");
  const [selected, setSelected] = useState<Session | undefined>(preselected);
  const [step, setStep] = useState<Step>("form");
  // What the person typed, kept so the confirmation can use it and the next booking is pre-filled.
  const [person, setPerson] = useState<Person>({ name: "", trial: true, waitlist: false });
  // Bookings made on this website in this browser count too (the CRM sees the same ones).
  const web = useDemoData();
  const live = selected && withWebBookings(selected, web);

  const types = getClassTypes();
  const list = getSessionsForDay(day)
    .filter((s) => filter === "all" || s.type === filter)
    .map((s) => withWebBookings(s, web));

  function pick(s: Session) {
    // Keep the timetable's own numbers; website bookings are added on top when shown.
    setSelected(getSessions().find((x) => x.id === s.id));
    setStep("form");
  }

  return (
    <>
      {/* Class filter */}
      <div role="group" aria-label={t.timetable.filterLabel} className="mt-7 flex flex-wrap gap-2">
        {[{ slug: "all", label: t.timetable.allClasses }, ...types.map((c) => ({ slug: c.slug, label: c.name[lang] }))].map((f) => {
          const on = f.slug === filter;
          return (
            <button
              key={f.slug}
              type="button"
              aria-pressed={on}
              onClick={() => {
                setFilter(f.slug);
                setSelected(undefined);
              }}
              className={clsx(
                "min-h-11 rounded-full border px-[18px] text-[15px] font-semibold transition",
                on ? "border-accent bg-accent text-bg" : "border-line text-ink hover:border-control",
              )}
            >
              {f.label}
            </button>
          );
        })}
      </div>

      {/* Days */}
      <div role="tablist" aria-label={t.timetable.dayLabel} className="mt-6 flex gap-2 overflow-x-auto pb-1">
        {t.days.map((name, i) => {
          const on = i === day;
          return (
            <button
              key={name}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => {
                setDay(i);
                setSelected(undefined);
              }}
              className={clsx(
                "flex min-h-[68px] flex-[1_0_84px] flex-col items-center justify-center gap-0.5 rounded-2xl border transition",
                on ? "border-ink bg-ink text-bg" : "border-line bg-surface text-ink hover:border-control",
              )}
            >
              <span className="text-[13px] font-semibold uppercase tracking-[0.08em]">{name}</span>
              <span className="font-mono text-xl">{weekDates[i]}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-start gap-6">
        {/* Sessions */}
        <div className="flex min-w-0 flex-[999_1_600px] flex-col gap-2.5">
          {list.length === 0 && <div className="rounded-[18px] border border-dashed border-line p-10 text-center text-muted">{t.timetable.noClasses}</div>}
          {list.map((s) => {
            const type = getClassType(s.type)!;
            const coach = getCoach(s.coach)!;
            const left = spotsLeft(s);
            const full = isFull(s);
            const past = isPast(s);
            const isSel = selected?.id === s.id;
            return (
              <div
                key={s.id}
                className={clsx(
                  "flex flex-wrap items-center gap-x-6 gap-y-4 rounded-[18px] border bg-surface px-5 py-[18px]",
                  isSel ? "border-accent" : "border-line",
                  past && "opacity-55",
                )}
              >
                <div className="w-[84px]">
                  <div className="font-mono text-[22px]">{s.time}</div>
                  <div className="text-[13px] text-muted">{type.mins} {t.common.min}</div>
                </div>
                <div className="min-w-0 flex-[1_1_220px]">
                  <div className="text-[19px] font-semibold">{type.name[lang]}</div>
                  <div className="text-sm text-muted">
                    {t.common.with} {coach.first[lang]} · {getRoomName(s.room, lang)} · {t.levels[type.level]}
                  </div>
                </div>
                <div className="min-w-[150px] flex-[0_1_200px]">
                  <div className="h-1.5 overflow-hidden rounded-[3px] bg-line">
                    <div className={clsx("h-1.5", full || past ? "bg-faint" : "bg-accent")} style={{ width: `${Math.round((s.booked / s.cap) * 100)}%` }} />
                  </div>
                  <div className={clsx("mt-1.5 text-sm", full ? "text-muted" : left <= 3 ? "text-warn" : "text-ink-2")}>
                    {past ? t.timetable.finished : full ? t.fullWaitlist : t.spotsLeft(left, s.cap)}
                  </div>
                </div>
                {!past && (
                  <button
                    type="button"
                    onClick={() => pick(s)}
                    className={clsx(
                      "min-h-11 min-w-[132px] rounded-full border px-[18px] text-[15px] font-semibold transition",
                      isSel ? "border-accent bg-accent text-bg" : full ? "border-control text-ink hover:border-ink-2" : "border-ink bg-ink text-bg hover:bg-white",
                    )}
                  >
                    {isSel ? t.timetable.selected : full ? t.timetable.joinWaitlist : t.common.book}
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Booking panel: beside the list on big screens, a sheet from the bottom on phones */}
        <aside
          aria-label={t.timetable.formBook}
          className={clsx(
            "min-w-0 flex-[1_1_360px] rounded-[22px] border border-line bg-surface p-6",
            selected ? "max-lg:fixed max-lg:inset-x-0 max-lg:bottom-0 max-lg:z-50 max-lg:max-h-[88vh] max-lg:overflow-y-auto max-lg:rounded-b-none" : "max-lg:hidden",
          )}
        >
          {!selected && (
            <div className="flex flex-col items-start gap-3.5">
              <CalendarCheck aria-hidden className="size-8 text-accent" strokeWidth={1.8} />
              <h2 className="text-[22px] font-semibold">{t.timetable.pickTitle}</h2>
              <p className="text-muted">{t.timetable.pickText}</p>
            </div>
          )}
          {live && step === "form" && (
            <BookingForm
              lang={lang}
              session={live}
              initial={person}
              onClose={() => setSelected(undefined)}
              onDone={(p, phone) => {
                const b = addWebBooking({ sessionId: live.id, name: p.name, phone, trial: p.trial, waitlist: p.waitlist });
                // Each person gets their own private link in the WhatsApp message (made-up code in the demo).
                setPerson({ ...p, code: b.id.slice(0, 4).toUpperCase() });
                setStep("done");
              }}
            />
          )}
          {live && step === "done" && <Done lang={lang} session={live} person={person} onAnother={() => setSelected(undefined)} />}
        </aside>
        {selected && <div aria-hidden className="fixed inset-0 z-40 bg-black/60 lg:hidden" onClick={() => setSelected(undefined)} />}
      </div>
    </>
  );
}

type Person = { name: string; trial: boolean; waitlist: boolean; code?: string };

function BookingForm({
  lang, session, initial, onClose, onDone,
}: { lang: Lang; session: Session; initial: Person; onClose: () => void; onDone: (p: Person, phone: string) => void }) {
  const t = getDict(lang);
  const type = getClassType(session.type)!;
  const coach = getCoach(session.coach)!;
  const full = isFull(session);
  const [name, setName] = useState(initial.name);
  const [phone, setPhone] = useState("");
  const [trial, setTrial] = useState(initial.trial);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});

  // Close the phone sheet with Escape.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim() ? undefined : t.timetable.nameError,
      phone: phone.replace(/\D/g, "").length >= 7 ? undefined : t.timetable.phoneError,
    };
    setErrors(next);
    if (next.name || next.phone) return;
    onDone({ name: name.trim(), trial, waitlist: full }, phone.trim());
  }

  const field = "min-h-[50px] w-full rounded-[14px] border border-control bg-bg px-4 text-base text-ink placeholder:text-faint";
  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <div className="flex items-start justify-between gap-3">
        <div className="text-[13px] font-semibold uppercase tracking-[0.14em] text-accent">
          {full ? t.timetable.formWait : trial ? t.timetable.formTrial : t.timetable.formBook}
        </div>
        <button type="button" onClick={onClose} aria-label={t.timetable.close} className="-mt-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-line lg:hidden">
          <X aria-hidden className="size-[18px]" />
        </button>
      </div>
      <div className="mb-2 rounded-2xl border border-line bg-bg px-[18px] py-4">
        <div className="text-xl font-semibold">
          {type.name[lang]} {t.common.with} {coach.first[lang]}
        </div>
        <div className="text-[15px] text-muted">
          {t.daysLong[session.day]} {weekDates[session.day]} {t.month} · <span className="font-mono">{session.time}</span> · {getRoomName(session.room, lang)} · {type.mins} {t.common.min}
        </div>
      </div>

      <label htmlFor="b-name" className="text-sm font-semibold">{t.timetable.fullName}</label>
      <input id="b-name" type="text" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} placeholder={t.timetable.namePlaceholder}
        aria-invalid={!!errors.name} aria-describedby={errors.name ? "b-name-err" : undefined} className={field} />
      {errors.name && <p id="b-name-err" className="text-sm font-medium text-warn">{errors.name}</p>}

      <label htmlFor="b-phone" className="mt-2 text-sm font-semibold">{t.timetable.phone}</label>
      <input id="b-phone" type="tel" dir="ltr" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder={t.timetable.phonePlaceholder}
        aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "b-phone-err" : undefined} className={clsx(field, "font-mono rtl:text-right")} />
      {errors.phone && <p id="b-phone-err" className="text-sm font-medium text-warn">{errors.phone}</p>}

      <label htmlFor="b-trial" className="mt-1 flex min-h-11 cursor-pointer items-center gap-3 text-[15px]">
        <input id="b-trial" type="checkbox" checked={trial} onChange={(e) => setTrial(e.target.checked)} className="size-5 accent-[var(--accent)]" />
        {t.timetable.firstTime}
      </label>
      <button type="submit" className="min-h-[54px] rounded-full bg-accent text-[17px] font-semibold text-bg transition hover:brightness-95">
        {full ? t.timetable.joinWaitlist : t.timetable.confirm}
      </button>
      <p className="text-sm text-muted">{t.timetable.formNote}</p>
    </form>
  );
}

function Done({ lang, session, person, onAnother }: { lang: Lang; session: Session; person: Person; onAnother: () => void }) {
  const t = getDict(lang);
  const type = getClassType(session.type)!;
  const coach = getCoach(session.coach)!;
  // Whether this person went on the waitlist (the class may have filled up with their booking).
  const full = person.waitlist;
  const first = person.name.split(/\s+/)[0] || "Sandrine";
  const day = `${t.daysLong[session.day]} ${weekDates[session.day]} ${t.monthShort}`;
  const text = full
    ? t.timetable.waWait({ name: first, cls: type.name[lang], coach: coach.first[lang], day, time: session.time, place: Math.max(1, session.waiting) })
    : t.timetable.waBooked({
        name: first, cls: type.name[lang], coach: coach.first[lang], day, time: session.time, room: getRoomName(session.room, lang),
        trial: person.trial, link: `${brand.shortLink}/m/${person.code ?? "7KQ2"}`,
      });

  return (
    <div className="flex flex-col gap-4" aria-live="polite">
      <span className="flex size-12 items-center justify-center rounded-full bg-accent">
        <Check aria-hidden className="size-6 text-bg" strokeWidth={2.4} />
      </span>
      <h2 className="text-2xl font-semibold">{full ? t.timetable.doneWait : t.timetable.doneBooked}</h2>
      <p className="text-muted">{t.timetable.messageIntro(first)}</p>
      <WhatsAppBubble text={text} />
      <p className="text-sm text-muted">{full ? t.timetable.waitNote : t.timetable.reminderNote(reminderTime(session.time))}</p>
      {!full && (
        <div className="flex flex-col gap-2 rounded-2xl border border-line bg-bg p-4">
          <div className="text-sm font-semibold">Add it to your calendar</div>
          <div className="flex flex-wrap gap-2">
            <a href={googleCalendarUrl(session)} target="_blank" rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-ink px-4 text-[15px] font-semibold text-bg transition hover:bg-white">
              <CalendarPlus aria-hidden className="size-[18px]" /> Google Calendar
            </a>
            <a href={icsUrl(session)} download
              className="inline-flex min-h-11 items-center gap-2 rounded-full border border-control px-4 text-[15px] font-semibold transition hover:border-ink-2">
              <Download aria-hidden className="size-[18px]" /> iPhone / Outlook
            </a>
          </div>
        </div>
      )}
      <button type="button" onClick={onAnother} className="min-h-12 rounded-full border border-control font-semibold transition hover:border-ink-2">
        {t.timetable.bookAnother}
      </button>
    </div>
  );
}

export function WeekNav({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <div className="flex items-center gap-2">
      <button type="button" aria-label={t.timetable.prevWeek} className="inline-flex size-11 items-center justify-center rounded-full border border-line">
        <ChevronLeft aria-hidden className="size-[18px] rtl:-scale-x-100" />
      </button>
      <span className="px-1.5 text-[15px] font-semibold">{t.timetable.thisWeek}</span>
      <button type="button" aria-label={t.timetable.nextWeek} className="inline-flex size-11 items-center justify-center rounded-full border border-line">
        <ChevronRight aria-hidden className="size-[18px] rtl:-scale-x-100" />
      </button>
    </div>
  );
}
