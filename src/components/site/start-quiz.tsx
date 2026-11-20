"use client";

import clsx from "clsx";
import { ArrowLeft, CalendarCheck, Dumbbell, Flame, HeartPulse, MessageCircle, RotateCcw, Scale, Sparkles, Sprout, TrendingUp, UserRound } from "lucide-react";
import Link from "next/link";
import { useState, type ComponentType } from "react";
import { Arrow, Photo } from "@/components/ui";
import { money } from "@/lib/brand";
import { getClassType, getCoach, getSessions, isFull, isPast, weekDates } from "@/lib/data";
import { firstClass, recommend, type Goal } from "@/lib/programs";

type Who = "man" | "woman";
type Level = "new" | "some" | "often";
type Option<T> = { value: T; label: string; help: string; icon: ComponentType<{ className?: string; strokeWidth?: number }> };

const GOALS: Option<Goal>[] = [
  { value: "lose", label: "Lose weight", help: "Burn fat, feel lighter", icon: Scale },
  { value: "muscle", label: "Build muscle", help: "Get bigger and stronger", icon: Dumbbell },
  { value: "tone", label: "Tone & shape", help: "Firm, fit, no bulk", icon: Sparkles },
  { value: "fit", label: "Get fit & healthy", help: "More energy, less pain", icon: HeartPulse },
];
const WHO: Option<Who>[] = [
  { value: "man", label: "I am a man", help: "See men's programs", icon: UserRound },
  { value: "woman", label: "I am a woman", help: "See women's programs", icon: UserRound },
];
const LEVELS: Option<Level>[] = [
  { value: "new", label: "New to the gym", help: "Never trained, or stopped long ago", icon: Sprout },
  { value: "some", label: "I train sometimes", help: "A few times a month", icon: TrendingUp },
  { value: "often", label: "I train often", help: "2 or more times a week", icon: Flame },
];
const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

/** "Start here": three taps to a program, a first class and a package. */
export function StartQuiz() {
  const [goal, setGoal] = useState<Goal>();
  const [who, setWho] = useState<Who>();
  const [level, setLevel] = useState<Level>();
  const step = !goal ? 1 : !who ? 2 : !level ? 3 : 4;

  function back() {
    if (level) setLevel(undefined);
    else if (who) setWho(undefined);
    else setGoal(undefined);
  }

  if (step === 4 && goal && who && level) {
    const program = recommend(goal, who, level);
    const coach = getCoach(program.coach);
    const type = getClassType(firstClass[program.slug]);
    const next = getSessions().find((s) => s.type === firstClass[program.slug] && !isPast(s) && !isFull(s));
    const plan = level === "new" ? { name: "1 month", price: 120000, note: "Stop any month. Good for a first try." } : { name: "3 months", price: 300000, note: "Our best value: 100,000 RWF a month." };
    return (
      <div className="flex flex-col gap-6" aria-live="polite">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">Your plan is ready</p>
        <div className="grid overflow-hidden rounded-3xl border border-line bg-surface lg:grid-cols-[1fr_1.2fr]">
          <Photo k={program.image} alt={program.name} className="h-64 w-full lg:h-full" />
          <div className="flex flex-col gap-5 p-6 sm:p-8">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.12em] text-muted">
                {program.audience === "everyone" ? "For everyone" : program.audience === "men" ? "Men's program" : "Women's program"}
              </div>
              <h2 className="mt-1 font-display text-[44px] uppercase leading-none sm:text-[56px]">{program.name}</h2>
              <p className="mt-3 text-lg text-ink-2">{program.goal}</p>
            </div>
            <div className="flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-line px-3 py-1.5">{program.weeks} weeks</span>
              <span className="rounded-full border border-line px-3 py-1.5">{program.daysPerWeek} days a week</span>
              <span className="rounded-full border border-line px-3 py-1.5">{program.minutes} min a session</span>
              <span className="rounded-full border border-line px-3 py-1.5">Coach: {coach?.first.en}</span>
            </div>
            <ol className="flex flex-col gap-3">
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-bg">1</span>
                <div>
                  <div className="font-semibold">Your first class: {type?.name.en}</div>
                  <div className="text-[15px] text-muted">
                    {type?.oneLine.en}
                    {next && <> Next one: {DAYS[next.day]} {weekDates[next.day]} Nov at <span className="font-mono">{next.time}</span>.</>}
                  </div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-bg">2</span>
                <div>
                  <div className="font-semibold">Your package: {plan.name}, {money(plan.price)}</div>
                  <div className="text-[15px] text-muted">{plan.note} The program is included.</div>
                </div>
              </li>
              <li className="flex gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent font-semibold text-bg">3</span>
                <div>
                  <div className="font-semibold">Your coach checks in on WhatsApp every Monday</div>
                  <div className="text-[15px] text-muted">The week&apos;s plan, and a quick question about how you feel.</div>
                </div>
              </li>
            </ol>
            <div className="flex flex-wrap gap-3">
              {next && (
                <Link href={`/en/classes?session=${next.id}`} className="inline-flex min-h-[52px] items-center gap-2 rounded-full bg-accent px-6 font-semibold text-bg">
                  <CalendarCheck aria-hidden className="size-5" /> Book my first class
                </Link>
              )}
              <Link href={`/en/programs/${program.slug}`} className="inline-flex min-h-[52px] items-center gap-2 rounded-full border border-control px-6 font-semibold">
                See the full program <Arrow className="size-4" />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={() => { setGoal(undefined); setWho(undefined); setLevel(undefined); }} className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-muted hover:text-ink">
            <RotateCcw aria-hidden className="size-4" /> Start again
          </button>
          <Link href="/en/contact" className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-muted hover:text-ink">
            <MessageCircle aria-hidden className="size-4" /> Prefer to talk? Message a coach
          </Link>
        </div>
      </div>
    );
  }

  const q = step === 1
    ? { title: "What do you want most?", options: GOALS, pick: (v: Goal) => setGoal(v) }
    : step === 2
      ? { title: "Who is training?", options: WHO, pick: (v: Who) => setWho(v) }
      : { title: "How often do you train today?", options: LEVELS, pick: (v: Level) => setLevel(v) };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        {step > 1 && (
          <button type="button" onClick={back} aria-label="Back to the previous question" className="inline-flex size-11 items-center justify-center rounded-full border border-line">
            <ArrowLeft aria-hidden className="size-5" />
          </button>
        )}
        <div className="flex flex-1 items-center gap-2" aria-label={`Question ${step} of 3`}>
          {[1, 2, 3].map((n) => (
            <span key={n} className={clsx("h-1.5 flex-1 rounded-full", n <= step ? "bg-accent" : "bg-line")} />
          ))}
        </div>
        <span className="font-mono text-sm text-muted">{step} / 3</span>
      </div>
      <h2 className="font-display text-[40px] uppercase leading-none sm:text-[56px]">{q.title}</h2>
      <div className={clsx("grid gap-3", q.options.length === 4 ? "sm:grid-cols-2" : q.options.length === 2 ? "sm:grid-cols-2" : "sm:grid-cols-3")}>
        {(q.options as Option<string>[]).map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => (q.pick as (v: string) => void)(o.value)}
            className="group flex min-h-[112px] items-center gap-4 rounded-[20px] border border-line bg-surface p-5 text-start transition hover:border-accent"
          >
            <span className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-bg text-accent transition group-hover:bg-accent group-hover:text-bg">
              <o.icon className="size-7" strokeWidth={1.8} />
            </span>
            <span>
              <span className="block text-xl font-semibold">{o.label}</span>
              <span className="block text-[15px] text-muted">{o.help}</span>
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
