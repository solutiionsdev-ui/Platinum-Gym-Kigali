import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { CrmShell } from "@/components/crm/shell";
import { ToastProvider } from "@/components/crm/toast";
import { brand } from "@/lib/brand";
import "./admin.css";

const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata: Metadata = {
  title: { default: `Admin · ${brand.name}`, template: `%s · ${brand.short} Admin` },
  robots: { index: false, follow: false },
};

/** The CRM (owner and staff side). English only. Its own root layout, separate from the website. */
export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`} style={{ "--accent": brand.accent } as CSSProperties}>
      <body className="min-h-screen font-sans text-[15px] leading-normal antialiased">
        <ToastProvider>
          <CrmShell>{children}</CrmShell>
        </ToastProvider>
      </body>
    </html>
  );
}
