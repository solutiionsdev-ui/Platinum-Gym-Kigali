import { Backpack, Clock, DoorOpen, Footprints, Lock, ShowerHead, Smile, UserCheck } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { whatsappHref } from "@/components/site/footer";
import { Container, Photo, btn } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Your first visit" };

const STEPS = [
  { icon: Clock, title: "Come at any time", text: "We are open 24 hours, every day. For your first visit, come when a class is on (evenings or weekend mornings) so a coach can welcome you." },
  { icon: DoorOpen, title: "Say hello at the front desk", text: "Show the WhatsApp message from your booking, or buy a day pass (10,000 RWF). Cash, card, MTN MoMo or Airtel Money." },
  { icon: Lock, title: "Changing room and locker", text: "Change, leave your bag in a locker. Showers are there for after." },
  { icon: UserCheck, title: "A coach shows you around", text: "Where everything is, how the machines work, and which weight to start with. Ask anything: there are no silly questions." },
  { icon: ShowerHead, title: "Finish in the sauna or steam", text: "Included for everyone. 10 to 15 minutes is enough. Drink water after." },
];

const BRING = [
  { icon: Footprints, text: "Clean sports shoes (not the ones you walked in with outside)" },
  { icon: Backpack, text: "A water bottle and a small towel" },
  { icon: Smile, text: "Comfortable clothes you can move and sweat in" },
];

const WORDS = [
  ["Rep", "One movement. Lifting a weight up and down once is 1 rep."],
  ["Set", "A group of reps, then a rest. \"3 sets of 10\" means 10 reps, rest, three times."],
  ["Warm-up", "5 to 10 easy minutes to get your body ready, so you don't get hurt."],
  ["Cardio", "Anything that makes your heart beat faster: running, bike, aerobics."],
  ["Core", "The middle of your body: belly, sides and lower back."],
  ["Mobility", "Gentle stretching so your joints move freely and without pain."],
  ["Body scan", "A machine that measures your weight, fat and muscle, to see real progress."],
];

export default function FirstVisitPage() {
  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">New here? Read this first</p>
          <h1 className="mt-2 font-display display-page uppercase">Your first visit</h1>
          <p className="mt-4 max-w-[560px] text-lg text-ink-2">
            Everyone was a beginner once. You don&apos;t need to be fit to start, and you don&apos;t need to know anything. Here is exactly what happens.
          </p>
        </div>
        <Photo k="reception" alt="Platinum Gym reception" className="h-64 w-full rounded-[24px] border border-line" />
      </div>

      <ol className="mt-14 flex flex-col gap-4">
        {STEPS.map((s, i) => (
          <li key={s.title} className="flex gap-5 rounded-[20px] border border-line bg-surface p-5 sm:p-6">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-accent text-bg">
              <s.icon aria-hidden className="size-6" strokeWidth={2} />
            </span>
            <div>
              <div className="font-mono text-sm text-accent">Step {i + 1}</div>
              <h2 className="text-xl font-semibold">{s.title}</h2>
              <p className="mt-1 text-ink-2">{s.text}</p>
            </div>
          </li>
        ))}
      </ol>

      <section aria-labelledby="bring-h" className="mt-16">
        <h2 id="bring-h" className="font-display display-section uppercase">What to bring</h2>
        <ul className="mt-6 grid gap-4 md:grid-cols-3">
          {BRING.map((b) => (
            <li key={b.text} className="flex items-start gap-4 rounded-[20px] border border-line bg-surface p-5">
              <b.icon aria-hidden className="size-7 shrink-0 text-accent" strokeWidth={1.8} />
              <span className="text-lg">{b.text}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="words-h" className="mt-16">
        <h2 id="words-h" className="font-display display-section uppercase">Gym words, made simple</h2>
        <p className="mt-2 max-w-[560px] text-muted">You will hear these from the coaches. Now you know what they mean.</p>
        <dl className="mt-6 grid gap-3 md:grid-cols-2">
          {WORDS.map(([w, d]) => (
            <div key={w} className="rounded-2xl border border-line bg-surface p-5">
              <dt className="text-lg font-semibold text-accent">{w}</dt>
              <dd className="mt-1 text-ink-2">{d}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="mt-16 flex flex-wrap items-center gap-4 rounded-[24px] bg-accent p-6 text-bg sm:p-10">
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="font-display text-[40px] uppercase leading-none">Ready when you are</h2>
          <p className="mt-2 text-lg">Find your program in 30 seconds, or just come by: {brand.address.en}.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/en/start" className="inline-flex min-h-[52px] items-center rounded-full bg-bg px-6 font-semibold text-ink">Find my program</Link>
          <a href={whatsappHref("en")} className={`${btn.outline} border-bg text-bg`}>Ask on WhatsApp</a>
        </div>
      </section>
    </Container>
  );
}
