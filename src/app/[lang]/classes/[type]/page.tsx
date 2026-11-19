import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Arrow, Container, LevelBars, PhotoPlaceholder, btn } from "@/components/ui";
import { getClassType, getClassTypes, getCoach, getRoomName, getSessionsForType, isFull, isPast, spotsLeft, weekDates } from "@/lib/data";
import { getDict, href, isLang, languages, type Lang } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.flatMap((lang) => getClassTypes().map((c) => ({ lang, type: c.slug })));
}

type Params = Promise<{ lang: string; type: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, type } = await params;
  const c = getClassType(type);
  return { title: c && isLang(lang) ? c.name[lang] : undefined };
}

export default async function ClassPage({ params }: { params: Params }) {
  const { lang: raw, type } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = getDict(lang);
  const c = getClassType(type);
  if (!c) notFound();
  const upcoming = getSessionsForType(c.slug).filter((s) => !isPast(s));

  return (
    <Container className="pb-24 pt-10">
      <Link href={href(lang, "/classes")} className="inline-flex min-h-11 items-center gap-1.5 text-[15px] text-muted hover:text-ink">
        <Arrow className="size-4 rotate-180 rtl:rotate-0" /> {t.classPage.allClasses}
      </Link>

      <div className="mt-4 flex flex-wrap gap-12">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-6">
          <h1 className="font-display display-page uppercase">{c.name[lang]}</h1>
          <p className="max-w-[560px] text-[19px] leading-relaxed text-ink-2">{c.text[lang]}</p>
          <dl className="grid max-w-[560px] grid-cols-3 gap-4 border-y border-line py-5">
            <div>
              <dt className="text-sm text-muted">{t.classPage.duration}</dt>
              <dd className="mt-1 text-lg font-semibold">{c.mins} {t.common.min}</dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.classPage.level}</dt>
              <dd className="mt-1 flex items-center gap-2 text-lg font-semibold">
                <LevelBars level={c.level} label={t.intensity(c.level)} /> {t.levels[c.level]}
              </dd>
            </div>
            <div>
              <dt className="text-sm text-muted">{t.classPage.perWeekLabel}</dt>
              <dd className="mt-1 font-mono text-lg">{c.perWeek}</dd>
            </div>
          </dl>
          <div>
            <h2 className="text-sm text-muted">{t.classPage.coaches}</h2>
            <div className="mt-2 flex flex-wrap gap-2">
              {c.coaches.map((slug) => {
                const coach = getCoach(slug);
                return coach ? (
                  <Link key={slug} href={href(lang, `/trainers/${slug}`)} className={btn.pill}>
                    {coach.name[lang]}
                  </Link>
                ) : null;
              })}
            </div>
          </div>
        </div>
        <PhotoPlaceholder label={`${t.common.photo}: ${c.photo[lang]}`} className="min-h-[340px] flex-[1_1_420px] rounded-3xl" />
      </div>

      <h2 className="mb-4 mt-14 text-2xl font-semibold">{t.classPage.thisWeek}</h2>
      {upcoming.length === 0 && <p className="text-muted">{t.classPage.none}</p>}
      <div className="flex flex-col gap-2.5">
        {upcoming.map((s) => {
          const coach = getCoach(s.coach);
          const left = spotsLeft(s);
          return (
            <div key={s.id} className="flex flex-wrap items-center gap-x-6 gap-y-3 rounded-[18px] border border-line bg-surface px-5 py-4">
              <div className="w-[160px] font-semibold">
                {t.daysLong[s.day]} {weekDates[s.day]}
              </div>
              <div className="w-[72px] font-mono text-lg">{s.time}</div>
              <div className="min-w-0 flex-1 text-muted">
                {t.common.with} {coach?.first[lang]} · {getRoomName(s.room, lang)}
              </div>
              <div className={isFull(s) ? "text-muted" : left <= 3 ? "text-warn" : "text-ink-2"}>
                {isFull(s) ? t.fullWaitlist : t.spotsLeft(left, s.cap)}
              </div>
              <Link href={href(lang, `/classes?session=${s.id}`)} className={btn.light}>
                {isFull(s) ? t.timetable.joinWaitlist : t.classPage.bookThis}
              </Link>
            </div>
          );
        })}
      </div>
    </Container>
  );
}
