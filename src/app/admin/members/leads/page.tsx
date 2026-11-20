import type { Metadata } from "next";
import { LeadsBoard } from "@/components/crm/leads-board";
import { DemoButton } from "@/components/crm/shell";
import { MembersTabs } from "@/components/crm/members-tabs";
import { PageHead, button } from "@/components/crm/ui";
import { getLeads } from "@/lib/crm-data";

export const metadata: Metadata = { title: "Leads and trials" };

export default function LeadsPage() {
  return (
    <>
      <PageHead title="Members" sub="Leads and free trials · website requests appear here live">
        <DemoButton message="New lead form opens here (saving comes with the database, step 4)" className={button.primary}>Add a lead</DemoButton>
      </PageHead>
      <MembersTabs active="/admin/members/leads" />
      <LeadsBoard leads={getLeads()} />
    </>
  );
}
