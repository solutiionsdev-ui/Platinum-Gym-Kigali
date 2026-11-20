import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import type { CSSProperties, ReactNode } from "react";
import { brand } from "@/lib/brand";
import "../admin/admin.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = { title: `Demo guide · ${brand.name}`, robots: { index: false, follow: false } };

/** The demo guide for Mario: one page linking every screen. Same look as the CRM. */
export default function GuideLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${anton.variable} ${geist.variable} ${geistMono.variable}`} style={{ "--accent": brand.accent } as CSSProperties}>
      <body className="min-h-screen font-sans text-[15px] leading-normal antialiased">{children}</body>
    </html>
  );
}
