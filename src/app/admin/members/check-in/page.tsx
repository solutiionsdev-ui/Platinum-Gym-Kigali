import type { Metadata } from "next";
import { CheckIn, type CheckRow } from "@/components/crm/check-in";
import { MembersTabs } from "@/components/crm/members-tabs";
import { PageHead } from "@/components/crm/ui";
import { fmtDate, getMembers, PLAN_LABELS, rwf } from "@/lib/crm-data";

export const metadata: Metadata = { title: "Check-in" };

export default function CheckInPage() {
  const rows: CheckRow[] = getMembers().map((m) => ({
    id: m.id,
    name: m.name,
    phone: m.phone,
    status: m.status,
    plan: `${PLAN_LABELS[m.planId]} · ends ${fmtDate(m.end, false)}`,
    warning:
      m.owes > 0
        ? `Owes ${rwf(m.owes)} (${m.owesFor})`
        : m.status === "expired"
          ? `Membership ended ${fmtDate(m.end)}`
          : m.status === "frozen"
            ? "Membership is frozen"
            : m.status === "expiring"
              ? `Ends ${fmtDate(m.end, false)}: offer a renewal`
              : null,
  }));
  return (
    <>
      <PageHead title="Members" sub="Check-in at the front desk" />
      <MembersTabs active="/admin/members/check-in" />
      <CheckIn rows={rows} startCount={142} />
    </>
  );
}
