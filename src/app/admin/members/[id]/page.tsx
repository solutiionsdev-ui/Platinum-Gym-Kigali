import clsx from "clsx";
import { Check, Clock, MoreHorizontal } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { DemoButton } from "@/components/crm/shell";
import { Bar, Card, Chip, Initials, StatusChip, button } from "@/components/crm/ui";
import { daysLeft, fmtDate, getMember, getMemberDetail, lastVisitLabel, PLAN_LABELS, PLAN_PRICES, usd } from "@/lib/crm-data";
import { daysBetween } from "@/lib/crm-sample-data";
import { getCoach } from "@/lib/data";

type Params = Promise<{ id: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const m = getMember((await params).id);
  return { title: m?.name ?? "Member" };
}

export default async function MemberPage({ params }: { params: Params }) {
  const m = getMember((await params).id);
  if (!m) notFound();
  const d = getMemberDetail(m);
  const left = daysLeft(m);
  const total = Math.max(daysBetween(m.start, m.end), 1);
  const used = Math.round(((total - Math.max(left, 0)) / total) * 100);
  const trainer = m.trainer ? getCoach(m.trainer) : undefined;
  const avg = (d.weeks.reduce((s, v) => s + v, 0) / d.weeks.length).toFixed(1);
  const maxWeek = Math.max(...d.weeks, 4);
  const first = m.name.split(" ")[0];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted">
        <Link href="/admin/members" className="text-link hover:underline">Members</Link> / {m.name}
      </nav>

      <div className="flex flex-wrap items-center gap-[18px] rounded-[14px] border border-border bg-surface p-5">
        <Initials name={m.name} size={60} />
        <div className="min-w-0 flex-[1_1_320px]">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl font-semibold">{m.name}</h1>
            <StatusChip status={m.status} />
            {m.ptLeft !== null && <span className="inline-flex h-6 items-center rounded-full border border-border px-2.5 text-[13px] text-ink-2">PT client</span>}
          </div>
          <div className="mt-0.5 text-muted">
            <span className="font-mono">{m.phone}</span> · Member since {fmtDate(m.since)} · Messages in {m.lang}
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/schedule" className={button.primary}>Book a class</Link>
          <DemoButton message={`Payment form for ${first} opens here (saving comes with the database, step 4)`} className={button.secondary}>Record payment</DemoButton>
          <Link href="/admin/messages" className={button.secondary}>Message</Link>
          <DemoButton message="More actions: freeze, transfer, cancel membership" className={clsx(button.secondary, "w-11 px-0")}>
            <MoreHorizontal aria-hidden className="size-[18px]" />
            <span className="sr-only">More actions</span>
          </DemoButton>
        </div>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[2_1_560px] flex-col gap-5">
          <Card
            title="Membership"
            id="membership"
            aside={
              <div className="flex gap-2">
                <DemoButton message={`Freeze for ${first}: pick the days, and the end date moves automatically`} className={button.small}>Freeze</DemoButton>
                <DemoButton message={`Renewal offer sent to ${first} on WhatsApp`} className={button.small}>{left < 0 ? "Renew" : "Renew early"}</DemoButton>
              </div>
            }
          >
            <div className="flex flex-col gap-3.5 px-5 py-[18px]">
              <div className="flex flex-wrap justify-between gap-4">
                <div>
                  <div className="text-lg font-semibold">{PLAN_LABELS[m.planId]}</div>
                  <div className="font-mono text-muted">{fmtDate(m.start)} → {fmtDate(m.end)}</div>
                </div>
                <div className="text-end">
                  <div className={clsx("font-mono text-[22px]", left < 0 ? "text-bad" : left <= 7 ? "text-warn" : "")}>{Math.abs(left)} days</div>
                  <div className="text-sm text-muted">{left < 0 ? "since it ended" : "left"}</div>
                </div>
              </div>
              <Bar pct={used} className="h-2" />
              <div className="flex flex-wrap gap-x-7 gap-y-1 text-sm text-ink-2">
                <span>Price <strong className="text-ink">{usd(PLAN_PRICES[m.planId])}</strong></span>
                {m.owes > 0 ? (
                  <span className="text-bad">Owes <strong>{usd(m.owes)}</strong> for {m.owesFor}</span>
                ) : (
                  <span>Nothing owed</span>
                )}
                {m.status === "frozen" && <span className="text-info">Frozen since {fmtDate(m.lastVisit, false)}</span>}
              </div>
            </div>
          </Card>

          <Card title="Visits and bookings" id="visits" aside={<span className="text-sm text-muted">Last visit: {lastVisitLabel(m.lastVisit).toLowerCase()}</span>}>
            <div className="flex flex-wrap items-end gap-7 px-5 py-[18px]">
              <div className="min-w-0 flex-[1_1_300px]">
                <div className="mb-2.5 text-sm text-muted">Visits per week, last 12 weeks · <strong className="text-ink">{avg} on average</strong></div>
                <div role="img" aria-label={`Weekly visits for the last 12 weeks, ${avg} on average`} className="flex h-24 items-end gap-1.5 border-b border-border">
                  {d.weeks.map((v, i) => (
                    <div key={i} className={clsx("flex-1 rounded-t-[3px]", i === d.weeks.length - 1 ? "bg-faint" : "bg-ink")} style={{ height: `${(v / maxWeek) * 92}px` }} />
                  ))}
                </div>
                <div className="mt-1.5 flex justify-between text-xs text-muted"><span>12 weeks ago</span><span>This week</span></div>
              </div>
              <div className="flex flex-[1_1_200px] flex-col gap-2 text-sm">
                <div className="text-muted">Favourite classes</div>
                {d.favourites.map(([name, n]) => (
                  <div key={name} className="flex justify-between"><span>{name}</span><span className="font-mono">{n}</span></div>
                ))}
                <div className="flex justify-between text-muted"><span>No-shows (3 months)</span><span className="font-mono">{d.noShows}</span></div>
              </div>
            </div>
            <div className="border-t border-divider">
              <div className="px-5 pb-1 pt-3 text-[13px] font-semibold text-muted">Upcoming</div>
              {d.upcoming.length === 0 && <p className="border-t border-divider px-5 py-3 text-sm text-muted">Nothing booked.</p>}
              {d.upcoming.map((u) => (
                <div key={u.when} className="flex flex-wrap items-center gap-3.5 border-t border-divider px-5 py-2.5">
                  <span className="w-[140px] font-mono">{u.when}</span>
                  <span className="min-w-40 flex-1">{u.what}</span>
                  <Chip cls={u.tone === "waitlist" ? "bg-warn-bg text-warn" : "bg-soft text-later"}>{u.status}</Chip>
                </div>
              ))}
            </div>
          </Card>

          {d.scans.length > 0 && (
            <Card title="Body measurements" id="scans" aside={<DemoButton message="New scan form opens here" className={button.small}>Add scan</DemoButton>}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-sm">
                  <thead>
                    <tr className="text-start text-muted">
                      {["Date", "Weight", "Body fat", "Muscle mass", "By"].map((h) => (
                        <th key={h} scope="col" className="border-b border-divider px-5 py-2.5 text-start font-medium">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {d.scans.map((s) => (
                      <tr key={s.date} className="font-mono">
                        <td className="border-b border-divider px-5 py-2.5">{s.date}</td>
                        <td className="border-b border-divider px-5 py-2.5">{s.weight}</td>
                        <td className="border-b border-divider px-5 py-2.5">{s.fat}</td>
                        <td className="border-b border-divider px-5 py-2.5">{s.muscle}</td>
                        <td className="border-b border-divider px-5 py-2.5 font-sans text-muted">{s.by}</td>
                      </tr>
                    ))}
                    <tr className="font-semibold">
                      <td className="px-5 py-3">Since March</td>
                      {d.scanChange.map((c, i) => <td key={i} className="px-5 py-3 font-mono text-ok">{c}</td>)}
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          <Card title="Payments" id="payments">
            {d.payments.length === 0 && <p className="px-5 py-4 text-sm text-muted">No payments yet.</p>}
            {d.payments.map((p) => (
              <div key={p.date + p.item} className="flex flex-wrap items-center gap-3.5 border-b border-divider px-5 py-3 last:border-0">
                <span className="w-[100px] font-mono text-muted">{p.date}</span>
                <span className="min-w-44 flex-1">{p.item}</span>
                <span className="w-[200px] text-sm text-muted">{p.method}</span>
                <span className="w-16 text-end font-mono font-medium">{usd(p.amount)}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          {m.ptLeft !== null && trainer && (
            <Card className="flex flex-col gap-3 px-5 py-[18px]">
              <div className="flex items-center justify-between gap-2.5">
                <h2 className="text-base font-semibold">PT package</h2>
                {m.ptLeft <= 3 && <Chip cls="bg-warn-bg text-warn">Running low</Chip>}
              </div>
              <div>10 sessions with <strong>{trainer.name.en}</strong></div>
              <div role="img" aria-label={`${10 - m.ptLeft} of 10 sessions used, ${m.ptLeft} left`} className="flex gap-1">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className={clsx("h-2.5 flex-1 rounded-[3px]", i < 10 - m.ptLeft! ? "bg-ink" : "bg-border")} />
                ))}
              </div>
              <div className="text-sm"><strong className="font-mono">{m.ptLeft}</strong> sessions left</div>
              <div className="border-t border-divider pt-2.5 text-[13px] text-muted">At 2 sessions left, a WhatsApp message offers the next package automatically.</div>
            </Card>
          )}

          <Card title="Contact and health" id="contact">
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2.5 px-5 pb-3.5 pt-2 text-sm">
              <div><dt className="text-muted">Birthday</dt><dd>{d.birthday}</dd></div>
              <div><dt className="text-muted">Came from</dt><dd>{m.source}</dd></div>
              <div><dt className="text-muted">Emergency contact</dt><dd>{d.emergency}</dd></div>
              <div><dt className="text-muted">Waiver</dt><dd>{d.waiver}</dd></div>
            </dl>
            {d.health && <div className="mx-5 mb-[18px] rounded-[10px] bg-warn-bg px-3.5 py-3 text-sm text-[#5a3200]"><strong>Health note:</strong> {d.health}</div>}
          </Card>

          <Card title="WhatsApp" id="wa" aside={<Link href="/admin/messages" className="text-sm font-semibold text-link hover:underline">Messages →</Link>}>
            {d.whatsapp.map((w) => (
              <div key={w.text + w.when} className="flex items-start gap-3 border-b border-divider px-5 py-2.5 last:border-0">
                {w.scheduled ? (
                  <Clock aria-hidden className="mt-0.5 size-4 shrink-0 text-muted" strokeWidth={2} />
                ) : (
                  <Check aria-hidden className="mt-0.5 size-4 shrink-0 text-ok" strokeWidth={2.2} />
                )}
                <div className="min-w-0">
                  <div className="text-sm">{w.text}</div>
                  <div className="text-xs text-muted">{w.when}</div>
                </div>
              </div>
            ))}
          </Card>

          {d.note && (
            <Card className="flex flex-col gap-2 px-5 py-4">
              <h2 className="text-base font-semibold">Notes</h2>
              <p className="text-sm">{d.note.text}</p>
              <div className="text-xs text-muted">{d.note.by}</div>
            </Card>
          )}
        </div>
      </div>
    </>
  );
}
