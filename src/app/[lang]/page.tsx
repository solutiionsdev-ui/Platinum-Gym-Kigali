import { Dumbbell, Droplet, UserCheck, Users } from "lucide-react";
import Link from "next/link";
import { LeadForm } from "@/components/site/lead-form";
import { whatsappHref } from "@/components/site/footer";
import { Arrow, Container, Eyebrow, LevelBars, PhotoPlaceholder, SectionHead, btn } from "@/components/ui";
import { MessageCircle } from "lucide-react";
import { brand } from "@/lib/brand";
import {
  formatPrice, getClassType, getClassTypes, getCoach, getNextOpenClass, getPlans, getRoomName, getUpcomingToday, isFull, spotsLeft,
} from "@/lib/data";
import { getDict, href, langFrom } from "@/lib/i18n";

const offerIcons = [Dumbbell, Users, UserCheck, Droplet];

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);
  const next = getNextOpenClass();
  const nextType = next && getClassType(next.type);
  const nextCoach = next && getCoach(next.coach);
  const today = getUpcomingToday();
  const homeCoaches = ["karim", "maya", "rami", "nour"].map((s) => getCoach(s)!).filter(Boolean);

  return (
    <>
      {/* Hero */}
      <Container className="flex flex-wrap items-stretch gap-12 pb-16 pt-10 sm:pt-14">
        <div className="flex min-w-0 flex-[1_1_520px] flex-col justify-center gap-7">
          <Eyebrow>{t.home.eyebrow}</Eyebrow>
          <h1 className="font-display display-hero uppercase">
            {t.home.title1}
            <br />
            {t.home.title2} <span className="text-accent">{t.home.titleAccent}</span>
          </h1>
          <p className="max-w-[520px] text-[19px] leading-relaxed text-ink-2">{t.home.intro}</p>
          <div className="flex flex-wrap gap-3">
            <Link href={href(lang, "/trial")} className={btn.accent}>
              {t.common.bookFreeTrial}
              <Arrow />
            </Link>
            <Link href={href(lang, "/classes")} className={btn.outline}>
              {t.common.seeTimetable}
            </Link>
          </div>
        </div>
        <PhotoPlaceholder label={`${t.common.photo}: ${t.home.photoHero}`} className="min-h-[420px] flex-[1_1_520px] rounded-3xl p-6 sm:min-h-[560px]">
          {next && nextType && nextCoach && (
            <div className="flex flex-wrap items-center gap-5 self-start rounded-2xl border border-line bg-bg px-5 py-[18px] text-ink">
              <div>
                <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{t.home.nextClass}</div>
                <div className="mt-1 text-xl font-semibold">
                  {nextType.name[lang]} {t.common.with} {nextCoach.first[lang]}
                </div>
                <div className="text-sm text-muted">
                  <span className="font-mono">{next.time}</span> · {getRoomName(next.room, lang)} · {t.spotsShort(spotsLeft(next))}
                </div>
              </div>
              <Link href={href(lang, `/classes?session=${next.id}`)} className={btn.light}>
                {t.common.book}
              </Link>
            </div>
          )}
        </PhotoPlaceholder>
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

      {/* What we offer */}
      <Container className="pb-12 pt-24">
        <SectionHead title={t.home.offerTitle}>
          <p className="max-w-[440px] text-[17px] text-muted">{t.home.offerText}</p>
        </SectionHead>
        <div className="flex flex-wrap gap-4">
          {t.home.offers.map((o, i) => {
            const Icon = offerIcons[i];
            return (
              <div key={o.title} className="flex flex-[1_1_260px] flex-col gap-3.5 rounded-[20px] border border-line bg-surface p-7">
                <Icon aria-hidden className="size-7 text-accent" strokeWidth={1.8} />
                <h3 className="text-[21px] font-semibold">{o.title}</h3>
                <p className="text-muted">{o.text}</p>
              </div>
            );
          })}
        </div>
      </Container>

      {/* Classes */}
      <Container className="py-12">
        <SectionHead title={t.home.classesTitle}>
          <Link href={href(lang, "/classes")} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
            {t.home.classesLink} <Arrow className="size-4" />
          </Link>
        </SectionHead>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {getClassTypes().map((c) => (
            <Link key={c.slug} href={href(lang, `/classes/${c.slug}`)} className="group flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-line bg-surface transition hover:border-control">
              <PhotoPlaceholder label={`${t.common.photo}: ${c.photo[lang]}`} className="h-[170px] rounded-none border-0 border-b" />
              <div className="flex flex-col gap-2.5 px-[22px] pb-6 pt-5">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-display text-[34px] uppercase leading-tight tracking-[0.02em]">{c.name[lang]}</h3>
                  <span className="font-mono text-[13px] text-muted">{t.perWeek(c.perWeek)}</span>
                </div>
                <p className="text-[15px] text-muted">{c.text[lang]}</p>
                <div className="flex items-center gap-3.5 text-sm text-ink-2">
                  <span>{c.mins} {t.common.min}</span>
                  <span aria-hidden className="size-1 rounded-full bg-[#55555c]" />
                  <LevelBars level={c.level} label={t.intensity(c.level)} />
                  <span>{t.levels[c.level]}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </Container>

      {/* How booking works */}
      <Container className="py-[72px]">
        <h2 className="font-display display-section mb-9 uppercase">{t.home.howTitle}</h2>
        <ol className="flex flex-wrap gap-4">
          {t.home.steps.map((s, i) => (
            <li key={s.title} className="flex flex-[1_1_300px] flex-col gap-2.5 border-t-2 border-accent pt-[22px]">
              <span className="font-mono text-[15px] text-accent">0{i + 1}</span>
              <h3 className="text-[22px] font-semibold">{s.title}</h3>
              <p className="text-muted">{s.text}</p>
            </li>
          ))}
        </ol>
      </Container>

      {/* Coaches */}
      <Container className="pb-[72px] pt-12">
        <SectionHead title={t.home.coachesTitle}>
          <p className="max-w-[440px] text-[17px] text-muted">{t.home.coachesText}</p>
        </SectionHead>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {homeCoaches.map((c) => (
            <div key={c.slug} className="flex min-w-0 flex-col gap-3.5">
              <PhotoPlaceholder label={`${t.common.portrait}: ${c.name[lang]}`} className="aspect-[4/5]" />
              <div>
                <div className="text-lg font-semibold sm:text-xl">{c.name[lang]}</div>
                <div className="text-[15px] text-muted">{c.role[lang]}</div>
              </div>
              <Link href={href(lang, `/trainers/${c.slug}`)} className="inline-flex min-h-11 items-center gap-1.5 self-start text-[15px] font-semibold text-accent">
                {c.trainer ? t.home.bookConsult : t.home.hisClasses} <Arrow className="size-4" />
              </Link>
            </div>
          ))}
        </div>
      </Container>

      {/* Memberships teaser */}
      <section className="border-y border-line-soft bg-surface-2">
        <Container className="py-[88px]">
          <SectionHead title={t.home.membershipsTitle}>
            <Link href={href(lang, "/memberships")} className="inline-flex min-h-11 items-center gap-1.5 font-semibold">
              {t.home.membershipsLink} <Arrow className="size-4" />
            </Link>
          </SectionHead>
          <div className="flex flex-wrap gap-4">
            {getPlans()
              .filter((p) => p.id !== "6m")
              .map((p) => (
                <div
                  key={p.id}
                  className={`flex flex-[1_1_300px] flex-col gap-3.5 rounded-[20px] bg-surface ${p.best ? "border-2 border-accent p-[31px]" : "border border-line p-8"}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-lg font-semibold">{p.name[lang]}</span>
                    {p.best && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-bg">{t.memberships.bestValue}</span>}
                  </div>
                  <div className="flex flex-wrap items-baseline gap-2">
                    <span className="font-display text-[64px] leading-none">{formatPrice(p.price, lang)}</span>
                    <span className="text-muted">{p.per[lang]}</span>
                  </div>
                  <ul className="flex flex-col gap-1 text-muted">
                    {p.points.slice(1).map((pt) => (
                      <li key={pt.en}>{pt[lang]}</li>
                    ))}
                  </ul>
                  <Link
                    href={href(lang, `/trial?plan=${p.id}`)}
                    className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-full font-semibold ${p.best ? "bg-accent text-bg" : "border border-control"}`}
                  >
                    {t.home.choose(p.name[lang])}
                  </Link>
                </div>
              ))}
          </div>
        </Container>
      </section>

      {/* Free trial */}
      <Container className="py-24">
        <div id="trial" className="flex flex-wrap items-center gap-10 rounded-[28px] bg-accent p-7 text-bg sm:p-14">
          <div className="min-w-0 flex-[1_1_380px]">
            <h2 className="font-display display-section uppercase">{t.home.trialTitle}</h2>
            <p className="mt-[18px] max-w-[440px] text-lg">{t.home.trialText}</p>
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            <LeadForm lang={lang} tone="onAccent" idPrefix="home-trial" />
          </div>
        </div>
      </Container>

      {/* Visit */}
      <Container className="pb-24">
        <div className="flex flex-wrap gap-4">
          <PhotoPlaceholder label={t.common.map} className="min-h-[300px] flex-[1_1_520px] sm:min-h-[360px]" />
          <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-[22px] rounded-[20px] border border-line bg-surface p-8">
            <h2 className="font-display text-[44px] uppercase leading-none">{t.home.visitTitle}</h2>
            <div>
              <Eyebrow className="text-[13px]">{t.home.address}</Eyebrow>
              <p className="mt-1.5 text-[17px]">{brand.address[lang]}</p>
            </div>
            <div>
              <Eyebrow className="text-[13px]">{t.home.hours}</Eyebrow>
              <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
                {brand.hours.map((h) => (
                  <div key={h.time + h.days.en} className="contents">
                    <dt>{h.days[lang]}</dt>
                    <dd className="font-mono" dir="ltr">{h.time}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <a href={whatsappHref(lang)} className={btn.outline}>
              <MessageCircle aria-hidden className="size-[18px]" strokeWidth={1.8} />
              {t.common.whatsappUs}
            </a>
          </div>
        </div>
      </Container>
    </>
  );
}
