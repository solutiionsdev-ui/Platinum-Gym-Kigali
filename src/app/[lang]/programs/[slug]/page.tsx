import clsx from "clsx";
import { CalendarCheck, Check, HelpCircle, Laptop } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/lead-form";
import { Arrow, Container, Photo, btn } from "@/components/ui";
import { getClassType, getCoach, getSessions, isFull, isPast, weekDates } from "@/lib/data";
import { languages } from "@/lib/i18n";
import { firstClass, getProgram, getPrograms } from "@/lib/programs";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.flatMap((lang) => getPrograms().map((p) => ({ lang, slug: p.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const p = getProgram((await params).slug);
  return { title: p ? `${p.name} program` : undefined };
}

export default async function ProgramPage({ params }: { params: Params }) {
  const p = getProgram((await params).slug);
  if (!p) notFound();
  const coach = getCoach(p.coach);
  const type = getClassType(firstClass[p.slug]);
  const next = getSessions().find((s) => s.type === firstClass[p.slug] && !isPast(s) && !isFull(s));
  const audience = p.audience === "everyone" ? "For everyone" : p.audience === "men" ? "For men" : "For women";

  return (
    <>
      {/* Hero */}
      <section className="relative">
        <Photo k={p.image} alt={p.name} eager className="h-[340px] w-full sm:h-[440px]" />
        <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/70 to-transparent" />
        <Container className="absolute inset-x-0 bottom-0 pb-8">
          <Link href={`/en/programs#${p.audience === "everyone" ? "akantu" : p.audience}`} className="inline-flex min-h-11 items-center gap-1.5 text-[15px] text-ink-2 hover:text-ink">
            <Arrow className="size-4 rotate-180" /> All programs
          </Link>
          <div className="mt-2 text-sm font-semibold uppercase tracking-[0.14em] text-accent">{audience} · {p.level}</div>
          <h1 className="font-display display-page uppercase">{p.name}</h1>
          <p className="mt-2 max-w-[640px] text-xl text-ink">{p.goal}</p>
        </Container>
      </section>

      <Container className="pb-24 pt-8">
        <div className="flex flex-wrap gap-2 text-[15px]">
          {[`${p.weeks} weeks`, `${p.daysPerWeek} days a week`, `${p.minutes} minutes a session`, `Coach: ${coach?.first.en}`, "Included in every package"].map((c) => (
            <span key={c} className="rounded-full border border-line px-4 py-2">{c}</span>
          ))}
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.4fr_1fr]">
          <div className="flex flex-col gap-10">
            <section>
              <h2 className="text-2xl font-semibold">Who it&apos;s for</h2>
              <p className="mt-2 text-lg text-ink-2">{p.forWho}</p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">What you&apos;ll do</h2>
              <ul className="mt-4 flex flex-col gap-3">
                {p.whatYouDo.map((w) => (
                  <li key={w} className="flex gap-3 text-lg">
                    <Check aria-hidden className="mt-1 size-5 shrink-0 text-accent" strokeWidth={2.4} />
                    {w}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">A normal week</h2>
              <ol className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
                {p.week.map((d, i) => (
                  <li key={i} className={clsx("flex min-h-[96px] flex-col gap-1 rounded-2xl border p-3", d ? "border-line bg-surface" : "border-dashed border-line-soft")}>
                    <span className="font-mono text-xs text-muted">{DAYS[i]}</span>
                    <span className={clsx("text-[15px] leading-snug", d ? "font-semibold" : "text-faint")}>{d || "Rest"}</span>
                  </li>
                ))}
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-semibold">What changes, step by step</h2>
              <ol className="mt-4 flex flex-col">
                {p.stages.map((s, i) => (
                  <li key={s.when} className="flex gap-4 border-l-2 border-line pb-5 ps-5 last:pb-0" style={{ borderColor: i === 0 ? "var(--accent)" : undefined }}>
                    <div>
                      <div className="font-mono text-sm text-accent">{s.when}</div>
                      <div className="text-lg">{s.what}</div>
                    </div>
                  </li>
                ))}
              </ol>
            </section>

            {p.myth && (
              <section className="flex gap-4 rounded-[20px] border border-line bg-surface-2 p-6">
                <HelpCircle aria-hidden className="size-7 shrink-0 text-accent" strokeWidth={1.8} />
                <div>
                  <h2 className="text-xl font-semibold">&ldquo;{p.myth.q}&rdquo;</h2>
                  <p className="mt-1 text-ink-2">{p.myth.a}</p>
                </div>
              </section>
            )}
          </div>

          <aside className="flex flex-col gap-5">
            <div className="flex items-center gap-4 rounded-[20px] border border-line bg-surface p-5">
              <div aria-hidden className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-line bg-surface-2 font-display text-4xl text-accent">
                {coach?.name.en.charAt(0)}
              </div>
              <div>
                <div className="text-sm text-muted">Your coach</div>
                <div className="text-xl font-semibold">{coach?.name.en}</div>
                <div className="text-[15px] text-muted">{coach?.role.en}</div>
              </div>
            </div>

            {next && type && (
              <div className="rounded-[20px] border border-line bg-surface p-5">
                <div className="text-sm text-muted">Start with this class</div>
                <div className="mt-1 text-xl font-semibold">{type.name.en}</div>
                <div className="text-[15px] text-muted">{type.oneLine.en}</div>
                <Link href={`/en/classes?session=${next.id}`} className={clsx(btn.light, "mt-4 gap-2")}>
                  <CalendarCheck aria-hidden className="size-5" /> Book {DAYS[next.day]} {weekDates[next.day]} at {next.time}
                </Link>
              </div>
            )}

            <div id="start" className="scroll-mt-6 rounded-[20px] border-2 border-accent bg-surface p-5 sm:p-6">
              <h2 className="text-xl font-semibold">Start this program</h2>
              <p className="mb-4 mt-1 text-[15px] text-muted">Leave your name and WhatsApp. {coach?.first.en} messages you to set your first session.</p>
              <LeadForm lang="en" mode="program" initialChoice={p.slug} idPrefix="program" />
            </div>

            <Link href="/en/online" className="flex items-center gap-3 rounded-[20px] border border-line p-5 hover:border-control">
              <Laptop aria-hidden className="size-6 text-accent" strokeWidth={1.8} />
              <span className="flex-1">
                <span className="block font-semibold">Do it from home</span>
                <span className="block text-[15px] text-muted">Online coaching: same program, with videos</span>
              </span>
              <Arrow className="size-4" />
            </Link>
          </aside>
        </div>
      </Container>
    </>
  );
}
