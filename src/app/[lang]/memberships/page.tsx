import { Check, ChevronDown, Users } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { whatsappHref } from "@/components/site/footer";
import { Container, PriceTag, btn } from "@/components/ui";
import { getBenefits, getFaqs, getPasses, getPlans, getPtPackages } from "@/lib/data";
import { getDict, href, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).memberships.metaTitle };
}

export default async function MembershipsPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);

  return (
    <Container className="pb-24 pt-14">
      <h1 className="font-display display-page uppercase">Packages & prices</h1>
      <p className="mt-3.5 max-w-[640px] text-lg text-ink-2">
        One price, everything included. Pick how long you want to commit: the longer, the cheaper per month. Pay at the desk in cash, by card, MTN MoMo or Airtel Money.
      </p>

      {/* What every package includes */}
      <section aria-labelledby="inc-h" className="mt-10 rounded-[22px] border border-line bg-surface p-6 sm:p-8">
        <h2 id="inc-h" className="text-xl font-semibold">Every package includes</h2>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {getBenefits().map((b) => (
            <li key={b.en} className="flex items-center gap-3 text-[17px]">
              <Check aria-hidden className="size-5 shrink-0 text-accent" strokeWidth={2.4} />
              {b[lang]}
            </li>
          ))}
          <li className="flex items-center gap-3 text-[17px]">
            <Check aria-hidden className="size-5 shrink-0 text-accent" strokeWidth={2.4} />
            <span>A <Link href={href(lang, "/programs")} className="underline decoration-accent underline-offset-4">training program</Link> for your goal</span>
          </li>
        </ul>
      </section>

      {/* Packages */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {getPlans().map((p) => (
          <div key={p.id} className={`flex min-w-0 flex-col gap-3 rounded-[22px] bg-surface ${p.best ? "border-2 border-accent p-[27px]" : "border border-line p-7"}`}>
            <div className="flex min-h-[26px] items-center justify-between gap-2.5">
              <span className="text-lg font-semibold">{p.name[lang]}</span>
              {p.best && <span className="rounded-full bg-accent px-2.5 py-1 text-xs font-bold uppercase tracking-[0.1em] text-bg">{t.memberships.bestValue}</span>}
            </div>
            <div className="font-display text-[52px] leading-none"><PriceTag n={p.price} /></div>
            <div className="text-[15px] text-muted">{p.per[lang]}</div>
            <ul className="flex flex-col gap-1.5 text-[15px]">
              {p.points.map((pt) => (
                <li key={pt.en} className="flex items-start gap-2"><Check aria-hidden className="mt-0.5 size-4 shrink-0 text-accent" strokeWidth={2.4} />{pt[lang]}</li>
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

      {/* Other ways */}
      <h2 className="mb-[18px] mt-14 text-2xl font-semibold">Other ways to train</h2>
      <div className="flex flex-wrap gap-4">
        {getPasses().map((p) => (
          <div key={p.name.en} className="flex min-w-0 flex-[1_1_300px] items-center justify-between gap-4 rounded-[18px] border border-line px-6 py-[22px]">
            <div>
              <div className="text-lg font-semibold">{p.name[lang]}</div>
              <div className="text-[15px] text-muted">{p.note[lang]}</div>
            </div>
            {p.price > 0 ? (
              <div className="font-display text-[36px] leading-none"><PriceTag n={p.price} /></div>
            ) : (
              <a href={whatsappHref(lang)} className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full border border-control px-4 font-semibold">
                <Users aria-hidden className="size-4" /> Ask us
              </a>
            )}
          </div>
        ))}
      </div>

      {/* Personal training */}
      <section id="pt" className="mt-16">
        <div className="mb-[22px] flex flex-wrap items-end justify-between gap-6">
          <h2 className="font-display display-section uppercase">{t.memberships.ptTitle}</h2>
          <p className="max-w-[460px] text-muted">{t.memberships.ptText}</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {getPtPackages().map((k) => (
            <div key={k.name.en} className="flex min-w-0 flex-[1_1_300px] flex-col gap-2.5 rounded-[20px] border border-line bg-surface p-[26px]">
              <div className="text-lg font-semibold">{k.name[lang]}</div>
              <div className="flex flex-wrap items-baseline gap-2.5">
                <span className="font-display text-[44px] leading-none"><PriceTag n={k.price} /></span>
                <span className="text-muted">{k.per[lang]}</span>
              </div>
              <div className="text-[15px] text-muted">{k.note[lang]}</div>
            </div>
          ))}
        </div>
        <div className="mt-[18px] flex flex-wrap items-center gap-3">
          <Link href={href(lang, "/training#consult")} className={btn.accent}>{t.memberships.bookConsult}</Link>
          <Link href={href(lang, "/online")} className={btn.outline}>Or train online, from home</Link>
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
