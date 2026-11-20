"use client";

import clsx from "clsx";
import { Menu, Sparkles, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { LogoMark, Wordmark } from "@/components/logo";
import { Container } from "@/components/ui";
import { getDict, href, type Lang } from "@/lib/i18n";

const MAIN = [
  { path: "/programs", label: "Programs" },
  { path: "/classes", label: "Classes" },
  { path: "/online", label: "Online coaching" },
  { path: "/tour", label: "Virtual tour" },
  { path: "/memberships", label: "Prices" },
  { path: "/contact", label: "Contact" },
];
const MORE = [
  { path: "/first-visit", label: "Your first visit" },
  { path: "/training", label: "Personal training" },
  { path: "/facilities", label: "Facilities" },
  { path: "/about", label: "About Gael & the gym" },
  { path: "/trial", label: "Free trial" },
];

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = getDict(lang);
  const pathname = usePathname() || `/${lang}`;
  const [open, setOpen] = useState(false);

  // Close the phone menu after moving to another page.
  useEffect(() => setOpen(false), [pathname]);

  const isActive = (path: string) => pathname === href(lang, path) || pathname.startsWith(href(lang, path) + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-line-soft bg-bg/95 backdrop-blur">
      <Container className="flex items-center justify-between gap-6 py-3">
        <Link href={href(lang)} aria-label={t.common.homeLabel} className="flex items-center gap-2.5">
          <LogoMark image size={44} />
          <Wordmark />
        </Link>

        <nav aria-label={t.nav.main} className="hidden items-center gap-6 text-[15px] font-medium xl:flex">
          {MAIN.map((l) => (
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
          <Link href={href(lang, "/start")} className="hidden min-h-[44px] items-center gap-2 rounded-full bg-accent px-5 text-[15px] font-semibold text-bg transition hover:brightness-95 sm:inline-flex">
            <Sparkles aria-hidden className="size-4" /> Find my program
          </Link>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.nav.close : t.nav.menu}
            className="inline-flex size-11 items-center justify-center rounded-full border border-line xl:hidden"
          >
            {open ? <X aria-hidden className="size-5" /> : <Menu aria-hidden className="size-5" />}
          </button>
        </div>
      </Container>

      {open && (
        <nav id="mobile-menu" aria-label={t.nav.main} className="max-h-[80vh] overflow-y-auto border-t border-line-soft xl:hidden">
          <Container className="flex flex-col py-2">
            {[{ path: "", label: t.nav.home }, { path: "/start", label: "Find my program (quiz)" }, ...MAIN, ...MORE].map((l) => {
              const on = l.path ? isActive(l.path) : pathname === href(lang);
              return (
                <Link
                  key={l.path || "home"}
                  href={href(lang, l.path)}
                  aria-current={on ? "page" : undefined}
                  className={clsx("flex min-h-12 items-center border-b border-line-soft text-[17px] font-medium last:border-0", on ? "text-accent" : "text-ink")}
                >
                  {l.label}
                </Link>
              );
            })}
          </Container>
        </nav>
      )}
    </header>
  );
}
