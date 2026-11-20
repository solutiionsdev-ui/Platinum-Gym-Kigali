import type { Metadata } from "next";
import { Container, Photo, PhotoPlaceholder } from "@/components/ui";
import { getFacilities } from "@/lib/data";
import { getDict, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).facilities.metaTitle };
}

export default async function FacilitiesPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);

  return (
    <Container className="pb-24 pt-14">
      <h1 className="font-display display-page uppercase">{t.facilities.title}</h1>
      <p className="mt-3.5 max-w-[640px] text-lg text-ink-2">{t.facilities.intro}</p>
      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {getFacilities().map((f) => (
          <div key={f.title.en} className="flex min-w-0 flex-col overflow-hidden rounded-[20px] border border-line bg-surface">
            {f.image ? (
              <Photo k={f.image} alt={f.photo[lang]} className="h-[200px] w-full" />
            ) : (
              <PhotoPlaceholder label={`${t.common.photo}: ${f.photo[lang]} (to shoot)`} className="h-[200px] rounded-none border-0 border-b" />
            )}
            <div className="flex flex-col gap-2 p-6">
              <h2 className="text-[21px] font-semibold">{f.title[lang]}</h2>
              <p className="text-muted">{f.text[lang]}</p>
            </div>
          </div>
        ))}
      </div>
    </Container>
  );
}
