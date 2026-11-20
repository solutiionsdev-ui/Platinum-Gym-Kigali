import { Dumbbell, HeartPulse, Laptop, MapPin, MessageCircle, Phone, Rotate3d, Scale, Sparkles } from "lucide-react";
import Link from "next/link";
import { whatsappHref } from "@/components/site/footer";
import { ProgramCard } from "@/components/site/program-card";
import { Arrow, Container, Eyebrow, LevelBars, Photo, PhotoPlaceholder, PriceTag, SectionHead, btn } from "@/components/ui";
import { brand } from "@/lib/brand";
import { getClassType, getClassTypes, getCoach, getNextOpenClass, getRoomName, getUpcomingToday, isFull, spotsLeft } from "@/lib/data";
import { getDict, href, langFrom } from "@/lib/i18n";
import { getProgram, ONLINE_PRICE } from "@/lib/programs";

const GOALS = [
  { icon: Scale, label: "Lose weight" },
  { icon: Dumbbell, label: "Build muscle" },
  { icon: Sparkles, label: "Tone & shape" },
  { icon: HeartPulse, label: "Get fit & healthy" },
];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);
  const next = getNextOpenClass();
  const nextType = next && getClassType(next.type);
  const nextCoach = next && getCoach(next.coach);
  const today = getUpcomingToday();
  const gael = getCoach("gael");

  return (
    <>
      {/* Hero */}
      <Container className="flex flex-wrap items-stretch gap-10 pb-14 pt-8 sm:pt-12">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col justify-center gap-6">
          <Eyebrow>Rebero, Kigali · Open 24 hours · {brand.equipment} equipment</Eyebrow>
          <h1 className="font-display display-hero uppercase">
            {brand.slogan.line1}
            <br />
            <span className="text-accent">{brand.slogan.line2}</span> {brand.slogan.accent}
          </h1>
          <p className="max-w-[540px] text-[19px] leading-relaxed text-ink-2">
            Kigali&apos;s 24-hour gym. Clear training programs for men and for women, classes every evening, and coaches who show you how. Not sure where to start? We tell you in 30 seconds.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href={href(lang, "/start")} className={btn.accent}>
              <Sparkles aria-hidden className="size-5" /> Find my program
            </Link>
            <Link href={href(lang, "/classes")} className={btn.outline}>Book a class</Link>
          </div>
        </div>
        <div className="relative min-h-[420px] min-w-0 flex-[1_1_480px] overflow-hidden rounded-3xl border border-line sm:min-h-[560px]">
          <Photo k="floorWide" alt="The weights floor at Platinum Gym" eager className="absolute inset-0 h-full w-full" />
          {next && nextType && nextCoach && (
            <div className="absolute bottom-5 start-5 end-5 flex flex-wrap items-center gap-5 rounded-2xl border border-line bg-bg/90 px-5 py-4 backdrop-blur sm:end-auto">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t.home.nextClass}</div>
                <div className="mt-1 text-xl font-semibold">{nextType.name[lang]} {t.common.with} {nextCoach.first[lang]}</div>
                <div className="text-sm text-muted">
                  <span className="font-mono">{next.time}</span> · {getRoomName(next.room, lang)} · {t.spotsShort(spotsLeft(next))}
                </div>
              </div>
              <Link href={href(lang, `/classes?session=${next.id}`)} className={btn.light}>{t.common.book}</Link>
            </div>
          )}
        </div>
      </Container>

      {/* Today strip */}
      <section aria-labelledby="today-h" className="border-y border-line-soft bg-surface-2">
        <Container className="flex flex-wrap items-center gap-x-9 gap-y-3 py-[18px]">
          <h2 id="today-h" className="text-[13px] font-semibold uppercase tracking-[0.16em] text-accent">{t.home.todayAt}</h2>
          {today.map((s) => (
            <Link key={s.id} href={href(lang, `/classes?session=${s.id}`)} className="flex min-h-11 items-baseline gap-2.5 text-[15px] hover:text-white">
              <span className="font-mono">{s.time}</span>
              <span className="font-semibold">{getClassType(s.type)?.name[lang]}</span>
              <span className="text-muted">{isFull(s) ? t.fullShort : t.spotsShort(spotsLeft(s))}</span>
            </Link>
          ))}
          <Link href={href(lang, "/classes")} className="ms-auto inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold">
            {t.home.fullTimetable} <Arrow className="size-4" />
          </Link>
        </Container>
      </section>

      {/* Start here */}
      <Container className="pt-16">
        <div className="flex flex-wrap items-center gap-8 rounded-[28px] bg-accent p-6 text-bg sm:p-10">
          <div className="min-w-0 flex-[1_1_320px]">
            <p className="text-sm font-bold uppercase tracking-[0.14em]">Start here</p>
            <h2 className="mt-1 font-display text-[44px] uppercase leading-none sm:text-[56px]">What do you want?</h2>
            <p className="mt-3 max-w-[420px] text-lg">3 questions, 30 seconds. We show you your program, your first class and your package.</p>
          </div>
          <div className="grid min-w-0 flex-[1_1_420px] grid-cols-2 gap-3">
            {GOALS.map((g) => (
              <Link key={g.label} href={href(lang, "/start")} className="flex min-h-[84px] items-center gap-3 rounded-2xl bg-bg px-4 text-ink transition hover:bg-black">
                <g.icon aria-hidden className="size-7 shrink-0 text-accent" strokeWidth={1.8} />
                <span className="text-lg font-semibold leading-tight">{g.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </Container>

      {/* Programs */}
      <Container className="py-20">
        <SectionHead title="Training programs">
          <p className="max-w-[440px] text-[17px] text-muted">Simple plans written by our coaches. Included in every package, with a check-in on WhatsApp every week.</p>
        </SectionHead>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { href: "/programs#men", img: "liftingMan" as const, title: "For men", text: "Build muscle · Lose the belly · Strong start for beginners" },
            { href: "/programs#women", img: "stretching" as const, title: "For women", text: "Tone & shape · Lose weight safely · Strong & confident for beginners" },
          ].map((c) => (
            <Link key={c.title} href={href(lang, c.href)} className="group relative min-h-[360px] overflow-hidden rounded-[24px] border border-line">
              <Photo k={c.img} alt="" className="absolute inset-0 h-full w-full transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/50 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
                <h3 className="font-display text-[56px] uppercase leading-none">{c.title}</h3>
                <p className="text-ink-2">{c.text}</p>
                <span className="inline-flex items-center gap-1.5 font-semibold text-accent">See the programs <Arrow className="size-4" /></span>
              </div>
            </Link>
          ))}
        </div>
        <div className="mt-4"><ProgramCard p={getProgram("akantu")!} /></div>
      </Container>

      {/* Classes */}
      <Container className="pb-20">
        <SectionHead title={t.home.classesTitle}>
          <Link href={href(lang, "/classes")} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
            {t.home.classesLink} <Arrow className="size-4" />
          </Link>
        </SectionHead>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {getClassTypes().map((c) => (
            <Link key={c.slug} href={href(lang, `/classes/${c.slug}`)} className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-line bg-surface transition hover:border-control">
              {c.image ? <Photo k={c.image} alt={c.photo[lang]} className="h-40 w-full" /> : <PhotoPlaceholder label={c.photo[lang]} className="h-40 rounded-none border-0" />}
              <div className="flex flex-1 flex-col gap-2 p-5">
                <h3 className="font-display text-[28px] uppercase leading-tight">{c.name[lang]}</h3>
                <p className="text-[15px] text-muted">{c.oneLine[lang]}</p>
                <div className="mt-auto flex items-center gap-3 pt-1 text-sm text-ink-2">
                  <span>{c.mins} {t.common.min}</span>
                  <LevelBars level={c.level} label={t.intensity(c.level)} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* Gael */}
      <section className="border-y border-line-soft bg-surface-2">
        <Container className="grid items-center gap-10 py-20 lg:grid-cols-2">
          <Photo k="team" alt="Gael and the Platinum coaches" className="h-[420px] w-full rounded-[24px] border border-line" />
          <div className="flex flex-col gap-5">
            <Eyebrow>Founder & head coach</Eyebrow>
            <h2 className="font-display display-section uppercase">Trained by {gael?.first.en}</h2>
            <p className="text-lg text-ink-2">{gael?.bio.en}</p>
            <dl className="grid grid-cols-2 gap-4">
              {[["15+ years", "in sports and fitness"], ["Miss Rwanda", "contestants trained"], [brand.equipment, "equipment"], ["24 / 7", "open every day"]].map(([a, b]) => (
                <div key={a} className="rounded-2xl border border-line bg-surface p-4">
                  <dt className="font-display text-[26px] uppercase leading-none text-accent sm:text-[30px]">{a}</dt>
                  <dd className="mt-1 text-[15px] text-muted">{b}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Container>
      </section>

      {/* Tour + first visit */}
      <Container className="grid gap-4 py-20 lg:grid-cols-[1.4fr_1fr]">
        <Link href={href(lang, "/tour")} className="group relative min-h-[380px] overflow-hidden rounded-[24px] border border-line">
          <div className="absolute inset-0 grid grid-cols-3 grid-rows-2 gap-1">
            <Photo k="reception" alt="" className="col-span-2 row-span-2 h-full w-full" />
            <Photo k="cardioBikes" alt="" className="h-full w-full" />
            <Photo k="studioMural" alt="" className="h-full w-full" />
          </div>
          <div className="absolute inset-0 bg-linear-to-t from-bg via-bg/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-6">
            <span className="inline-flex items-center gap-2 self-start rounded-full bg-accent px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-bg">
              <Rotate3d aria-hidden className="size-4" /> Virtual tour
            </span>
            <h2 className="font-display text-[48px] uppercase leading-none">Walk around before you come</h2>
            <span className="inline-flex items-center gap-1.5 font-semibold text-accent">Take the tour <Arrow className="size-4" /></span>
          </div>
        </Link>
        <div className="flex flex-col gap-4">
          <Link href={href(lang, "/first-visit")} className="flex flex-1 flex-col gap-3 rounded-[24px] border border-line bg-surface p-6 hover:border-control">
            <h2 className="text-2xl font-semibold">New to the gym?</h2>
            <p className="text-muted">What to bring, what happens on your first visit, and gym words made simple.</p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-semibold text-accent">Your first visit <Arrow className="size-4" /></span>
          </Link>
          <Link href={href(lang, "/online")} className="flex flex-1 flex-col gap-3 rounded-[24px] border border-line bg-surface p-6 hover:border-control">
            <Laptop aria-hidden className="size-7 text-accent" strokeWidth={1.8} />
            <h2 className="text-2xl font-semibold">Train with us from anywhere</h2>
            <p className="text-muted">Online coaching: your plan on WhatsApp, videos for every exercise. From {ONLINE_PRICE.toLocaleString("en-US")} RWF a month.</p>
            <span className="mt-auto inline-flex items-center gap-1.5 font-semibold text-accent">Online coaching <Arrow className="size-4" /></span>
          </Link>
        </div>
      </Container>

      {/* Prices */}
      <section className="border-y border-line-soft bg-surface-2">
        <Container className="py-20">
          <SectionHead title="Packages">
            <Link href={href(lang, "/memberships")} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
              All packages and what&apos;s included <Arrow className="size-4" />
            </Link>
          </SectionHead>
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { name: "1 month", price: 120000, per: "Stop any month", best: false },
              { name: "3 months", price: 300000, per: "100,000 RWF a month", best: true },
              { name: "12 months", price: 1000000, per: "About 83,000 RWF a month", best: false },
            ].map((p) => (
              <div key={p.name} className={`flex flex-col gap-3 rounded-[20px] bg-surface ${p.best ? "border-2 border-accent p-[27px]" : "border border-line p-7"}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-lg font-semibold">{p.name}</span>
                  {p.best && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-bg">{t.memberships.bestValue}</span>}
                </div>
                <div className="font-display text-[52px] leading-none"><PriceTag n={p.price} /></div>
                <div className="text-muted">{p.per}</div>
                <div className="text-[15px] text-ink-2">Everything included: all equipment 24/7, every class, sauna & steam, a training program.</div>
              </div>
            ))}
          </div>
          <p className="mt-5 text-muted">Just one day? <span className="text-ink">Day pass 10,000 RWF.</span> Couples, families and groups of 5 pay less per person.</p>
        </Container>
      </section>

      {/* Visit */}
      <Container className="py-20">
        <div className="flex flex-wrap gap-4">
          <PhotoPlaceholder label={`Map: ${brand.address.en}`} className="min-h-[300px] flex-[1_1_520px] sm:min-h-[360px]" />
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-5 rounded-[20px] border border-line bg-surface p-8">
            <h2 className="font-display text-[44px] uppercase leading-none">{t.home.visitTitle}</h2>
            <p className="flex items-start gap-2 text-[17px]"><MapPin aria-hidden className="mt-1 size-5 shrink-0 text-accent" /> {brand.address.en} <span className="font-mono text-sm text-muted">({brand.plusCode})</span></p>
            <p className="text-[17px]"><span className="font-semibold text-accent">Open 24 hours</span>, every day. Classes in the evenings and on weekend mornings.</p>
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="flex min-h-11 items-center gap-2 font-mono text-[17px]"><Phone aria-hidden className="size-5 text-accent" /> {brand.phone}</a>
            <a href={whatsappHref(lang)} className={btn.outline}>
              <MessageCircle aria-hidden className="size-[18px]" strokeWidth={1.8} /> {t.common.whatsappUs}
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}
