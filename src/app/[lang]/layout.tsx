import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono, IBM_Plex_Sans_Arabic } from "next/font/google";
import { notFound } from "next/navigation";
import type { CSSProperties, ReactNode } from "react";
import { MobileCta, SiteFooter } from "@/components/site/footer";
import { SiteHeader } from "@/components/site/header";
import { brand } from "@/lib/brand";
import { dirOf, getDict, isLang, languages } from "@/lib/i18n";
import "../globals.css";

const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"] });
const geist = Geist({ variable: "--font-geist", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const plexArabic = IBM_Plex_Sans_Arabic({ variable: "--font-plex-arabic", weight: ["400", "500", "600", "700"], subsets: ["arabic"] });

export const dynamicParams = false;

export function generateStaticParams() {
  return languages.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { lang } = await params;
  const t = getDict(isLang(lang) ? lang : "en");
  return {
    title: { default: `${brand.name} · ${t.home.title1} ${t.home.title2} ${t.home.titleAccent}`, template: `%s · ${brand.name}` },
    description: t.home.intro,
  };
}

export default async function SiteLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${anton.variable} ${geist.variable} ${geistMono.variable} ${plexArabic.variable}`}
      style={{ "--accent": brand.accent } as CSSProperties}
    >
      <body className="min-h-screen font-sans text-base leading-normal antialiased">
        <SiteHeader lang={lang} />
        <main id="main" className="pb-24 md:pb-0">
          {children}
        </main>
        <SiteFooter lang={lang} />
        <MobileCta lang={lang} />
      </body>
    </html>
  );
}
