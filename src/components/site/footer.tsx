import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { Container } from "@/components/ui";
import { brand } from "@/lib/brand";
import { getDict, href, type Lang } from "@/lib/i18n";

/** Where WhatsApp buttons go: the gym's chat when a number is set, otherwise the contact page. */
export function whatsappHref(lang: Lang) {
  return brand.whatsappNumber ? `https://wa.me/${brand.whatsappNumber}` : href(lang, "/contact");
}

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  return (
    <footer className="border-t border-line-soft">
      <Container className="flex flex-wrap justify-between gap-4 py-8 text-sm text-muted">
        <div className="flex flex-col gap-1">
          <span>{t.footer.rights}</span>
          <span>{t.footer.demo}</span>
        </div>
        <nav aria-label={t.nav.footer} className="flex flex-wrap gap-6">
          <Link href={href(lang, "/classes")} className="hover:text-ink">{t.nav.timetable}</Link>
          <Link href={href(lang, "/memberships")} className="hover:text-ink">{t.nav.memberships}</Link>
          <Link href={href(lang, "/memberships#faq")} className="hover:text-ink">{t.footer.faq}</Link>
          <Link href={href(lang, "/contact")} className="hover:text-ink">{t.nav.contact}</Link>
          <a href={brand.instagram} className="hover:text-ink">Instagram</a>
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
      <Link href={href(lang, "/trial")} className="flex min-h-[52px] flex-1 items-center justify-center rounded-full bg-accent text-[17px] font-semibold text-bg">
        {t.common.bookFreeTrial}
      </Link>
      <a href={whatsappHref(lang)} aria-label={t.common.whatsappUs} className="inline-flex size-[52px] items-center justify-center rounded-full border border-control">
        <MessageCircle aria-hidden className="size-[22px]" strokeWidth={1.8} />
      </a>
    </div>
  );
}
