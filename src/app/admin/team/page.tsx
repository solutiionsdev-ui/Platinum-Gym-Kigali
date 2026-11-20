import clsx from "clsx";
import type { Metadata } from "next";
import { DemoButton } from "@/components/crm/shell";
import { Bar, Card, Chip, Initials, PageHead, Summary, button } from "@/components/crm/ui";
import { getCoachStats, getDeskStats, getLeaveRequest, getOnShift, getPayroll, getStaff, rwf } from "@/lib/crm-data";
import { getCoach } from "@/lib/data";

export const metadata: Metadata = { title: "Team" };

export default function TeamPage() {
  const stats = getCoachStats();
  const desk = getDeskStats();
  const payroll = getPayroll();
  const leave = getLeaveRequest();
  const totalClasses = stats.reduce((s, c) => s + c.classes, 0);
  const avgFill = Math.round(stats.reduce((s, c) => s + c.fill * c.classes, 0) / totalClasses);
  const fullest = [...stats].sort((a, b) => b.fill - a.fill)[0];
  const emptiest = [...stats].sort((a, b) => a.fill - b.fill)[0];
  const ptLeader = [...stats].sort((a, b) => b.pt - a.pt)[0];
  const name = (slug: string) => getCoach(slug)?.name.en ?? slug;
  const first = (slug: string) => getCoach(slug)?.first.en ?? slug;

  return (
    <>
      <PageHead title="Team" sub="November 2026 · month to date">
        <DemoButton message="New staff form opens here (saving comes with the database, step 4)" className={button.secondary}>Add staff member</DemoButton>
      </PageHead>

      <Summary>
        <strong>{totalClasses} classes</strong> taught this month, <strong>{avgFill}% full</strong> on average. {first(fullest.slug)}&apos;s classes are the fullest ({fullest.fill}%).{" "}
        {first(ptLeader.slug)} leads personal training with <strong>{ptLeader.pt} sessions</strong> and {ptLeader.sold} packages sold. {first(emptiest.slug)}&apos;s classes are the emptiest ({emptiest.fill}%) and have the most no-shows.
      </Summary>

      <div className="flex flex-wrap items-start gap-5">
        <div className="flex min-w-0 flex-[3_1_560px] flex-col gap-5">
          <Card title="Coaches and trainers" id="coaches" aside={<span className="text-[13px] text-muted">Sorted by how full their classes are</span>}>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] border-collapse text-sm">
                <thead>
                  <tr className="text-muted">
                    <th scope="col" className="min-w-[230px] border-b border-divider px-5 py-2.5 text-start font-medium">Coach</th>
                    {["Classes", "How full", "No-shows", "Regulars kept", "PT sessions", "PT sold", "Rating"].map((h, i) => (
                      <th key={h} scope="col" className={clsx("border-b border-divider px-3 py-2.5 font-medium", i === 1 ? "text-start" : "text-end", i === 6 && "pe-5")}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...stats].sort((a, b) => b.fill - a.fill).map((c) => (
                    <tr key={c.slug}>
                      <th scope="row" className="border-b border-divider px-5 py-3 text-start font-normal">
                        <div className="flex items-center gap-2.5">
                          <Initials name={name(c.slug)} size={32} />
                          <span>
                            <span className="block whitespace-nowrap font-semibold">{name(c.slug)}</span>
                            <span className="block text-[13px] text-muted">{getCoach(c.slug)?.role.en}</span>
                          </span>
                        </div>
                      </th>
                      <td className="border-b border-divider px-3 py-3 text-end font-mono">{c.classes}</td>
                      <td className="border-b border-divider px-3 py-3">
                        <div className="flex items-center gap-2">
                          <Bar pct={c.fill} cls={c.fill < 65 ? "bg-warn" : "bg-ink"} className="w-[90px]" />
                          <span className={clsx("font-mono", c.fill < 65 && "text-warn")}>{c.fill}%</span>
                        </div>
                      </td>
                      <td className={clsx("border-b border-divider px-3 py-3 text-end font-mono", c.noshow >= 11 && "text-bad")}>{c.noshow}%</td>
                      <td className="border-b border-divider px-3 py-3 text-end font-mono">{c.kept}%</td>
                      <td className="border-b border-divider px-3 py-3 text-end font-mono">{c.pt}</td>
                      <td className="border-b border-divider px-3 py-3 text-end font-mono">{c.sold}</td>
                      <td className="border-b border-divider py-3 pe-5 ps-3 text-end font-mono">{c.rating.toFixed(1)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="px-5 pb-4 pt-3 text-[13px] leading-relaxed text-muted">
              <strong className="text-ink-2">How full</strong>: booked spots out of capacity. <strong className="text-ink-2">Regulars kept</strong>: members who came to this coach in October and came back in November.{" "}
              <strong className="text-ink-2">Rating</strong>: members rate a class from the WhatsApp message they get afterwards.
            </p>
          </Card>

          <Card title="Front desk" id="desk">
            <div className="flex flex-wrap">
              {desk.map((d) => (
                <div key={d.name} className="flex flex-[1_1_280px] flex-col gap-3 border-b border-divider px-5 py-[18px] last:border-0">
                  <div className="flex items-center gap-2.5"><Initials name={d.name} size={32} /><span className="font-semibold">{d.name}</span></div>
                  <div className="grid grid-cols-3 gap-3">
                    <div><div className="text-[13px] text-muted">Trials who joined</div><div className="font-mono text-lg">{d.converted} of {d.trials}</div><div className="text-[13px] text-muted">{Math.round((d.converted / d.trials) * 100)}%</div></div>
                    <div><div className="text-[13px] text-muted">Collected</div><div className="font-mono text-lg">{rwf(d.collected)}</div></div>
                    <div><div className="text-[13px] text-muted">Renewals</div><div className="font-mono text-lg">{d.renewals}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Staff" id="staff" aside={<span className="text-sm text-muted">{getStaff().length} people</span>}>
            {getStaff().map((s) => (
              <div key={s.slug} className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-divider px-5 py-3 last:border-0">
                <Initials name={s.name} size={32} />
                <div className="min-w-0 flex-[1_1_180px]">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-[13px] text-muted">{s.role}</div>
                </div>
                <span className="w-[200px] text-sm text-ink-2">{s.pay}</span>
                <span className="w-[140px] font-mono text-[13px] text-muted">{s.phone}</span>
                <span className="w-[80px] text-[13px] text-muted">Since {s.since}</span>
              </div>
            ))}
          </Card>
        </div>

        <div className="flex min-w-0 flex-[2_1_340px] flex-col gap-5">
          <Card title="On shift now" id="shift" aside={<span className="font-mono text-[13px] text-muted">16:40</span>}>
            {getOnShift().map((s) => (
              <div key={s.name} className="flex items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0">
                <span aria-hidden className={clsx("size-2 rounded-full", s.now ? "bg-online" : "bg-bar-muted")} />
                <span className="min-w-0 flex-1">{s.name} <span className="text-muted">· {s.role}</span></span>
                <span className="font-mono text-[13px] text-ink-2">{s.hours}</span>
              </div>
            ))}
          </Card>

          <Card className="flex flex-col gap-2.5 px-5 py-4">
            <div className="flex items-center justify-between gap-2.5">
              <h2 className="text-base font-semibold">Leave request</h2>
              <Chip cls="bg-warn-bg text-warn">Waiting</Chip>
            </div>
            <div><strong>{leave.name}</strong>, {leave.dates} ({leave.reason})</div>
            <div className="text-sm text-ink-2">{leave.classes} classes need a cover coach. Suggested: {leave.cover}.</div>
            <div className="mt-1 flex gap-2">
              <DemoButton message="Leave approved. Diane and Grace got a WhatsApp asking them to cover, and booked members will be told." className={clsx(button.primary, "flex-1")}>Approve with cover</DemoButton>
              <DemoButton message={`${leave.first} was told on WhatsApp that the leave was declined`} className={button.secondary}>Decline</DemoButton>
            </div>
          </Card>

          <Card title="November payroll" id="payroll" aside={<span className="text-[13px] text-muted">Ready on 30 Nov</span>}>
            <div className="flex flex-col gap-2 px-5 pb-4 pt-2 text-sm">
              <div className="flex justify-between"><span>Base salaries ({getStaff().length} staff)</span><span className="font-mono">{rwf(payroll.base)}</span></div>
              <div className="flex justify-between"><span>Class pay ({payroll.classes} classes)</span><span className="font-mono">{rwf(payroll.classPay)}</span></div>
              <div className="flex justify-between"><span>PT commission ({payroll.ptSessions} sessions)</span><span className="font-mono">{rwf(payroll.ptCommission)}</span></div>
              <div className="flex justify-between border-t border-divider pt-2.5 font-semibold"><span>Estimated total</span><span className="font-mono">{rwf(payroll.base + payroll.classPay + payroll.ptCommission)}</span></div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}
