import clsx from "clsx";
import { Bot } from "lucide-react";
import type { Metadata } from "next";
import { Automations } from "@/components/crm/automations";
import { Card, Chip, PageHead } from "@/components/crm/ui";
import { getAutomations, getRecentMessages } from "@/lib/crm-data";

export const metadata: Metadata = { title: "Messages" };

export default function MessagesPage() {
  const automations = getAutomations();
  const sent = automations.reduce((s, a) => s + a.sentWeek, 0);

  return (
    <>
      <PageHead title="Messages" sub={`WhatsApp · ${sent} automatic messages sent this week`} />

      <div className="flex flex-wrap items-center gap-4 rounded-[14px] border border-border bg-surface p-5">
        <span className="flex size-11 items-center justify-center rounded-xl bg-ink">
          <Bot aria-hidden className="size-6 text-accent" strokeWidth={1.8} />
        </span>
        <div className="min-w-0 flex-[1_1_300px]">
          <div className="font-semibold">Owner&apos;s WhatsApp assistant</div>
          <div className="text-sm text-muted">
            Ask &ldquo;who hasn&apos;t paid?&rdquo; or send a voice note like &ldquo;book Rana into tonight&apos;s spin&rdquo;. The clickable demo comes in step 3; the real one in step 5.
          </div>
        </div>
        <Chip cls="bg-soft text-later">Step 3</Chip>
      </div>

      <Automations items={automations} />

      <Card title="Latest messages" id="latest">
        {getRecentMessages().map((m) => (
          <div key={m.when + m.to} className="flex flex-wrap items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0">
            <span className="w-12 font-mono text-muted">{m.when}</span>
            <span className="min-w-0 flex-[1_1_200px]">
              <span className="font-medium">{m.to}</span> <span className="text-muted">· {m.what}</span>
            </span>
            <Chip cls={clsx(m.status === "Read" ? "bg-ok-bg text-ok" : m.status === "Scheduled" ? "bg-soft text-later" : "bg-info-bg text-info")}>{m.status}</Chip>
          </div>
        ))}
      </Card>
    </>
  );
}
