import type { Metadata } from "next";
import Link from "next/link";
import { Container, PhotoPlaceholder, btn } from "@/components/ui";
import { getDict, href, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).about.metaTitle };
}

export default async function AboutPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);

  return (
    <Container className="pb-24 pt-14">
      <div className="flex flex-wrap gap-12">
        <div className="flex min-w-0 flex-[1_1_480px] flex-col gap-5">
          <h1 className="font-display display-page uppercase">{t.about.title}</h1>
          {t.about.paragraphs.map((p) => (
            <p key={p} className="max-w-[600px] text-lg leading-relaxed text-ink-2">{p}</p>
          ))}
          <div className="mt-2 flex flex-wrap gap-3">
            <Link href={href(lang, "/trial")} className={btn.accent}>{t.common.bookFreeTrial}</Link>
            <Link href={href(lang, "/classes")} className={btn.outline}>{t.common.seeTimetable}</Link>
          </div>
        </div>
        <PhotoPlaceholder label={`${t.common.photo}: ${t.facilities.title}`} className="min-h-[380px] flex-[1_1_420px] rounded-3xl" />
      </div>
      <ul className="mt-16 flex flex-wrap gap-4">
        {t.about.values.map((v) => (
          <li key={v.title} className="flex flex-[1_1_280px] flex-col gap-2.5 border-t-2 border-accent pt-5">
            <h2 className="text-[22px] font-semibold">{v.title}</h2>
            <p className="text-muted">{v.text}</p>
          </li>
        ))}
      </ul>
    </Container>
  );
}
