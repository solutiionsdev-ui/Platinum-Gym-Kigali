import type { Metadata } from "next";
import Link from "next/link";
import { MembersList, type MemberRow } from "@/components/crm/members-list";
import { MembersTabs } from "@/components/crm/members-tabs";
import { PageHead, button } from "@/components/crm/ui";
import { activeCount, daysLeft, DEMO_DATE, fmtDate, getMembers, lastVisitLabel, PLAN_LABELS } from "@/lib/crm-data";
import { daysBetween } from "@/lib/crm-sample-data";
import { getCoach } from "@/lib/data";

export const metadata: Metadata = { title: "Members" };

export default async function MembersPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams;
  const rows: MemberRow[] = getMembers().map((m) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    plan: PLAN_LABELS[m.planId],
    status: m.status,
    ends: fmtDate(m.end),
    daysLeft: daysLeft(m),
    lastVisit: lastVisitLabel(m.lastVisit),
    lastVisitDays: daysBetween(m.lastVisit, DEMO_DATE),
    visits4w: m.visits4w,
    owes: m.owes,
    pt: m.ptLeft !== null && m.trainer ? `PT ${m.ptLeft} left (${getCoach(m.trainer)?.first.en})` : null,
  }));

  return (
    <>
      <PageHead title="Members" sub={`${activeCount()} active · ${rows.length} on file`}>
        <Link href="/admin/members/check-in" className={button.secondary}>Check in</Link>
        <Link href="/admin/members/leads" className={button.primary}>Add a lead or member</Link>
      </PageHead>
      <MembersTabs active="/admin/members" />
      <MembersList rows={rows} initialQuery={q ?? ""} />
    </>
  );
}
