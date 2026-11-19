import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MemberBookings } from "@/components/site/member-bookings";
import { Container, btn } from "@/components/ui";
import { getCoach, getDemoMember } from "@/lib/data";
import { getDict, href, isLang, type Lang } from "@/lib/i18n";

type Params = Promise<{ lang: string; code: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { lang } = await params;
  // Private page: keep it out of search engines.
  return { title: getDict(isLang(lang) ? lang : "en").myBookings.metaTitle, robots: { index: false, follow: false } };
}

/** The member's private page, opened from the link in their WhatsApp messages. No login. */
export default async function MyBookingsPage({ params }: { params: Params }) {
  const { lang: raw, code } = await params;
  const lang: Lang = isLang(raw) ? raw : "en";
  const t = getDict(lang);
  const m = getDemoMember(code);
  if (!m) notFound();
  const trainer = getCoach(m.trainer);
  const usedPct = Math.round(((365 - m.daysLeft) / 365) * 100);

  return (
    <Container className="pb-24 pt-12">
      <div className="max-w-[760px]">
      <h1 className="font-display display-page uppercase">{t.myBookings.hello(m.first[lang])}</h1>
      <p className="mt-3 text-ink-2">{t.myBookings.intro}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-6">
          <h2 className="text-sm text-muted">{t.myBookings.membership}</h2>
          <div className="text-xl font-semibold">{m.plan[lang]}</div>
          <div className="h-1.5 overflow-hidden rounded-[3px] bg-line">
            <div className="h-1.5 bg-accent" style={{ width: `${usedPct}%` }} />
          </div>
          <div className="flex flex-wrap justify-between gap-2 text-[15px] text-muted">
            <span>{t.myBookings.ends(m.ends[lang])}</span>
            <span>{t.myBookings.daysLeft(m.daysLeft)}</span>
          </div>
        </section>
        <section className="flex flex-col gap-3 rounded-[20px] border border-line bg-surface p-6">
          <h2 className="text-sm text-muted">{t.myBookings.pt}</h2>
          <div className="text-xl font-semibold">{t.myBookings.ptLeft(m.ptLeft, trainer?.first[lang] ?? "")}</div>
          <div className="flex gap-1" aria-hidden>
            {Array.from({ length: 10 }, (_, i) => (
              <span key={i} className={`h-2.5 flex-1 rounded-[3px] ${i < 10 - m.ptLeft ? "bg-faint" : "bg-accent"}`} />
            ))}
          </div>
        </section>
      </div>

      <section className="mt-6 rounded-[20px] border border-line bg-surface px-6 py-2">
        <h2 className="pt-4 text-sm text-muted">{t.myBookings.upcoming}</h2>
        <MemberBookings lang={lang} bookings={m.bookings} />
      </section>
      <p className="mt-4 text-sm text-muted">{t.myBookings.cancelNote}</p>
      <Link href={href(lang, "/classes")} className={`${btn.accent} mt-6`}>{t.myBookings.bookMore}</Link>
      </div>
    </Container>
  );
}
