"use client";

import clsx from "clsx";
import { Search } from "lucide-react";
import Link from "next/link";
import { useMemo, useState } from "react";
import { STATUS, type MemberStatus } from "@/lib/crm-data";
import { Chip } from "./ui";

export type MemberRow = {
  id: string;
  name: string;
  phone: string;
  plan: string;
  status: MemberStatus;
  ends: string;
  daysLeft: number;
  lastVisit: string;
  lastVisitDays: number;
  visits4w: number;
  owes: number;
  pt: string | null;
};

type Filter = "all" | MemberStatus | "owes" | "away";
const PAGE = 50;

export function MembersList({ rows, initialQuery = "" }: { rows: MemberRow[]; initialQuery?: string }) {
  const [q, setQ] = useState(initialQuery);
  const [filter, setFilter] = useState<Filter>("all");
  const [shown, setShown] = useState(PAGE);

  const counts = useMemo(() => {
    const c: Record<Filter, number> = { all: rows.length, active: 0, expiring: 0, frozen: 0, expired: 0, trial: 0, owes: 0, away: 0 };
    for (const r of rows) {
      c[r.status]++;
      if (r.owes > 0) c.owes++;
      if ((r.status === "active" || r.status === "expiring") && r.lastVisitDays >= 14) c.away++;
    }
    return c;
  }, [rows]);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    const digits = needle.replace(/\D/g, "");
    return rows.filter((r) => {
      if (filter === "owes" && r.owes <= 0) return false;
      if (filter === "away" && !((r.status === "active" || r.status === "expiring") && r.lastVisitDays >= 14)) return false;
      if (filter !== "all" && filter !== "owes" && filter !== "away" && r.status !== filter) return false;
      if (!needle) return true;
      return r.name.toLowerCase().includes(needle) || (digits.length >= 3 && r.phone.replace(/\D/g, "").includes(digits));
    });
  }, [rows, q, filter]);

  const filters: { key: Filter; label: string }[] = [
    { key: "all", label: "All" },
    { key: "active", label: STATUS.active.label },
    { key: "expiring", label: STATUS.expiring.label },
    { key: "owes", label: "Owes money" },
    { key: "away", label: "Not seen in 2 weeks" },
    { key: "frozen", label: STATUS.frozen.label },
    { key: "expired", label: STATUS.expired.label },
    { key: "trial", label: STATUS.trial.label },
  ];

  return (
    <>
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-[1_1_280px]">
          <Search aria-hidden className="pointer-events-none absolute start-3 top-3.5 size-4 text-muted" />
          <input
            type="search"
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setShown(PAGE);
            }}
            aria-label="Search members by name or phone"
            placeholder="Search name or phone"
            className="h-11 w-full rounded-[10px] border border-border bg-surface pe-3 ps-9 placeholder:text-muted"
          />
        </div>
      </div>
      <div role="group" aria-label="Filter members" className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            type="button"
            aria-pressed={filter === f.key}
            onClick={() => {
              setFilter(f.key);
              setShown(PAGE);
            }}
            className={clsx(
              "inline-flex h-10 items-center gap-2 rounded-full border px-3.5 text-sm font-medium transition",
              filter === f.key ? "border-ink bg-ink text-white" : "border-border bg-surface text-ink-2 hover:border-bar-muted",
            )}
          >
            {f.label}
            <span className={clsx("font-mono text-xs", filter === f.key ? "text-[#c9cfcb]" : "text-muted")}>{counts[f.key]}</span>
          </button>
        ))}
      </div>

      <div className="rounded-[14px] border border-border bg-surface">
        <div className="hidden grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_120px_minmax(0,1fr)_minmax(0,1fr)_70px_70px] gap-4 border-b border-divider px-5 py-2.5 text-sm text-muted lg:grid">
          <span>Member</span>
          <span>Plan</span>
          <span>Status</span>
          <span>Ends</span>
          <span>Last visit</span>
          <span className="text-end">4 weeks</span>
          <span className="text-end">Owes</span>
        </div>
        {filtered.length === 0 && <p className="px-5 py-10 text-center text-muted">No members match. Try another name or filter.</p>}
        {filtered.slice(0, shown).map((r) => (
          <Link
            key={r.id}
            href={`/admin/members/${r.id}`}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-b border-divider px-5 py-3 last:border-0 hover:bg-bg lg:grid-cols-[minmax(0,2.2fr)_minmax(0,1.3fr)_120px_minmax(0,1fr)_minmax(0,1fr)_70px_70px]"
          >
            <span className="min-w-0">
              <span className="block truncate font-medium">{r.name}</span>
              <span className="block font-mono text-[13px] text-muted">{r.phone}</span>
            </span>
            <span className="text-sm text-ink-2 max-lg:order-3 max-lg:col-span-2">
              {r.plan}
              {r.pt && <span className="text-muted"> · {r.pt}</span>}
              <span className="text-muted lg:hidden"> · ends {r.ends} · {r.lastVisit.toLowerCase()}</span>
            </span>
            <span className="max-lg:order-2 max-lg:justify-self-end">
              <Chip cls={STATUS[r.status].cls}>{STATUS[r.status].label}</Chip>
            </span>
            <span className={clsx("hidden text-sm lg:block", r.daysLeft <= 7 ? "text-warn" : "text-ink-2")}>
              {r.ends}
              <span className="block text-[13px] text-muted">{r.daysLeft >= 0 ? `${r.daysLeft} days left` : `${-r.daysLeft} days ago`}</span>
            </span>
            <span className={clsx("hidden text-sm lg:block", r.lastVisitDays >= 14 ? "text-bad" : "text-ink-2")}>{r.lastVisit}</span>
            <span className="hidden text-end font-mono text-sm lg:block">{r.visits4w}</span>
            <span className={clsx("hidden text-end font-mono text-sm lg:block", r.owes > 0 ? "font-semibold text-bad" : "text-muted")}>{r.owes > 0 ? `$${r.owes}` : "–"}</span>
          </Link>
        ))}
      </div>
      {filtered.length > shown && (
        <button
          type="button"
          onClick={() => setShown((s) => s + PAGE)}
          className="inline-flex h-11 items-center justify-center self-center rounded-[10px] border border-border bg-surface px-5 font-semibold hover:border-bar-muted"
        >
          Show {Math.min(PAGE, filtered.length - shown)} more of {filtered.length - shown}
        </button>
      )}
    </>
  );
}
