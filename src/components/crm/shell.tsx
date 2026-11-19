"use client";

import clsx from "clsx";
import {
  Banknote, BriefcaseBusiness, CalendarDays, Check, Dumbbell, ExternalLink, House, MessageCircle, MoreHorizontal, SlidersHorizontal, Users, X,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { brand } from "@/lib/brand";
import { useToast } from "./toast";

const NAV = [
  { href: "/admin", label: "Today", icon: House, badge: "7" },
  { href: "/admin/schedule", label: "Schedule", icon: CalendarDays },
  { href: "/admin/members", label: "Members", icon: Users, badge: "486" },
  { href: "/admin/training", label: "Training", icon: Dumbbell },
  { href: "/admin/money", label: "Money", icon: Banknote },
  { href: "/admin/team", label: "Team", icon: BriefcaseBusiness },
  { href: "/admin/messages", label: "Messages", icon: MessageCircle, badge: "3" },
  { href: "/admin/settings", label: "Settings", icon: SlidersHorizontal },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname === href || pathname.startsWith(href + "/");
}

function Mark({ size = 32 }: { size?: number }) {
  return (
    <span className="flex shrink-0 items-center justify-center rounded-[9px] bg-ink" style={{ width: size, height: size }}>
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    </span>
  );
}

export function CrmShell({ children }: { children: ReactNode }) {
  const pathname = usePathname() || "/admin";
  const [menuOpen, setMenuOpen] = useState(false);
  useEffect(() => setMenuOpen(false), [pathname]);

  return (
    <div className="flex min-h-screen flex-col lg:flex-row">
      {/* Sidebar on computers */}
      <nav aria-label="CRM" className="sticky top-0 hidden h-screen w-[232px] shrink-0 flex-col gap-1 overflow-y-auto border-e border-border bg-surface px-3.5 py-5 lg:flex">
        <Link href="/admin" className="flex items-center gap-2.5 px-2.5 pb-[18px] pt-1">
          <Mark />
          <span className="leading-tight">
            <span className="block font-bold tracking-[0.04em]">VOLT</span>
            <span className="block text-xs text-muted">Admin</span>
          </span>
        </Link>
        {NAV.map((n) => {
          const on = isActive(pathname, n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              aria-current={on ? "page" : undefined}
              className={clsx(
                "flex min-h-11 items-center gap-3 rounded-[10px] px-3 transition",
                on ? "bg-ink font-semibold text-white" : "font-medium text-ink-2 hover:bg-bg",
              )}
            >
              <n.icon aria-hidden className="size-[18px]" strokeWidth={1.8} />
              <span className="flex-1">{n.label}</span>
              {n.badge && <span className={clsx("font-mono text-xs", on ? "text-[#c9cfcb]" : "text-muted")}>{n.badge}</span>}
            </Link>
          );
        })}
        <Link href="/admin/messages/assistant" className="mt-auto flex flex-col gap-1 rounded-xl border border-border px-3 py-3.5 hover:border-bar-muted">
          <span className="flex items-center gap-2 text-sm font-semibold">
            <span aria-hidden className="size-2 rounded-full bg-online" />
            WhatsApp assistant
          </span>
          <span className="text-[13px] text-muted">Demo mode · try it</span>
        </Link>
        <Link href="/en" className="flex min-h-11 items-center gap-2 px-3 text-sm text-muted hover:text-ink">
          <ExternalLink aria-hidden className="size-4" /> View website
        </Link>
        <Link href="/guide" className="-mt-2 flex min-h-11 items-center gap-2 px-3 text-sm text-muted hover:text-ink">
          <ExternalLink aria-hidden className="size-4" /> Demo guide
        </Link>
        <div className="flex items-center gap-2.5 px-2.5 pt-2">
          <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-soft text-[13px] font-semibold">{brand.owner.initials}</span>
          <span className="leading-tight">
            <span className="block text-sm font-semibold">{brand.owner.name}</span>
            <span className="block text-xs text-muted">Owner</span>
          </span>
        </div>
      </nav>

      {/* Top bar on phones */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-surface px-4 py-2.5 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <Mark size={30} />
          <span className="font-bold tracking-[0.04em]">VOLT</span>
        </Link>
        <span className="inline-flex size-[34px] items-center justify-center rounded-full bg-soft text-[13px] font-semibold" title={brand.owner.name}>
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
          <span className="flex h-8 w-11 items-center justify-center rounded-[10px] bg-ink">
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
      className={clsx("flex min-h-[52px] flex-1 flex-col items-center justify-center gap-0.5 text-xs", on ? "font-semibold text-ink" : "font-medium text-muted")}
    >
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
