import { ClipboardList, MessageCircle, PlayCircle, Smartphone } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { OnlineForm } from "@/components/site/online-form";
import { Container, Photo, PriceTag, btn } from "@/components/ui";
import { ONLINE_PRICE } from "@/lib/programs";

export const metadata: Metadata = { title: "Online coaching" };

const STEPS = [
  { icon: ClipboardList, title: "Answer 4 questions", text: "Your goal, where you train, how many days, any pain. Two minutes." },
  { icon: Smartphone, title: "Get your plan on WhatsApp", text: "Gael's team writes a plan just for you, within 48 hours." },
  { icon: PlayCircle, title: "Train with short videos", text: "Every exercise has a 30-second video. At home or in any gym." },
  { icon: MessageCircle, title: "Check in every Monday", text: "Tell us how the week went. Your coach adjusts the plan." },
];

const SAMPLE_DAY = [
  { name: "Squats", how: "3 rounds × 12", note: "Sit back like on a chair" },
  { name: "Push-ups (on knees is fine)", how: "3 rounds × 10", note: "Keep your back straight" },
  { name: "Glute bridge", how: "3 rounds × 15", note: "Squeeze at the top" },
  { name: "Plank", how: "3 × 30 seconds", note: "Breathe normally" },
];

export default function OnlinePage() {
  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="grid items-center gap-10 lg:grid-cols-2">
        <div className="flex flex-col gap-5">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">Online coaching · anywhere in the world</p>
          <h1 className="font-display display-page uppercase">Your coach,<br />on your phone</h1>
          <p className="max-w-[560px] text-lg text-ink-2">
            Can&apos;t come to Rebero? Live in another city or abroad? Get a personal plan from Gael&apos;s team, short videos for every exercise and a check-in on WhatsApp every week.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <span className="font-display text-[56px] leading-none"><PriceTag n={ONLINE_PRICE} /></span>
            <span className="pb-2 text-muted">a month · pay with MoMo, Airtel or card</span>
          </div>
          <a href="#start" className={`${btn.accent} self-start`}>Get my plan</a>
        </div>

        {/* What arrives on the phone */}
        <div className="mx-auto w-full max-w-[380px] rounded-[28px] border border-line bg-[#ecede9] p-3 text-chat-ink shadow-2xl">
          <div className="rounded-[20px] bg-white p-4">
            <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#5e6661]">Today · Day 3 of week 2</div>
            <div className="mt-1 text-lg font-semibold">Full body at home · 25 min</div>
            <ul className="mt-3 flex flex-col gap-2">
              {SAMPLE_DAY.map((e) => (
                <li key={e.name} className="flex items-center gap-3 rounded-xl border border-[#e4e7e5] p-2">
                  <span className="relative flex h-12 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-[#111412]">
                    <PlayCircle aria-hidden className="size-6 text-accent" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[15px] font-semibold">{e.name}</span>
                    <span className="block text-[13px] text-[#5e6661]">{e.how} · {e.note}</span>
                  </span>
                </li>
              ))}
            </ul>
            <div className="mt-3 rounded-xl bg-[#d9eedf] p-3 text-[14px]">Reply <strong>DONE</strong> when you finish. Your coach sees it.</div>
          </div>
        </div>
      </div>

      <section aria-labelledby="how-h" className="mt-20">
        <h2 id="how-h" className="font-display display-section uppercase">How it works</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <li key={s.title} className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-6">
              <span className="flex items-center gap-3">
                <span className="font-mono text-accent">0{i + 1}</span>
                <s.icon aria-hidden className="size-6 text-accent" strokeWidth={1.8} />
              </span>
              <h3 className="text-xl font-semibold">{s.title}</h3>
              <p className="text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {[
          { k: "liftingMan" as const, t: "Programs for men", d: "Build muscle or lose the belly, at home or in your gym." },
          { k: "stretching" as const, t: "Programs for women", d: "Tone & shape or lose weight safely, with videos." },
          { k: "floorDark" as const, t: "Akantu online", d: "Gael's signature program, adapted for home." },
        ].map((c) => (
          <Link key={c.t} href="/en/programs" className="group overflow-hidden rounded-[20px] border border-line bg-surface hover:border-accent">
            <Photo k={c.k} alt={c.t} className="h-40 w-full" />
            <div className="p-5">
              <div className="text-lg font-semibold">{c.t}</div>
              <div className="text-[15px] text-muted">{c.d}</div>
            </div>
          </Link>
        ))}
      </section>

      <section id="start" aria-labelledby="start-h" className="mt-16 scroll-mt-6 rounded-[28px] border-2 border-accent bg-surface p-6 sm:p-10">
        <h2 id="start-h" className="font-display display-section uppercase">Get my plan</h2>
        <p className="mb-8 mt-2 max-w-[560px] text-muted">Two minutes. Gael&apos;s team reads every answer.</p>
        <div className="max-w-[760px]"><OnlineForm /></div>
      </section>
    </Container>
  );
}
