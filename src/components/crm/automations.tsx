"use client";

import clsx from "clsx";
import { useState } from "react";
import { fillTemplate } from "@/lib/crm-data";
import type { Automation } from "@/lib/crm-sample-data";
import { useToast } from "./toast";

/** List of automatic WhatsApp messages with on/off switches and a preview. */
export function Automations({ items }: { items: Automation[] }) {
  const toast = useToast();
  const [on, setOn] = useState<Record<string, boolean>>(Object.fromEntries(items.map((a) => [a.key, a.on])));
  const [selected, setSelected] = useState(items[1]?.key ?? items[0].key);
  const current = items.find((a) => a.key === selected)!;

  return (
    <div className="flex flex-wrap items-start gap-5">
      <section aria-labelledby="auto-h" className="min-w-0 flex-[3_1_480px] rounded-[14px] border border-border bg-surface">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-4">
          <h2 id="auto-h" className="text-base font-semibold">Automatic messages</h2>
          <span className="text-[13px] text-muted">Nothing goes out between 22:00 and 07:00</span>
        </div>
        {items.map((a) => (
          <div key={a.key} className={clsx("flex items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0", a.key === selected && "bg-bg")}>
            <button type="button" onClick={() => setSelected(a.key)} className="min-h-11 min-w-0 flex-1 text-start">
              <span className="block font-medium">{a.name}</span>
              <span className="block text-[13px] text-muted">{a.when} · {a.sentWeek} sent this week</span>
            </button>
            <button
              type="button"
              role="switch"
              aria-checked={on[a.key]}
              aria-label={`${a.name} ${on[a.key] ? "on" : "off"}`}
              onClick={() => {
                setOn((o) => ({ ...o, [a.key]: !o[a.key] }));
                toast(`${a.name} turned ${on[a.key] ? "off" : "on"}`);
              }}
              className={clsx("relative h-7 w-12 shrink-0 rounded-full transition", on[a.key] ? "bg-ink" : "bg-bar-muted")}
            >
              <span className={clsx("absolute top-1 size-5 rounded-full bg-white transition-all", on[a.key] ? "start-6" : "start-1")} />
            </button>
          </div>
        ))}
      </section>

      <section aria-labelledby="prev-h" className="sticky top-20 flex min-w-0 flex-[2_1_340px] flex-col gap-3 rounded-[14px] border border-border bg-surface p-5">
        <h2 id="prev-h" className="text-base font-semibold">Preview: {current.name}</h2>
        <div className="text-[13px] text-muted">{current.when}.</div>
        <div className="rounded-xl bg-[#ecede9] p-4">
          <div className="max-w-[92%] whitespace-pre-line rounded-[4px_16px_16px_16px] bg-white px-3.5 py-2.5 text-[15px] leading-relaxed">
            {fillTemplate(current.text)}
          </div>
        </div>
        <p className="text-[13px] text-muted">
          Words in the message come from the booking or payment it&apos;s about. Every automatic message has to be approved by Meta as a WhatsApp template before it goes live (step 5).
        </p>
        {!on[current.key] && <p className="text-sm font-medium text-warn">This message is off. Members won&apos;t get it.</p>}
      </section>
    </div>
  );
}
