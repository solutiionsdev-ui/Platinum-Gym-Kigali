import { Laptop, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { ProgramCard } from "@/components/site/program-card";
import { Arrow, Container, Photo, btn } from "@/components/ui";
import { getCoach } from "@/lib/data";
import { getProgram, programsFor } from "@/lib/programs";

export const metadata: Metadata = { title: "Training programs" };

export default function ProgramsPage() {
  const akantu = getProgram("akantu")!;
  const gael = getCoach("gael");

  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[680px]">
          <h1 className="font-display display-page uppercase">Training programs</h1>
          <p className="mt-3 text-lg text-ink-2">
            A clear plan for every goal, written by our coaches in simple words. Every program is included in your package, and your coach checks in with you on WhatsApp every week.
          </p>
        </div>
        <Link href="/en/start" className={btn.accent}>
          <Sparkles aria-hidden className="size-5" /> Not sure? Take the quiz
        </Link>
      </div>

      <nav aria-label="Jump to" className="mt-8 flex flex-wrap gap-2">
        <a href="#men" className={btn.pill}>For men</a>
        <a href="#women" className={btn.pill}>For women</a>
        <a href="#akantu" className={btn.pill}>Akantu, for everyone</a>
        <Link href="/en/online" className={btn.pill}>Online, from home</Link>
      </nav>

      {/* Akantu */}
      <section id="akantu" className="mt-12 grid scroll-mt-6 overflow-hidden rounded-[28px] border-2 border-accent bg-surface lg:grid-cols-2">
        <Photo k={akantu.image} alt="Akantu session" className="h-72 w-full lg:h-full" />
        <div className="flex flex-col gap-4 p-6 sm:p-10">
          <span className="self-start rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-bg">Signature program · for everyone</span>
          <h2 className="font-display text-[56px] uppercase leading-none">Akantu</h2>
          <p className="text-lg text-ink-2">{akantu.goal}</p>
          <p className="text-[15px] text-muted">Created by {gael?.name.en}, who trained Miss Rwanda contestants. 90 minutes, three mornings a week: stretch, stamina, balance, then a fat-burning finish.</p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/en/programs/akantu" className={btn.accent}>See Akantu <Arrow /></Link>
          </div>
        </div>
      </section>

      {(["men", "women"] as const).map((a) => (
        <section key={a} id={a} aria-labelledby={`h-${a}`} className="mt-16 scroll-mt-6">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <h2 id={`h-${a}`} className="font-display display-section uppercase">{a === "men" ? "For men" : "For women"}</h2>
            <p className="max-w-[440px] text-muted">
              {a === "men"
                ? "Build muscle, lose the belly, or start from zero without getting hurt."
                : "Tone and shape, lose weight safely, or start gently if you are new or shy."}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {programsFor(a).map((p) => <ProgramCard key={p.slug} p={p} />)}
          </div>
        </section>
      ))}

      <section className="mt-16 flex flex-wrap items-center gap-6 rounded-[24px] border border-line bg-surface-2 p-6 sm:p-10">
        <span className="flex size-14 items-center justify-center rounded-2xl bg-accent text-bg">
          <Laptop aria-hidden className="size-7" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-[1_1_320px]">
          <h2 className="text-2xl font-semibold">Can&apos;t come to the gym?</h2>
          <p className="mt-1 text-muted">Follow any program from home or from abroad. Gael&apos;s team writes your plan, sends a video for every exercise and checks in on WhatsApp.</p>
        </div>
        <Link href="/en/online" className={btn.outline}>Online coaching <Arrow /></Link>
      </section>
    </Container>
  );
}
