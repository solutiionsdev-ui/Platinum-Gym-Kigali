"use client";

import type { Lead, LeadStage } from "@/lib/crm-sample-data";
import { timeAgo, useDemoData, WEB_LEAD_SOURCE } from "@/lib/demo-store";
import { DemoButton } from "./shell";
import { Summary } from "./ui";
import { sessionLabel, useTick } from "./web-activity";

const STAGES: { key: LeadStage; label: string; action?: string; toast?: string }[] = [
  { key: "new", label: "New", action: "Message", toast: "WhatsApp hello sent with a link to book a free trial" },
  { key: "contacted", label: "Contacted", action: "Book trial", toast: "Trial booking opens here" },
  { key: "trial_booked", label: "Trial booked" },
  { key: "trial_done", label: "Trial done", action: "Send offer", toast: "First-month offer sent on WhatsApp" },
  { key: "joined", label: "Joined this week" },
  { key: "lost", label: "Lost" },
];

type Card = Lead & { web?: boolean };

/** The leads pipeline. Sample leads plus anything sent on the website in this browser, live. */
export function LeadsBoard({ leads }: { leads: Lead[] }) {
  const data = useDemoData();
  useTick();
  const fromWeb: Card[] = [
    ...data.leads.map((l) => ({
      id: l.id, name: l.name, stage: "new" as const, source: WEB_LEAD_SOURCE[l.kind], interest: l.interest || "Not sure yet",
      when: timeAgo(l.at), note: [l.phone, l.details].filter(Boolean).join(" · "), web: true,
    })),
    ...data.bookings
      .filter((b) => b.trial)
      .map((b) => ({
        id: b.id, name: b.name, stage: "trial_booked" as const, source: "Website booking", interest: sessionLabel(b.sessionId),
        when: timeAgo(b.at), note: `${b.phone} · first visit${b.waitlist ? " · on the waitlist" : ""}`, web: true,
      })),
  ];
  const all: Card[] = [...fromWeb, ...leads];
  const count = (k: LeadStage) => all.filter((l) => l.stage === k).length;

  return (
    <>
      <Summary>
        This week: <strong>{11 + fromWeb.filter((l) => l.stage === "trial_booked").length} trials</strong>, <strong>6 joined</strong>.{" "}
        <strong>{count("new")} new requests</strong> are waiting for a first message and <strong>{count("trial_done")} people</strong> tried a class but haven&apos;t had an
        offer yet.{fromWeb.length > 0 && <> <strong>{fromWeb.length} came from the website</strong> just now.</>}
      </Summary>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {STAGES.map((s) => (
          <section key={s.key} aria-labelledby={`stage-${s.key}`} className="flex w-[260px] shrink-0 flex-col gap-2.5 rounded-[14px] bg-soft/60 p-2.5">
            <h2 id={`stage-${s.key}`} className="flex items-center justify-between px-1.5 pt-1 text-sm font-semibold">
              {s.label} <span className="font-mono font-normal text-muted">{count(s.key)}</span>
            </h2>
            {all
              .filter((l) => l.stage === s.key)
              .map((l) => (
                <div key={l.id} className={`flex flex-col gap-1.5 rounded-xl border bg-surface p-3.5 ${l.web ? "border-accent" : "border-border"}`}>
                  {l.web && <span className="self-start rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Website · new</span>}
                  <div className="font-semibold">{l.name}</div>
                  <div className="text-sm text-ink-2">{l.interest} · {l.source}</div>
                  <div className="text-[13px] text-muted">{l.note}</div>
                  <div className="flex items-center justify-between gap-2 pt-1 text-xs text-muted">
                    <span>{l.when}{l.by ? ` · ${l.by}` : ""}</span>
                    {s.action && (
                      <DemoButton message={`${l.name}: ${s.toast}`} className="inline-flex h-9 items-center rounded-lg border border-border px-2.5 text-[13px] font-semibold text-ink hover:border-bar-muted">
                        {s.action}
                      </DemoButton>
                    )}
                  </div>
                </div>
              ))}
          </section>
        ))}
      </div>
    </>
  );
}
