import type { Metadata } from "next";
import { Timetable, WeekNav } from "@/components/site/timetable";
import { Container } from "@/components/ui";
import { getDict, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).timetable.metaTitle };
}

export default async function ClassesPage({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ type?: string; session?: string }>;
}) {
  const lang = await langFrom(params);
  const { type, session } = await searchParams;
  const t = getDict(lang);

  return (
    <Container className="pb-20 pt-12">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="font-display display-page uppercase">{t.timetable.title}</h1>
          <p className="mt-2.5 text-[17px] text-muted">{t.timetable.week}</p>
        </div>
        <WeekNav lang={lang} />
      </div>
      {/* key: open the right class again when the address changes */}
      <Timetable key={`${type}-${session}`} lang={lang} initialType={type} initialSession={session} />
    </Container>
  );
}
