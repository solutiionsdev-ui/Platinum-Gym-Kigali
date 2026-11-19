import type { Metadata } from "next";
import Link from "next/link";
import { LeadForm } from "@/components/site/lead-form";
import { Arrow, Container, PhotoPlaceholder } from "@/components/ui";
import { formatPrice, getPtPackages, getTrainers } from "@/lib/data";
import { getDict, href, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).training.metaTitle };
}

export default async function TrainingPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);

  return (
    <Container className="pb-24 pt-14">
      <h1 className="font-display display-page uppercase">{t.training.title}</h1>
      <p className="mt-3.5 max-w-[640px] text-lg text-ink-2">{t.training.intro}</p>

      <h2 className="mb-[18px] mt-14 text-2xl font-semibold">{t.training.packagesTitle}</h2>
      <div className="flex flex-wrap gap-4">
        {getPtPackages().map((k) => (
          <div key={k.name.en} className="flex min-w-0 flex-[1_1_280px] flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-[26px]">
            <div className="text-lg font-semibold">{k.name[lang]}</div>
            <div className="flex items-baseline gap-2.5">
              <span className="font-display text-[52px] leading-none">{formatPrice(k.price, lang)}</span>
              <span className="text-muted">{k.per[lang]}</span>
            </div>
            <div className="text-[15px] text-muted">{k.note[lang]}</div>
          </div>
        ))}
      </div>

      <h2 className="mb-[18px] mt-14 text-2xl font-semibold">{t.training.trainersTitle}</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {getTrainers().map((c) => (
          <Link key={c.slug} href={href(lang, `/trainers/${c.slug}`)} className="group flex min-w-0 flex-col gap-3.5">
            <PhotoPlaceholder label={`${t.common.portrait}: ${c.name[lang]}`} className="aspect-[4/5] transition group-hover:border-control" />
            <div>
              <div className="text-xl font-semibold">{c.name[lang]}</div>
              <div className="text-[15px] text-muted">{c.role[lang]}</div>
            </div>
            <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
              {t.training.viewProfile} <Arrow className="size-4" />
            </span>
          </Link>
        ))}
      </div>

      <section id="consult" className="mt-16 flex flex-wrap gap-10 rounded-[24px] border border-line bg-surface p-7 sm:p-12">
        <div className="min-w-0 flex-[1_1_340px]">
          <h2 className="font-display display-section uppercase">{t.training.consultTitle}</h2>
          <p className="mt-4 max-w-[420px] text-muted">{t.training.consultText}</p>
        </div>
        <div className="min-w-0 flex-[1_1_380px]">
          <LeadForm lang={lang} mode="consult" idPrefix="consult" />
        </div>
      </section>
    </Container>
  );
}
