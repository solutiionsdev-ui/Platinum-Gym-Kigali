import type { Metadata } from "next";
import { DemoButton } from "@/components/crm/shell";
import { MembersTabs } from "@/components/crm/members-tabs";
import { PageHead, Summary, button } from "@/components/crm/ui";
import { getLeads } from "@/lib/crm-data";
import type { LeadStage } from "@/lib/crm-sample-data";

export const metadata: Metadata = { title: "Leads and trials" };

const STAGES: { key: LeadStage; label: string; action?: string; toast?: string }[] = [
  { key: "new", label: "New", action: "Message", toast: "WhatsApp hello sent with a link to book a free trial" },
  { key: "contacted", label: "Contacted", action: "Book trial", toast: "Trial booking opens here" },
  { key: "trial_booked", label: "Trial booked" },
  { key: "trial_done", label: "Trial done", action: "Send offer", toast: "First-month offer sent on WhatsApp ($45 instead of $55)" },
  { key: "joined", label: "Joined this week" },
  { key: "lost", label: "Lost" },
];

export default function LeadsPage() {
  const leads = getLeads();
  const count = (k: LeadStage) => leads.filter((l) => l.stage === k).length;

  return (
    <>
      <PageHead title="Members" sub="Leads and free trials">
        <DemoButton message="New lead form opens here (saving comes with the database, step 4)" className={button.primary}>Add a lead</DemoButton>
      </PageHead>
      <MembersTabs active="/admin/members/leads" />
      <Summary>
        This week: <strong>11 trials</strong>, <strong>6 joined</strong>. <strong>{count("new")} new requests</strong> are waiting for a first message and{" "}
        <strong>{count("trial_done")} people</strong> tried a class but haven&apos;t had an offer yet.
      </Summary>

      <div className="-mx-4 flex gap-3 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
        {STAGES.map((s) => (
          <section key={s.key} aria-labelledby={`stage-${s.key}`} className="flex w-[260px] shrink-0 flex-col gap-2.5 rounded-[14px] bg-soft/60 p-2.5">
            <h2 id={`stage-${s.key}`} className="flex items-center justify-between px-1.5 pt-1 text-sm font-semibold">
              {s.label} <span className="font-mono font-normal text-muted">{count(s.key)}</span>
            </h2>
            {leads
              .filter((l) => l.stage === s.key)
              .map((l) => (
                <div key={l.id} className="flex flex-col gap-1.5 rounded-xl border border-border bg-surface p-3.5">
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
