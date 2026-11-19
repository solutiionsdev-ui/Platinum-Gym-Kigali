import clsx from "clsx";
import { ArrowLeftRight, CalendarOff, CheckSquare, Clock, DollarSign, ListOrdered, Plus, Search, TrendingDown, UserPlus } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { DemoButton } from "@/components/crm/shell";
import { Bar, Card, Chip, Fact, Summary, button } from "@/components/crm/ui";
import {
  activeCount, fmtDate, getExpiringSoon, getFullWithWaitlist, getLeads, getMoney, getOverdue, getPtToday, getQuietClasses, getTodayClasses,
  PLAN_LABELS, spotsLeft, statusCounts, usd,
} from "@/lib/crm-data";
import { getClassType, getCoach, getSessionsForDay, demoToday } from "@/lib/data";

export const metadata: Metadata = { title: "Today" };

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const STATE = {
  done: { label: "Done", cls: "bg-neutral-bg text-neutral" },
  now: { label: "Now", cls: "bg-ok-bg text-ok" },
  full: { label: "Full", cls: "bg-warn-bg text-warn" },
  later: { label: "Later", cls: "bg-soft text-later" },
};

export default function TodayPage() {
  const money = getMoney();
  const overdue = getOverdue();
  const overdueSum = overdue.reduce((s, m) => s + m.owes, 0);
  // The ending membership most worth a call: owes money first, then the most regular visitor.
  const renewal = [...getExpiringSoon()].sort((a, b) => b.owes - a.owes || b.visits4w - a.visits4w)[0];
  const newLeads = getLeads().filter((l) => l.stage === "new");
  const full = getFullWithWaitlist()[0];
  const fullType = full && getClassType(full.type);
  const alternative = full && getSessionsForDay(demoToday).find((s) => s.type === full.type && s.time > full.time && spotsLeft(s) > 0);
  const quiet = getQuietClasses()[0];
  const quietType = quiet && getClassType(quiet.type);
  const classes = getTodayClasses();
  const done = classes.filter((c) => c.state === "done").length;
  const pt = getPtToday();

  type Need = { tone: string; icon: typeof Clock; title: string; sub: string; action: string; toast?: string; href?: string };
  const needs: Need[] = [
    {
      tone: "bg-bad-bg text-bad", icon: DollarSign, title: `${overdue.length} payments overdue · ${usd(overdueSum)}`,
      sub: overdue.map((m) => `${m.name} ${m.daysLate} days`).join(" · "), action: "Send reminders",
      toast: `WhatsApp payment reminders sent to ${overdue.length} members`,
    },
    renewal && {
      tone: "bg-warn-bg text-warn", icon: Clock, title: `${renewal.name}'s membership ends ${fmtDate(renewal.end, false)}`,
      sub: `${PLAN_LABELS[renewal.planId]}, no renewal yet. ${renewal.visits4w} visits in the last 4 weeks.`, action: "Send renewal offer",
      toast: `Renewal offer sent to ${renewal.name} on WhatsApp`,
    },
    {
      tone: "bg-trial-bg text-trial", icon: UserPlus, title: `${newLeads.length} trial requests not contacted`,
      sub: `From the website, ${newLeads.map((l) => l.when).join(" and ")}`, action: "Open leads", href: "/admin/members/leads",
    },
    full && fullType && {
      tone: "bg-warn-bg text-warn", icon: ListOrdered, title: `${full.time} ${fullType.name.en} is full, ${full.waiting} on the waitlist`,
      sub: alternative ? `${alternative.time} ${fullType.name.en} with ${getCoach(alternative.coach)?.first.en} still has ${spotsLeft(alternative)} spots` : "No later class today",
      action: alternative ? `Offer ${alternative.time}` : "Open roster",
      toast: alternative ? `WhatsApp offer for ${alternative.time} ${fullType.name.en} sent to the ${full.waiting} people waiting` : undefined,
      href: alternative ? undefined : "/admin/schedule",
    },
    quiet && quietType && {
      tone: "bg-info-bg text-info", icon: TrendingDown,
      title: `${DAYS[quiet.day]} ${quiet.time} ${quietType.name.en} is ${Math.round((quiet.booked / quiet.cap) * 100)}% full`,
      sub: `${quiet.booked} of ${quiet.cap} booked so far`, action: "Promote it",
      toast: `WhatsApp invite sent to 38 members who often book ${quietType.name.en}`,
    },
    { tone: "bg-neutral-bg text-neutral", icon: CalendarOff, title: "Maya asked for leave, 1 – 3 December", sub: "4 of her classes need a cover coach", action: "Review", href: "/admin/team" },
    { tone: "bg-neutral-bg text-neutral", icon: ArrowLeftRight, title: "No exchange rate set for today", sub: "Needed before taking LBP payments", action: "Set rate", href: "/admin/money#rate" },
  ].filter(Boolean) as Need[];

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.01em]">Good afternoon, Nadim</h1>
          <div className="text-muted">Tuesday 24 November · <span className="font-mono">16:40</span></div>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <form action="/admin/members" className="relative w-full sm:w-auto">
            <Search aria-hidden className="pointer-events-none absolute start-3 top-3.5 size-4 text-muted" />
            <input type="search" name="q" aria-label="Search members by name or phone" placeholder="Search name or phone"
              className="h-11 w-full rounded-[10px] border border-border bg-surface pe-3 ps-9 text-ink placeholder:text-muted sm:w-[240px]" />
          </form>
          <Link href="/admin/members/check-in" className={button.secondary}>
            <CheckSquare aria-hidden className="size-[18px]" strokeWidth={1.8} /> Check in
          </Link>
          <details className="relative">
            <summary className={clsx(button.primary, "cursor-pointer")}>
              <Plus aria-hidden className="size-[18px]" /> New
            </summary>
            <div className="absolute end-0 z-20 mt-2 flex w-56 flex-col rounded-xl border border-border bg-surface p-1.5 shadow-lg">
              <Link href="/admin/schedule" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-bg">Book a class</Link>
              <Link href="/admin/members/leads" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-bg">Add a lead or member</Link>
              <Link href="/admin/money" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-bg">Record a payment</Link>
              <Link href="/admin/money" className="flex min-h-11 items-center rounded-lg px-3 hover:bg-bg">Add an expense</Link>
            </div>
          </details>
        </div>
      </div>

      <Summary>
        So far today: <strong>142 check-ins</strong> and <strong>{usd(money.collectedToday)} collected</strong>. <strong>{classes.length} classes</strong> ({done} done)
        and <strong>{pt.length} PT sessions</strong>. <strong>{needs.length} things need you</strong>, the most urgent first.
      </Summary>

      <div className="flex flex-wrap gap-3">
        <Fact label="Active members" value={String(activeCount())} note="+12 this month" />
        <Fact label="Memberships ending in 7 days" value={String(statusCounts().expiring)} note="5 already renewed" />
        <Fact label="Trials this week" value="11" note="6 joined so far" />
        <Fact label="Collected in November" value={usd(money.in)} note={`${usd(overdueSum + money.dueSoon.reduce((s, d) => s + d.amount, 0))} still to collect`} />
      </div>

      <div className="flex flex-wrap items-start gap-5">
        <Card title={<>Needs you <span className="font-mono font-normal text-muted">{needs.length}</span></>} aside={<span className="text-[13px] text-muted">Most urgent first</span>} className="flex-[3_1_520px]" id="needs">
          {needs.map((n) => (
            <div key={n.title} className="flex flex-wrap items-center gap-3.5 border-b border-divider px-5 py-3.5 last:border-0">
              <span className={clsx("flex size-[34px] shrink-0 items-center justify-center rounded-[10px]", n.tone)}>
                <n.icon aria-hidden className="size-[18px]" strokeWidth={1.9} />
              </span>
              <div className="min-w-0 flex-[1_1_240px]">
                <div className="font-semibold">{n.title}</div>
                <div className="text-sm text-muted">{n.sub}</div>
              </div>
              {n.href ? (
                <Link href={n.href} className={button.small}>{n.action}</Link>
              ) : (
                <DemoButton message={n.toast ?? "Done"} className={button.small}>{n.action}</DemoButton>
              )}
            </div>
          ))}
        </Card>

        <div className="flex min-w-0 flex-[2_1_360px] flex-col gap-5">
          <Card title="Classes today" aside={<Link href="/admin/schedule" className="text-sm font-semibold text-link hover:underline">Schedule →</Link>} id="classes">
            {classes.map((c) => (
              <div key={c.id} className="flex items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0">
                <span className={clsx("w-[46px] font-mono", c.state === "done" ? "text-muted" : "")}>{c.time}</span>
                <div className="min-w-0 flex-1">
                  <div className={clsx("font-medium", c.state === "done" && "text-muted")}>
                    {c.name} <span className="font-normal text-muted">· {c.coachName}</span>
                  </div>
                  <Bar pct={(c.booked / c.cap) * 100} cls={c.booked >= c.cap ? "bg-warn" : "bg-ink"} className="mt-1 h-1" />
                </div>
                <span className="w-11 text-end font-mono text-[13px] text-ink-2">{c.booked}/{c.cap}</span>
                <Chip cls={STATE[c.state].cls}>{STATE[c.state].label}</Chip>
              </div>
            ))}
          </Card>

          <Card title="Personal training today" id="pt">
            {pt.map((p) => (
              <Link key={p.time} href={`/admin/members/${p.memberId}`} className="flex min-h-11 items-center gap-3 border-b border-divider px-5 py-2.5 last:border-0 hover:bg-bg">
                <span className={clsx("w-[46px] font-mono", p.done && "text-muted")}>{p.time}</span>
                <span className={clsx("min-w-0 flex-1", p.done && "text-muted")}>
                  {p.member} <span className="text-muted">with {getCoach(p.trainer)?.first.en}</span>
                </span>
                <span className="text-[13px] text-muted">{p.note}</span>
              </Link>
            ))}
          </Card>
        </div>
      </div>
    </>
  );
}
