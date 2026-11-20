"use client";

import clsx from "clsx";
import {
  Banknote, BriefcaseBusiness, CalendarDays, Check, Dumbbell, ExternalLink, House, MessageCircle, MoreHorizontal, SlidersHorizontal, Users, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { LogoMark } from "@/components/logo";
import { brand } from "@/lib/brand";
import { activeCount } from "@/lib/crm-data";
import { getClassType, getSessions } from "@/lib/data";
import { readDemoData, useDemoData, WEB_LEAD_SOURCE } from "@/lib/demo-store";
import { useToast } from "./toast";

const NAV = [
  { href: "/admin", label: "Today", icon: House, badge: "7" },
  { href: "/admin/schedule", label: "Calendar", icon: CalendarDays },
  { href: "/admin/members", label: "Members", icon: Users, badge: String(activeCount()) },
  { href: "/admin/training", label: "Training", icon: Dumbbell },
  { href: "/admin/money", label: "Money", icon: Banknote },
  { href: "/admin/team", label: "Team", icon: BriefcaseBusiness },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle, badge: "3" },
  { href: "/admin/settings", label: "Settings", icon: SlidersHorizontal },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
}

function Brand({ size = 40 }: { size?: number }) {
  return (
    <>
      <LogoMark image size={size} rounded="circle" />
      <span className="leading-tight">
        <span className="block font-[family-name:var(--font-anton)] text-[20px] tracking-[0.08em] text-white">{brand.wordmark}</span>
        <span className="block text-xs text-side-muted">Gym admin</span>
      </span>
    </>
  );
}

/** Pops a message in the CRM when someone books or sends a form on the website (any tab of this browser). */
function useWebActivityAlerts() {
  const data = useDemoData();
  const toast = useToast();
  const seen = useRef<Set<string> | null>(null);
  useEffect(() => {
    if (seen.current === null) {
      // Start from what was already there when the CRM opened: only new things pop up.
      const start = readDemoData();
      seen.current = new Set([...start.bookings.map((b) => b.id), ...start.leads.map((l) => l.id)]);
    }
    for (const b of data.bookings) {
      if (seen.current.has(b.id)) continue;
      seen.current.add(b.id);
      const s = getSessions().find((x) => x.id === b.sessionId);
      const cls = s ? `${getClassType(s.type)?.name.en} at ${s.time}` : "a class";
      toast(`Website: ${b.name} ${b.waitlist ? "joined the waitlist for" : "booked"} ${cls}`);
    }
    for (const l of data.leads) {
      if (seen.current.has(l.id)) continue;
      seen.current.add(l.id);
      toast(`${WEB_LEAD_SOURCE[l.kind]}: ${l.name}`);
    }
  }, [data, toast]);
  return data.bookings.length + data.leads.length;
}

export function CrmShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);
  const webCount = useWebActivityAlerts();

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar on computers */}
      <nav aria-label="CRM" className="on-dark sticky top-0 hidden h-screen w-[236px] shrink-0 flex-col gap-1 overflow-y-auto bg-side px-3.5 py-5 text-side-text lg:flex">
        <Link href="/admin" className="flex items-center gap-3 px-2 pb-5 pt-1">
          <Brand />
        </Link>
        {NAV.map((n) => {
          const on = isActive(pathname, n.href);
          const live = n.href === "/admin" && webCount > 0;
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={clsx(
                "flex min-h-11 items-center gap-3 rounded-[10px] px-3 transition",
                on ? "bg-accent font-semibold text-ink" : "font-medium text-side-text/85 hover:bg-white/[0.06] hover:text-white",
              )}
            >
              <n.icon aria-hidden className="size-[18px]" strokeWidth={on ? 2 : 1.8} />
              <span className="flex-1">{n.label}</span>
              {live && <span aria-label={`${webCount} from the website`} className={clsx("size-2 rounded-full", on ? "bg-ink" : "bg-accent")} />}
              {n.badge && <span className={clsx("font-mono text-xs", on ? "text-ink/70" : "text-side-muted")}>{n.badge}</span>}
            </Link>
          );
        })}
        <Link href="/admin/messages/assistant" className="mt-auto flex flex-col gap-1 rounded-xl border border-side-line bg-side-2 px-3 py-3.5 hover:border-[#45484c]">
          <span className="flex items-center gap-2 text-sm font-semibold text-white">
            <span aria-hidden className="size-2 rounded-full bg-online" />
            WhatsApp assistant
          </span>
          <span className="text-[13px] text-side-muted">Demo mode · try it</span>
        </Link>
        <Link href="/en" className="flex min-h-11 items-center gap-2 px-3 text-sm text-side-muted hover:text-white">
          <ExternalLink aria-hidden className="size-4" /> View website
        </Link>
        <Link href="/guide" className="-mt-2 flex min-h-11 items-center gap-2 px-3 text-sm text-side-muted hover:text-white">
          <ExternalLink aria-hidden className="size-4" /> Demo guide
        </Link>
        <div className="flex items-center gap-2.5 border-t border-side-line px-2.5 pt-3">
          <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-ink">{brand.owner.initials}</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold text-white">{brand.owner.name}</span>
            <span className="block text-xs text-side-muted">Owner</span>
          </span>
        </div>
      </nav>

      {/* Top bar on phones */}
      <header className="on-dark sticky top-0 z-30 flex items-center justify-between bg-side px-4 py-2.5 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2.5">
          <Brand size={34} />
        </Link>
        <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-accent text-[13px] font-semibold text-ink" title={brand.owner.name}>
          {brand.owner.initials}
        </span>
      </header>

      <main id="main" className="min-w-0 flex-1 px-4 pb-28 pt-5 sm:px-8 sm:pt-7 lg:pb-12">
        <div className="mx-auto flex max-w-[1160px] flex-col gap-5">{children}</div>
      </main>

      {/* Bottom bar on phones */}
      <nav aria-label="CRM" className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-around border-t border-border bg-surface px-1 pb-[18px] pt-1.5 lg:hidden">
        {[NAV[0], NAV[1]].map((n) => (
          <BottomLink key={n.href} href={n.href} label={n.label} on={isActive(pathname, n.href)}>
            <n.icon aria-hidden className="size-[22px]" strokeWidth={isActive(pathname, n.href) ? 2 : 1.8} />
          </BottomLink>
        ))}
        <BottomLink href="/admin/members/check-in" label="Check in" on={pathname === "/admin/members/check-in"}>
          <span className="flex h-8 w-11 items-center justify-center rounded-[10px] bg-side">
            <Check aria-hidden className="size-5 text-accent" strokeWidth={2.2} />
          </span>
        </BottomLink>
        <BottomLink href="/admin/members" label="Members" on={isActive(pathname, "/admin/members") && pathname !== "/admin/members/check-in"}>
          <Users aria-hidden className="size-[22px]" strokeWidth={1.8} />
        </BottomLink>
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          className="flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium text-muted"
        >
          <MoreHorizontal aria-hidden className="size-[22px]" />
          More
        </button>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true" aria-label="All sections">
          <div aria-hidden className="absolute inset-0 bg-black/40" onClick={() => setMenuOpen(false)} />
          <div className="absolute inset-x-0 bottom-0 rounded-t-2xl bg-surface px-4 pb-8 pt-3">
            <div className="flex items-center justify-between pb-2">
              <span className="font-semibold">All sections</span>
              <button type="button" onClick={() => setMenuOpen(false)} aria-label="Close" className="inline-flex size-11 items-center justify-center rounded-full">
                <X aria-hidden className="size-5" />
              </button>
            </div>
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="flex min-h-12 items-center gap-3 border-b border-divider text-[17px] last:border-0">
                <n.icon aria-hidden className="size-5 text-muted" strokeWidth={1.8} />
                {n.label}
              </Link>
            ))}
            <Link href="/en" className="flex min-h-12 items-center gap-3 border-b border-divider text-[17px] text-muted">
              <ExternalLink aria-hidden className="size-5" /> View website
            </Link>
            <Link href="/guide" className="flex min-h-12 items-center gap-3 text-[17px] text-muted">
              <ExternalLink aria-hidden className="size-5" /> Demo guide
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function BottomLink({ href, label, on, children }: { href: string; label: string; on: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      aria-current={on ? "page" : undefined}
      className={clsx("relative flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-xs", on ? "font-semibold text-ink" : "font-medium text-muted")}
    >
      {on && <span aria-hidden className="absolute top-0 h-[3px] w-8 rounded-full bg-accent" />}
      {children}
      {label}
    </Link>
  );
}

/** A button that shows what would happen, since nothing is saved or sent in the demo. */
export function DemoButton({ message, children, className }: { message: string; children: ReactNode; className?: string }) {
  const toast = useToast();
  return (
    <button type="button" onClick={() => toast(message)} className={className}>
      {children}
    </button>
  );
}
