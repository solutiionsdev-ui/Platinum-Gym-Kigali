import type { Metadata } from "next";
import { LeadForm } from "@/components/site/lead-form";
import { Container, PhotoPlaceholder } from "@/components/ui";
import { getClassType, getPlans } from "@/lib/data";
import { getDict, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).trial.metaTitle };
}

/** Free trial request. With ?plan=12m it becomes "request this plan" (from the Memberships page). */
export default async function TrialPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ plan?: string; type?: string }>;
}) {
  const lang = await langFrom(params);
  const { plan, type } = await searchParams;
  const t = getDict(lang);
  const chosenPlan = getPlans().find((p) => p.id === plan);

  return (
    <Container className="flex flex-wrap gap-12 pb-24 pt-14">
      <div className="flex min-w-0 flex-[1_1_440px] flex-col gap-6">
        <h1 className="font-display display-page uppercase">{chosenPlan ? `${t.memberships.title} · ${chosenPlan.name[lang]}` : t.trial.title}</h1>
        <p className="max-w-[520px] text-lg text-ink-2">{chosenPlan ? t.memberships.requestIntro : t.trial.text}</p>
        <div className="max-w-[520px] rounded-[22px] border border-line bg-surface p-6 sm:p-8">
          {chosenPlan ? (
            <LeadForm lang={lang} mode="plan" initialChoice={chosenPlan.id} idPrefix="plan" />
          ) : (
            <LeadForm lang={lang} mode="trial" initialChoice={getClassType(type ?? "")?.slug ?? ""} idPrefix="trial" />
          )}
        </div>
      </div>
      <PhotoPlaceholder label={`${t.common.photo}: ${t.home.photoHero}`} className="hidden min-h-[520px] flex-[1_1_420px] rounded-3xl md:flex" />
    </Container>
  );
}
