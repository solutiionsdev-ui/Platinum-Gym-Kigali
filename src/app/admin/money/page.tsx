import type { Metadata } from "next";
import Link from "next/link";
import { DemoButton } from "@/components/crm/shell";
import { RateForm } from "@/components/crm/rate-form";
import { Bar, Card, Chip, PageHead, Summary, button } from "@/components/crm/ui";
import { findMemberByName, getMoney, getOverdue, usd } from "@/lib/crm-data";

export const metadata: Metadata = { title: "Money" };

export default function MoneyPage() {
  const money = getMoney();
  const overdue = getOverdue();
  const overdueSum = overdue.reduce((s, m) => s + m.owes, 0);
  const dueSum = money.dueSoon.reduce((s, d) => s + d.amount, 0);
  const owedCount = overdue.length + money.dueSoon.length;
  const scale = 150 / 20;
  const sourceTotal = money.sources.reduce((s, x) => s + x.amount, 0);
  const maxExpense = Math.max(...money.expenses.map((e) => e.amount));

  const owed = [
    ...overdue.map((m) => ({ id: m.id, name: m.name, item: `${m.owesFor} · ${m.daysLate} days late`, amount: m.owes, overdue: true })),
    ...money.dueSoon.map((d) => ({ id: findMemberByName(d.name)?.id, name: d.name, item: d.item, amount: d.amount, overdue: false })),
  ];

  return (
    <>
      <PageHead title="Money" sub="November 2026 · month to date">
        <DemoButton message="Expense form opens here (saving comes with the database, step 4)" className={button.secondary}>Add expense</DemoButton>
        <DemoButton message="Payment form opens here: member, amount, USD or LBP, method" className={button.primary}>Record payment</DemoButton>
      </PageHead>

      <Summary>
        November so far: <strong>{usd(money.in)} in</strong>, <strong>{usd(money.out)} out</strong>, <strong className="text-ok">{usd(money.in - money.out)} profit</strong>.{" "}
        <strong>{usd(overdueSum + dueSum)}</strong> still to collect from {owedCount} members, {usd(overdueSum)} of it overdue.
      </Summary>

      <div className="flex flex-wrap items-stretch gap-5">
        <Card
          title="In and out, last 6 months"
          id="six"
          className="flex-[3_1_480px]"
          aside={
            <div className="flex gap-4 text-[13px] text-ink-2">
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-[2px] bg-ink" />Money in</span>
              <span className="inline-flex items-center gap-1.5"><span aria-hidden className="size-2.5 rounded-[2px] bg-bar-muted" />Money out</span>
            </div>
          }
        >
          <div role="img" aria-label="Money in rose from about 13 to 19 thousand dollars a month since August while money out stayed near 11 to 12 thousand" className="px-5 pb-4 pt-5">
            <div className="flex h-[200px] items-end gap-[18px] border-b border-border">
              {money.months.map((m) => (
                <div key={m.label} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="font-mono text-xs text-ink-2">+${(m.in - m.out).toFixed(1)}k</div>
                  <div className="flex w-full items-end justify-center gap-1">
                    <div className="w-2/5 max-w-[30px] rounded-t-[3px] bg-ink" style={{ height: `${Math.round(m.in * scale)}px` }} />
                    <div className="w-2/5 max-w-[30px] rounded-t-[3px] bg-bar-muted" style={{ height: `${Math.round(m.out * scale)}px` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-2 flex gap-[18px]">
              {money.months.map((m, i) => (
                <div key={m.label} className={`flex-1 text-center text-[13px] ${i === money.months.length - 1 ? "font-semibold text-ink" : "text-muted"}`}>{m.label}</div>
              ))}
            </div>
            <div className="mt-2.5 text-[13px] text-muted">Number above each month = profit. November is month to date.</div>
          </div>
        </Card>

        <Card title="Where November's money came from" id="sources" className="flex-[2_1_340px]">
          <div className="flex flex-col gap-4 px-5 py-4">
            {money.sources.map((s) => {
              const pct = Math.round((s.amount / sourceTotal) * 100);
              return (
                <div key={s.label}>
                  <div className="flex justify-between gap-3 text-sm">
                    <span>{s.label}</span>
                    <span className="font-mono">{usd(s.amount)} <span className="text-muted">· {pct}%</span></span>
                  </div>
                  <Bar pct={pct} className="mt-1.5 h-2" />
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <Card
          title={<>Who owes money <span className="font-mono font-normal text-muted">{usd(overdueSum + dueSum)}</span></>}
          id="owed"
          className="flex-[3_1_480px]"
          aside={<DemoButton message={`WhatsApp payment reminders sent to ${overdue.length} members`} className="inline-flex h-10 items-center rounded-[10px] bg-ink px-3.5 text-sm font-semibold text-white hover:bg-black">Remind the {overdue.length} overdue</DemoButton>}
        >
          {owed.map((o) => (
            <div key={o.name} className="flex flex-wrap items-center gap-3.5 border-b border-divider px-5 py-2.5 last:border-0">
              <div className="min-w-0 flex-[1_1_200px]">
                {o.id ? <Link href={`/admin/members/${o.id}`} className="font-medium hover:underline">{o.name}</Link> : <span className="font-medium">{o.name}</span>}
                <div className="text-[13px] text-muted">{o.item}</div>
              </div>
              <Chip cls={o.overdue ? "bg-bad-bg text-bad" : "bg-warn-bg text-warn"}>{o.overdue ? "Overdue" : "Due soon"}</Chip>
              <span className="w-14 text-end font-mono font-medium">{usd(o.amount)}</span>
              <DemoButton message={`Payment reminder sent to ${o.name} on WhatsApp`} className={button.small}>Remind</DemoButton>
            </div>
          ))}
        </Card>

        <div className="flex min-w-0 flex-[2_1_340px] flex-col gap-5">
          <RateForm yesterday={money.yesterdayRate} />
          <Card title="Expenses in November" id="exp" aside={<span className="font-mono font-medium">{usd(money.out)}</span>}>
            {money.expenses.map((e) => (
              <div key={e.label} className="flex items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0">
                <span className="flex-1 text-sm">{e.label}</span>
                <Bar pct={(e.amount / maxExpense) * 100} cls="bg-faint" className="w-[90px]" />
                <span className="w-[60px] text-end font-mono text-sm">{usd(e.amount)}</span>
              </div>
            ))}
          </Card>
        </div>
      </div>

      <Card title="Latest payments" id="latest" aside={<span className="text-sm text-muted">{usd(money.collectedToday)} today</span>}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] border-collapse text-sm">
            <thead>
              <tr className="text-muted">
                {["When", "Member", "For", "Method", "Received by"].map((h) => (
                  <th key={h} scope="col" className="border-b border-divider px-5 py-2.5 text-start font-medium">{h}</th>
                ))}
                <th scope="col" className="border-b border-divider px-5 py-2.5 text-end font-medium">Amount</th>
              </tr>
            </thead>
            <tbody>
              {money.latest.map((p) => {
                const id = findMemberByName(p.member)?.id;
                return (
                  <tr key={p.when + p.member}>
                    <td className="border-b border-divider px-5 py-2.5 font-mono text-muted">{p.when}</td>
                    <td className="border-b border-divider px-5 py-2.5 font-medium">{id ? <Link href={`/admin/members/${id}`} className="hover:underline">{p.member}</Link> : p.member}</td>
                    <td className="border-b border-divider px-5 py-2.5">{p.item}</td>
                    <td className="border-b border-divider px-5 py-2.5 text-ink-2">{p.method}</td>
                    <td className="border-b border-divider px-5 py-2.5 text-muted">{p.by}</td>
                    <td className="border-b border-divider px-5 py-2.5 text-end font-mono font-medium">{usd(p.amount)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  );
}
