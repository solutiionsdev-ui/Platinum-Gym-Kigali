import type { Metadata } from "next";
import { AssistantChat } from "@/components/crm/assistant-chat";
import { MessagesTabs } from "@/components/crm/messages-tabs";
import { PageHead } from "@/components/crm/ui";

export const metadata: Metadata = { title: "Owner's assistant" };

export default function AssistantPage() {
  return (
    <>
      <PageHead title="Messages" sub="Your WhatsApp assistant: ask questions or give orders, by text or voice note" />
      <MessagesTabs active="/admin/messages/assistant" />
      <AssistantChat />
    </>
  );
}
