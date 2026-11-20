import clsx from "clsx";
import type { ReactNode } from "react";
import { STATUS, type MemberStatus } from "@/lib/crm-data";

export const button = {
  primary: "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] bg-accent px-4 font-semibold text-ink transition hover:brightness-95",
  secondary:
    "inline-flex h-11 items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-4 font-semibold text-ink transition hover:border-bar-muted",
  small:
    "inline-flex h-10 items-center justify-center gap-2 rounded-[10px] border border-border bg-surface px-3.5 text-sm font-semibold text-ink transition hover:border-bar-muted",
};

export function PageHead({ title, sub, children }: { title: string; sub?: ReactNode; children?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      <div>
        <h1 className="text-[26px] font-semibold tracking-[-0.01em]">{title}</h1>
        {sub && <div className="text-muted">{sub}</div>}
      </div>
      {children && <div className="flex flex-wrap items-center gap-2.5">{children}</div>}
    </div>
  );
}

export function Card({ title, aside, children, className, id }: { title?: ReactNode; aside?: ReactNode; children: ReactNode; className?: string; id?: string }) {
  return (
    <section aria-labelledby={id} className={clsx("min-w-0 rounded-[14px] border border-border bg-surface", className)}>
      {title && (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-4">
          <h2 id={id} className="text-base font-semibold">{title}</h2>
          {aside}
        </div>
      )}
      {children}
    </section>
  );
}

/** The one-sentence summary at the top of a page. */
export function Summary({ children }: { children: ReactNode }) {
  return <div className="rounded-[14px] border border-border bg-surface px-5 py-[18px] text-[17px] leading-relaxed">{children}</div>;
}

export function Chip({ children, cls }: { children: ReactNode; cls: string }) {
  return (
    <span className={clsx("inline-flex h-6 shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 text-xs font-medium", cls)}>
      <span aria-hidden className="size-1.5 rounded-full bg-current" />
      {children}
    </span>
  );
}

export function StatusChip({ status }: { status: MemberStatus }) {
  return <Chip cls={STATUS[status].cls}>{STATUS[status].label}</Chip>;
}

export function Bar({ pct, cls = "bg-ink", className }: { pct: number; cls?: string; className?: string }) {
  return (
    <div className={clsx("h-1.5 overflow-hidden rounded-[3px] bg-divider", className)}>
      <div className={clsx("h-full", cls)} style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function Initials({ name, size = 34 }: { name: string; size?: number }) {
  const ini = name.split(" ").map((p) => p[0]).slice(0, 2).join("");
  return (
    <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-soft text-[13px] font-semibold" style={{ width: size, height: size }}>
      {ini}
    </span>
  );
}

export function Fact({ label, value, note }: { label: string; value: string; note?: string }) {
  return (
    <div className="min-w-0 flex-[1_1_200px] rounded-[14px] border border-border bg-surface px-[18px] py-3.5">
      <div className="text-[13px] text-muted">{label}</div>
      <div className="mt-0.5 font-mono text-2xl font-medium">{value}</div>
      {note && <div className="text-[13px] text-muted">{note}</div>}
    </div>
  );
}
