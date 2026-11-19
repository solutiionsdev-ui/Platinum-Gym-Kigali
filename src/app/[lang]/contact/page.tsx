import { MapPin, MessageCircle, Phone } from "lucide-react";
import type { Metadata } from "next";
import { whatsappHref } from "@/components/site/footer";
import { Container, Eyebrow, PhotoPlaceholder, btn } from "@/components/ui";
import { brand } from "@/lib/brand";
import { getDict, langFrom } from "@/lib/i18n";

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  return { title: getDict(await langFrom(params)).contact.metaTitle };
}

export default async function ContactPage({ params }: { params: Promise<{ lang: string }> }) {
  const lang = await langFrom(params);
  const t = getDict(lang);

  return (
    <Container className="pb-24 pt-14">
      <h1 className="font-display display-page uppercase">{t.contact.title}</h1>
      <div className="mt-10 flex flex-wrap gap-4">
        <PhotoPlaceholder label={t.common.map} className="min-h-[320px] flex-[1_1_520px] sm:min-h-[460px]" />
        <div className="flex min-w-0 flex-[1_1_380px] flex-col gap-6 rounded-[20px] border border-line bg-surface p-8">
          <div>
            <Eyebrow>{t.home.address}</Eyebrow>
            <p className="mt-1.5 flex items-start gap-2 text-[17px]">
              <MapPin aria-hidden className="mt-1 size-[18px] shrink-0 text-accent" strokeWidth={1.8} />
              {brand.address[lang]}
            </p>
          </div>
          <div>
            <Eyebrow>{t.home.hours}</Eyebrow>
            <dl className="mt-1.5 grid grid-cols-2 gap-x-4 gap-y-1">
              {brand.hours.map((h) => (
                <div key={h.time + h.days.en} className="contents">
                  <dt>{h.days[lang]}</dt>
                  <dd className="font-mono" dir="ltr">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <Eyebrow>{t.contact.phone}</Eyebrow>
            <a href={`tel:${brand.phone.replace(/\s/g, "")}`} dir="ltr" className="mt-1.5 inline-flex min-h-11 items-center gap-2 font-mono text-[17px]">
              <Phone aria-hidden className="size-[18px] text-accent" strokeWidth={1.8} />
              {brand.phone}
            </a>
          </div>
          <div>
            <Eyebrow>{t.contact.parking}</Eyebrow>
            <p className="mt-1.5">{t.contact.parkingText}</p>
          </div>
          <div className="mt-auto flex flex-wrap gap-3">
            <a href={whatsappHref(lang)} className={btn.accent}>
              <MessageCircle aria-hidden className="size-[18px]" strokeWidth={1.8} />
              {t.common.whatsappUs}
            </a>
            <a href="https://maps.google.com/?q=Sassine+Square+Beirut" className={btn.outline}>{t.contact.openMaps}</a>
          </div>
        </div>
      </div>
    </Container>
  );
}
