"use client";

import clsx from "clsx";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "@/components/logo";
import { Container, btn } from "@/components/ui";
import { getDict, href, switchLangPath, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);

  // Close the phone menu after moving to another page.
  useEffect(() => setOpen(false), [pathname]);

  const links = [
    { path: "/classes", label: t.nav.timetable },
    { path: "/memberships", label: t.nav.memberships },
    { path: "/training", label: t.nav.training },
    { path: "/facilities", label: t.nav.facilities },
    { path: "/about", label: t.nav.about },
    { path: "/contact", label: t.nav.contact },
  ];
  const isActive = (path: string) => pathname === href(lang, path) || pathname.startsWith(href(lang, path) + "/");
  const other: Lang = lang === "en" ? "ar" : "en";

  return (
    <header className="border-b border-line-soft">
      <Container className="flex items-center justify-between gap-6 py-3 sm:py-[18px]">
        <Link href={href(lang)} aria-label={t.common.homeLabel} className="flex items-center gap-2.5">
          <LogoMark />
          <Wordmark />
        </Link>

        <nav aria-label={t.nav.main} className="hidden items-center gap-7 text-[15px] font-medium lg:flex">
          {links.map((l) => (
            <Link
              key={l.path}
              href={href(lang, l.path)}
              aria-current={isActive(l.path) ? "page" : undefined}
              className={clsx("transition hover:text-white", isActive(l.path) ? "text-accent" : "text-ink")}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link href={switchLangPath(pathname, other)} lang={other} hrefLang={other} className={btn.pill}>
            {t.otherLangLabel}
          </Link>
          <Link href={href(lang, "/trial")} className="hidden min-h-[44px] items-center rounded-full bg-accent px-5 text-[15px] font-semibold text-bg transition hover:brightness-95 sm:inline-flex">
            {t.nav.freeTrial}
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line lg:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-menu" aria-label={t.nav.main} className="border-t border-line-soft lg:hidden">
          <Container className="flex flex-col py-2">
            {[{ path: "", label: t.nav.home }, ...links, { path: "/trial", label: t.nav.freeTrial }].map((l) => (
              <Link
                key={l.path || "home"}
                href={href(lang, l.path)}
                aria-current={(l.path ? isActive(l.path) : pathname === href(lang)) ? "page" : undefined}
                className={clsx(
                  "flex min-h-12 items-center border-b border-line-soft text-[17px] font-medium last:border-0",
                  (l.path ? isActive(l.path) : pathname === href(lang)) ? "text-accent" : "text-ink",
                )}
              >
                {l.label}
              </Link>
            ))}
          </Container>
        </nav>
      )}
    </header>
  );
}
