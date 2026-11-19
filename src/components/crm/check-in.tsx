"use client";

import clsx from "clsx";
import { AlertTriangle, Check, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { STATUS, type MemberStatus } from "@/lib/crm-data";
import { Chip, Initials } from "./ui";
import { useToast } from "./toast";

export type CheckRow = { id: string; name: string; phone: string; status: MemberStatus; plan: string; warning: string | null };

/** Front desk check-in, made for a phone or tablet at the desk. */
export function CheckIn({ rows, startCount }: { rows: CheckRow[]; startCount: number }) {
  const toast = useToast();
  const [q, setQ] = useState("");
  const [done, setDone] = useState<Record<string, string>>({});
  const count = startCount + Object.keys(done).length;

  const results = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (needle.length < 2) return [];
    const digits = needle.replace(/\D/g, "");
    return rows.filter((r) => r.name.toLowerCase().includes(needle) || (digits.length >= 3 && r.phone.replace(/\D/g, "").includes(digits))).slice(0, 8);
  }, [q, rows]);

  function checkIn(r: CheckRow) {
    const time = `16:${String(41 + Object.keys(done).length).padStart(2, "0")}`;
    setDone((d) => ({ ...d, [r.id]: time }));
    toast(`${r.name} checked in at ${time}`);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-surface px-5 py-4">
        <span className="text-[17px]">Checked in today: <strong className="font-mono">{count}</strong></span>
        <span className="text-sm text-muted">Busiest hour so far: 18:00 – 19:00 yesterday (61)</span>
      </div>
      <div className="relative">
        <Search aria-hidden className="pointer-events-none absolute start-4 top-[18px] size-5 text-muted" />
        <input
          type="search"
          autoFocus
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Find a member by name or phone"
          placeholder="Type a name or the last digits of a phone"
          className="h-14 w-full rounded-[14px] border border-border bg-surface pe-4 ps-12 text-[17px] placeholder:text-muted"
        />
      </div>
      {q.trim().length >= 2 && results.length === 0 && <p className="text-muted">No member found. Check the spelling, or add them as a lead.</p>}
      <ul className="flex flex-col gap-2.5">
        {results.map((r) => {
          const blocked = r.status === "expired" || r.status === "frozen";
          return (
            <li key={r.id} className="flex flex-wrap items-center gap-3.5 rounded-[14px] border border-border bg-surface p-4">
              <Initials name={r.name} size={44} />
              <div className="min-w-0 flex-[1_1_200px]">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[17px] font-semibold">{r.name}</span>
                  <Chip cls={STATUS[r.status].cls}>{STATUS[r.status].label}</Chip>
                </div>
                <div className="text-sm text-muted"><span className="font-mono">{r.phone}</span> · {r.plan}</div>
                {r.warning && (
                  <div className="mt-1 flex items-center gap-1.5 text-sm font-medium text-bad">
                    <AlertTriangle aria-hidden className="size-4" /> {r.warning}
                  </div>
                )}
              </div>
              {done[r.id] ? (
                <span className="inline-flex h-12 items-center gap-2 rounded-xl bg-ok-bg px-4 font-semibold text-ok">
                  <Check aria-hidden className="size-5" /> In at {done[r.id]}
                </span>
              ) : (
                <button
                  type="button"
                  onClick={() => checkIn(r)}
                  className={clsx("h-12 rounded-xl px-5 font-semibold", blocked ? "border border-border bg-surface text-ink" : "bg-ink text-white")}
                >
                  {blocked ? "Check in anyway" : "Check in"}
                </button>
              )}
            </li>
          );
        })}
      </ul>
      {q.trim().length < 2 && <p className="text-sm text-muted">Try “Rana”, “Hadi” or “Nadia”.</p>}
    </div>
  );
}
