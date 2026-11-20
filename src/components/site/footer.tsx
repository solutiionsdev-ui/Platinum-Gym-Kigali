import Link from "next/link";
import { MessageCircle, Sparkles } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { Container } from "@/components/ui";
import { brand } from "@/lib/brand";
import { getDict, href, type Lang } from "@/lib/i18n";

/** Where WhatsApp buttons go: the gym's chat when a number is set, otherwise the contact page. */
export function whatsappHref(lang: Lang) {
  return brand.whatsappNumber ? `https://wa.me/${brand.whatsappNumber}` : href(lang, "/contact");
}

const COLUMNS = [
  { title: "Train", links: [["/start", "Find my program"], ["/programs", "Programs"], ["/classes", "Classes"], ["/online", "Online coaching"], ["/training", "Personal training"]] },
  { title: "The gym", links: [["/tour", "Virtual tour"], ["/first-visit", "Your first visit"], ["/facilities", "Facilities"], ["/about", "About Gael"], ["/memberships", "Prices"]] },
];

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <footer className="border-t border-line-soft bg-surface-2">
      <Container className="grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr]">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2.5">
            <LogoMark image size={40} />
            <span className="font-[family-name:var(--font-anton)] text-[22px] tracking-[0.06em]">{brand.wordmark}</span>
          </div>
          <p className="text-muted">{brand.address.en}</p>
          <p className="text-muted"><span className="text-ink">Open 24 hours</span>, every day</p>
          <a href={`tel:${brand.phone.replace(/\s/g, "")}`} className="font-mono text-ink">{brand.phone}</a>
          <a href={`mailto:${brand.email}`} className="text-muted hover:text-ink">{brand.email}</a>
        </div>
        {COLUMNS.map((c) => (
          <nav key={c.title} aria-label={c.title} className="flex flex-col gap-2">
            <h2 className="mb-1 text-sm font-semibold uppercase tracking-[0.14em] text-muted">{c.title}</h2>
            {c.links.map(([p, l]) => (
              <Link key={p} href={href(lang, p)} className="min-h-9 text-ink-2 hover:text-ink">{l}</Link>
            ))}
          </nav>
        ))}
      </Container>
      <Container className="flex flex-wrap justify-between gap-4 border-t border-line-soft py-6 text-sm text-muted">
        <span>{t.footer.rights}</span>
        <nav aria-label={t.nav.footer} className="flex flex-wrap gap-6">
          <Link href={href(lang, "/memberships#faq")} className="hover:text-ink">{t.footer.faq}</Link>
          <a href={brand.instagram} className="hover:text-ink">Instagram</a>
          <span>{t.footer.demo}</span>
        </nav>
      </Container>
    </footer>
  );
}

/** Phone-only bar pinned to the bottom of the screen. */
export function MobileCta({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t border-line-soft bg-bg px-4 pb-5 pt-3 md:hidden">
      <Link href={href(lang, "/start")} className="flex min-h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-accent text-[17px] font-semibold text-bg">
        <Sparkles aria-hidden className="size-5" /> Find my program
      </Link>
      <a href={whatsappHref(lang)} aria-label={t.common.whatsappUs} className="inline-flex size-[52px] items-center justify-center rounded-full border border-control">
        <MessageCircle aria-hidden className="size-[22px]" strokeWidth={1.8} />
      </a>
    </div>
  );
}
