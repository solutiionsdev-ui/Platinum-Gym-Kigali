import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LeadForm } from "@/components/site/lead-form";
import { Arrow, Container, PhotoPlaceholder, btn } from "@/components/ui";
import { getClassType, getCoach, getCoaches, getRoomName, getSessionsForCoach, isFull, isPast, weekDates } from "@/lib/data";
import { getDict, href, isLang, languages, type Lang } from "@/lib/i18n";

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.flatMap((lang) => getCoaches().map((c) => ({ lang, slug: c.slug })));
}

type Params = Promise<{ lang: string; slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang, slug } = await params;
  const c = getCoach(slug);
  return { title: c && isLang(lang) ? c.name[lang] : undefined };
}

export default async function TrainerPage({ params }: { params: Params }) {
  const { lang: raw, slug } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = getDict(lang);
  const c = getCoach(slug);
  if (!c) notFound();
  const classes = getSessionsForCoach(c.slug).filter((s) => !isPast(s));

  return (
    <Container className="pb-24 pt-10">
      <Link href={href(lang, c.trainer ? "/training" : "/classes")} className="inline-flex min-h-11 items-center gap-1.5 text-[15px] text-muted hover:text-ink">
        <Arrow className="size-4 rotate-180 rtl:rotate-0" /> {c.trainer ? t.trainer.allTrainers : t.classPage.allClasses}
      </Link>

      <div className="mt-4 flex flex-wrap gap-12">
        <PhotoPlaceholder label={`${t.common.portrait}: ${c.name[lang]}`} className="aspect-[4/5] w-full max-w-[400px] flex-[0_1_400px]" />
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-6">
          <div>
            <h1 className="font-display display-page uppercase">{c.name[lang]}</h1>
            <p className="mt-2 text-lg text-muted">{c.role[lang]}</p>
          </div>
          <p className="max-w-[560px] text-[19px] leading-relaxed text-ink-2">{c.bio[lang]}</p>
          <div>
            <h2 className="text-sm text-muted">{t.trainer.specialties}</h2>
            <ul className="mt-2 flex flex-wrap gap-2">
              {c.specialties.map((s) => (
                <li key={s.en} className="rounded-full border border-line px-4 py-2 text-[15px]">{s[lang]}</li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm text-muted">{t.trainer.classesThisWeek}</h2>
            {classes.length === 0 ? (
              <p className="mt-2">{t.trainer.noClasses}</p>
            ) : (
              <ul className="mt-2 flex flex-col">
                {classes.map((s) => (
                  <li key={s.id} className="flex min-h-12 flex-wrap items-center gap-x-4 border-b border-line-soft py-2">
                    <span className="w-[120px] font-semibold">{t.days[s.day]} {weekDates[s.day]}</span>
                    <span className="w-[56px] font-mono">{s.time}</span>
                    <span className="flex-1">{getClassType(s.type)?.name[lang]} · <span className="text-muted">{getRoomName(s.room, lang)}</span></span>
                    <Link href={href(lang, `/classes?session=${s.id}`)} className="inline-flex min-h-11 items-center font-semibold text-accent">
                      {isFull(s) ? t.timetable.joinWaitlist : t.common.book}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {!c.trainer && (
            <Link href={href(lang, `/classes?type=${getClassType(classes[0]?.type ?? "")?.slug ?? "all"}`)} className={`${btn.accent} self-start`}>
              {t.common.seeTimetable}
            </Link>
          )}
        </div>
      </div>

      {c.trainer && (
        <section className="mt-16 flex flex-wrap gap-10 rounded-[24px] border border-line bg-surface p-7 sm:p-12">
          <div className="min-w-0 flex-[1_1_340px]">
            <h2 className="font-display display-section uppercase">{t.trainer.bookConsult}</h2>
            <p className="mt-4 max-w-[420px] text-muted">{t.training.consultText}</p>
          </div>
          <div className="min-w-0 flex-[1_1_380px]">
            <LeadForm lang={lang} mode="consult" initialChoice={c.slug} idPrefix="trainer-consult" />
          </div>
        </section>
      )}
    </Container>
  );
}
