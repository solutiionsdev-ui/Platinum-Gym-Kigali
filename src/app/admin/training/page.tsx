import clsx from "clsx";
import type { Metadata } from "next";
import Link from "next/link";
import { OnlineClientsCard } from "@/components/crm/online-clients";
import { DemoButton } from "@/components/crm/shell";
import { Card, Chip, Initials, PageHead, Summary, button } from "@/components/crm/ui";
import { getCoachStats, getMembers, getOnlineClients, getPtClients, getPtToday, rwf } from "@/lib/crm-data";
import { getCoach, getPtPackages, getTrainers } from "@/lib/data";

export const metadata: Metadata = { title: "Training" };

export default function TrainingPage() {
  const stats = getCoachStats();
  const trainers = getTrainers();
  const low = getMembers()
    .filter((m) => m.ptLeft !== null && m.ptLeft <= 3 && (m.status === "active" || m.status === "expiring"))
    .sort((a, b) => (a.ptLeft ?? 0) - (b.ptLeft ?? 0));
  const ptSessions = stats.reduce((s, c) => s + c.pt, 0);
  const sold = stats.reduce((s, c) => s + c.sold, 0);
  const today = getPtToday();
  const online = getOnlineClients();

  return (
    <>
      <PageHead title="Training" sub="Personal training · November month to date">
        <DemoButton message="PT booking form: member, trainer, time. The member gets a WhatsApp confirmation." className={button.primary}>Book a PT session</DemoButton>
      </PageHead>

      <Summary>
        <strong>{ptSessions} PT sessions</strong> delivered this month and <strong>{sold} packages</strong> sold. <strong>{low.length} clients</strong> have 3 sessions or fewer left:
        a renewal message goes out automatically at 2.
      </Summary>

      <div className="grid gap-4 md:grid-cols-3">
        {trainers.map((t) => {
          const s = stats.find((x) => x.slug === t.slug);
          const clients = getPtClients(t.slug);
          return (
            <Card key={t.slug} className="flex flex-col gap-3 p-5">
              <div className="flex items-center gap-3">
                <Initials name={t.name.en} size={40} />
                <div>
                  <div className="font-semibold">{t.name.en}</div>
                  <div className="text-[13px] text-muted">{t.role.en}</div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-2 border-t border-divider pt-3">
                <div><div className="text-[13px] text-muted">Sessions</div><div className="font-mono text-xl">{s?.pt ?? 0}</div></div>
                <div><div className="text-[13px] text-muted">Clients</div><div className="font-mono text-xl">{clients.length}</div></div>
                <div><div className="text-[13px] text-muted">Sold</div><div className="font-mono text-xl">{s?.sold ?? 0}</div></div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <Card title="PT sessions today" id="today" className="flex-[3_1_480px]">
          {today.map((p) => (
            <Link key={p.time} href={`/admin/members/${p.memberId}`} className="flex min-h-12 items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0 hover:bg-bg">
              <span className={clsx("w-[46px] font-mono", p.done && "text-muted")}>{p.time}</span>
              <span className={clsx("min-w-0 flex-1", p.done && "text-muted")}>
                {p.member} <span className="text-muted">with {getCoach(p.trainer)?.first.en}</span>
              </span>
              <Chip cls={p.done ? "bg-neutral-bg text-neutral" : "bg-soft text-later"}>{p.done ? "Done" : "Upcoming"}</Chip>
            </Link>
          ))}
        </Card>

        <Card title="Packages running low" id="low" className="flex-[2_1_340px]">
          {low.slice(0, 8).map((m) => (
            <div key={m.id} className="flex flex-wrap items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/members/${m.id}`} className="font-medium hover:underline">{m.name}</Link>
                <div className="text-[13px] text-muted">with {getCoach(m.trainer ?? "")?.first.en}</div>
              </div>
              <span className={clsx("font-mono text-sm", (m.ptLeft ?? 0) <= 2 ? "text-warn" : "text-ink-2")}>{m.ptLeft} left</span>
              <DemoButton message={`Renewal offer for 10 sessions sent to ${m.name} on WhatsApp`} className={button.small}>Offer renewal</DemoButton>
            </div>
          ))}
        </Card>
      </div>

      <OnlineClientsCard online={online} />

      <Card title="Packages and prices" id="packages" aside={<Link href="/admin/settings" className="text-sm font-semibold text-link hover:underline">Edit in Settings →</Link>}>
        {getPtPackages().map((p) => (
          <div key={p.name.en} className="flex items-center justify-between gap-3 border-b border-divider px-5 py-3 last:border-0">
            <span>{p.name.en} <span className="text-sm text-muted">· {p.note.en}</span></span>
            <span className="font-mono font-medium">{rwf(p.price)}</span>
          </div>
        ))}
      </Card>
    </>
  );
}
