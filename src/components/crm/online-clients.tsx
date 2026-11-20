"use client";

import type { OnlineClient } from "@/lib/crm-sample-data";
import { timeAgo, useDemoData } from "@/lib/demo-store";
import { DemoButton } from "./shell";
import { Card, Chip, button } from "./ui";
import { useTick } from "./web-activity";

/** Online coaching clients, with new requests from the website's online form on top (live). */
export function OnlineClientsCard({ online }: { online: OnlineClient[] }) {
  const data = useDemoData();
  useTick();
  const requests = data.leads.filter((l) => l.kind === "online");
  const td = "border-b border-divider px-5 py-3";

  return (
    <Card
      title={<>Online coaching <span className="font-mono font-normal text-muted">{online.length + requests.length} clients</span></>}
      id="online"
      aside={<span className="text-[13px] text-muted">Programs sent on WhatsApp · check-in every Monday</span>}
    >
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] border-collapse text-sm">
          <thead>
            <tr className="text-muted">
              {["Client", "Where", "Program", "Progress", "Next check-in", ""].map((h) => (
                <th key={h} scope="col" className="border-b border-divider px-5 py-2.5 text-start font-medium">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {requests.map((r) => (
              <tr key={r.id} className="bg-accent/10">
                <td className={`${td} font-medium`}>
                  {r.name}
                  <span className="ms-2 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.08em] text-ink">Website · new</span>
                </td>
                <td className={`${td} text-ink-2`}>{r.details?.split(" · ")[0] ?? "Online"}</td>
                <td className={td}>{r.interest}</td>
                <td className={`${td} text-ink-2`}>Plan to write · {timeAgo(r.at)}</td>
                <td className={td}><Chip cls="bg-info-bg text-info">New request</Chip></td>
                <td className={`${td} text-end`}>
                  <DemoButton message={`${r.name}'s plan sent on WhatsApp with exercise videos. First check-in Monday.`} className={button.small}>Send plan</DemoButton>
                </td>
              </tr>
            ))}
            {online.map((o) => (
              <tr key={o.id}>
                <td className={`${td} font-medium`}>{o.name}</td>
                <td className={`${td} text-ink-2`}>{o.where}</td>
                <td className={td}>{o.program}</td>
                <td className={`${td} text-ink-2`}>{o.week}</td>
                <td className={td}>
                  <Chip cls={o.status === "check_in_due" ? "bg-warn-bg text-warn" : o.status === "quiet" ? "bg-bad-bg text-bad" : "bg-ok-bg text-ok"}>{o.nextCheckIn}</Chip>
                </td>
                <td className={`${td} text-end`}>
                  <DemoButton message={`Check-in sent to ${o.name} on WhatsApp with this week's plan`} className={button.small}>
                    {o.status === "quiet" ? "Nudge" : "Send check-in"}
                  </DemoButton>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
