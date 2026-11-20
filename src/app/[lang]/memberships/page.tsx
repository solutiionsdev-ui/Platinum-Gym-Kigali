import { Check, ChevronDown } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { Container, btn, PriceTag } from "@/components/ui";
import { getCompareRows, getFaqs, getPasses, getPlans, getPtPackages } from "@/lib/data";
import { getDict, href, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).memberships.metaTitle };
}

export default async function MembershipsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);
  const plans = getPlans();

  return (
    <Container className="pb-24 pt-14">
      <h1 className="font-display display-page uppercase">{t.memberships.title}</h1>
      <p className="mt-3.5 max-w-[640px] text-lg text-ink-2">{t.memberships.intro}</p>

      {/* Time plans */}
      <div className="mt-11 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {plans.map((p) => (
          <div key={p.id} className={`flex min-w-0 flex-col gap-3.5 rounded-[22px] bg-surface ${p.best ? "border-2 border-accent p-[27px]" : "border border-line p-7"}`}>
            <div className="flex min-h-[26px] items-center justify-between gap-2.5">
              <span className="text-lg font-semibold">{p.name[lang]}</span>
              {p.best && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-bg">{t.memberships.bestValue}</span>}
            </div>
            <div className="font-display text-[60px] leading-none"><PriceTag n={p.price} /></div>
            <div className="-mt-1.5 text-[15px] text-muted">{p.per[lang]}</div>
            <ul className="mt-1.5 flex flex-col gap-2 text-[15px]">
              {p.points.map((pt) => (
                <li key={pt.en} className="flex items-start gap-2.5">
                  <Check aria-hidden className="mt-[3px] size-[18px] shrink-0 text-accent" strokeWidth={2.2} />
                  <span>{pt[lang]}</span>
                </li>
              ))}
            </ul>
            <Link
              href={href(lang, `/trial?plan=${p.id}`)}
              className={`mt-auto inline-flex min-h-12 items-center justify-center rounded-full font-semibold ${p.best ? "bg-accent text-bg" : "border border-control"}`}
            >
              {t.memberships.request}
            </Link>
          </div>
        ))}
      </div>

      {/* No commitment */}
      <h2 className="mb-[18px] mt-16 text-2xl font-semibold">{t.memberships.noCommitment}</h2>
      <div className="flex flex-wrap gap-4">
        {getPasses().map((p) => (
          <div key={p.name.en} className="flex min-w-0 flex-[1_1_300px] items-center justify-between gap-4 rounded-[18px] border border-line px-6 py-[22px]">
            <div>
              <div className="text-lg font-semibold">{p.name[lang]}</div>
              <div className="text-[15px] text-muted">{p.note[lang]}</div>
            </div>
            <div className="font-display text-[40px] leading-none"><PriceTag n={p.price} /></div>
          </div>
        ))}
      </div>

      {/* Comparison */}
      <h2 className="mb-[18px] mt-16 text-2xl font-semibold">{t.memberships.includesTitle}</h2>
      <div className="overflow-x-auto rounded-[18px] border border-line">
        <table className="w-full min-w-[720px] border-collapse text-[15px]">
          <thead>
            <tr className="text-start text-muted">
              <th scope="col" className="border-b border-line px-5 py-4 text-start font-semibold">{t.memberships.included}</th>
              {plans.map((p) => (
                <th key={p.id} scope="col" className={`border-b border-line px-5 py-4 text-start font-semibold ${p.best ? "text-accent" : ""}`}>
                  {p.name[lang]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getCompareRows().map((r) => (
              <tr key={r.label.en}>
                <th scope="row" className="border-b border-line-soft px-5 py-[15px] text-start font-medium">{r.label[lang]}</th>
                {r.values.map((v, i) => (
                  <td key={i} className={`border-b border-line-soft px-5 py-[15px] ${i === 3 ? "font-semibold text-ink" : "text-ink-2"}`}>
                    {v[lang]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Personal training */}
      <section id="pt" className="mt-[72px]">
        <div className="mb-[22px] flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display display-section uppercase">{t.memberships.ptTitle}</h2>
          <p className="max-w-[460px] text-muted">{t.memberships.ptText}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {getPtPackages().map((k) => (
            <div key={k.name.en} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-[26px]">
              <div className="text-lg font-semibold">{k.name[lang]}</div>
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-[52px] leading-none"><PriceTag n={k.price} /></span>
                <span className="text-muted">{k.per[lang]}</span>
              </div>
              <div className="text-[15px] text-muted">{k.note[lang]}</div>
            </div>
          ))}
        </div>
        <div className="mt-[18px] flex flex-wrap items-center gap-3">
          <Link href={href(lang, "/training#consult")} className={btn.accent}>{t.memberships.bookConsult}</Link>
          <span className="text-[15px] text-muted">{t.memberships.trainersLine}</span>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mt-[72px] max-w-[860px]">
        <h2 className="mb-3 text-2xl font-semibold">{t.memberships.faqTitle}</h2>
        {getFaqs().map((q) => (
          <details key={q.q.en} className="group border-b border-line py-1">
            <summary className="flex min-h-[52px] cursor-pointer items-center justify-between gap-4 text-[17px] font-medium">
              {q.q[lang]}
              <ChevronDown aria-hidden className="size-5 shrink-0 text-muted transition group-open:rotate-180" />
            </summary>
            <p className="mb-[18px] max-w-[720px] text-muted">{q.a[lang]}</p>
          </details>
        ))}
      </section>
    </Container>
  );
}
