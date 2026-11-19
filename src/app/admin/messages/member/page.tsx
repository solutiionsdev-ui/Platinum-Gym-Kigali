import type { Metadata } from "next";
import { MemberPhone } from "@/components/crm/member-phone";
import { MessagesTabs } from "@/components/crm/messages-tabs";
import { PageHead } from "@/components/crm/ui";

export const metadata: Metadata = { title: "What members see" };

export default function MemberViewPage() {
  return (
    <>
      <PageHead title="Messages" sub="The automatic WhatsApp messages, as a member receives them" />
      <MessagesTabs active="/admin/messages/member" />
      <MemberPhone />
    </>
  );
}
