"use client";

import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import { useState } from "react";
import { LogoMark } from "@/components/logo";
import { brand } from "@/lib/brand";

type Lang = "en" | "ar";
type Item =
  | { kind: "day"; label: Record<Lang, string> }
  | { kind: "in"; tag: string; time: string; text: Record<Lang, string>; buttons?: Record<Lang, string[]> }
  | { kind: "out"; time: string; text: Record<Lang, string> };

const THREAD: Item[] = [
  { kind: "day", label: { en: "Today", ar: "اليوم" } },
  {
    kind: "in", tag: "Automatic · booking confirmed", time: "16:52",
    text: {
      en: `Hi Rana, you're booked: *Spin with Karim*, today at 20:15, Studio 2.\nCan't make it? Cancel here: ${brand.shortLink}/m/7KQ2`,
      ar: `مرحباً رنا، تم الحجز: *سبين مع كريم*، اليوم الساعة 20:15، استوديو 2.\nللإلغاء: ${brand.shortLink}/m/7KQ2`,
    },
  },
  {
    kind: "in", tag: "Automatic · 2 hours before class", time: "18:15",
    text: {
      en: "Spin with Karim starts at *20:15* in Studio 2. Bring water and a towel. See you there.",
      ar: "تبدأ حصة سبين مع كريم الساعة *20:15* في استوديو 2. أحضروا الماء ومنشفة. نراكم هناك.",
    },
    buttons: { en: ["I'm coming", "Cancel my spot"], ar: ["سأحضر", "إلغاء حجزي"] },
  },
  { kind: "out", time: "18:16", text: { en: "I'm coming", ar: "سأحضر" } },
  {
    kind: "in", tag: "Automatic · after class", time: "21:10",
    text: { en: "How was Spin with Karim tonight? Tap a score from 1 to 5.", ar: "كيف كانت حصة السبين مع كريم الليلة؟ اختاروا تقييماً من 1 إلى 5." },
    buttons: { en: ["1", "2", "3", "4", "5"], ar: ["1", "2", "3", "4", "5"] },
  },
  { kind: "day", label: { en: "Friday 27 November", ar: "الجمعة 27 تشرين الثاني" } },
  {
    kind: "in", tag: "Automatic · PT package running low", time: "08:10",
    text: {
      en: "Great session with Rami this morning. You have *2 sessions left* in your package. Renew 10 sessions for $300?",
      ar: "حصة رائعة مع رامي هذا الصباح. بقيت لكم *جلستان* في باقتكم. هل تريدون تجديد 10 جلسات بـ 300$؟",
    },
    buttons: { en: ["Yes, renew", "Later"], ar: ["نعم، جدّد", "لاحقاً"] },
  },
];

function Bold({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <span key={i} className="block">
          {line.split(/(\*[^*]+\*)/g).map((p, j) => (p.startsWith("*") && p.endsWith("*") ? <strong key={j}>{p.slice(1, -1)}</strong> : p))}
        </span>
      ))}
    </>
  );
}

/** Rana's phone: the automatic messages a member receives, in her chosen language. */
export function MemberPhone() {
  const [lang, setLang] = useState<Lang>("en");
  const rtl = lang === "ar";
  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex w-full max-w-[400px] flex-col overflow-hidden rounded-[22px] border border-border bg-[#ecede9] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#daddd8] bg-white px-3.5 py-3">
          <ChevronLeft aria-hidden className="size-5" />
          <LogoMark size={40} tone="dark" rounded="circle" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="font-semibold">{brand.name}</div>
            <div className="text-xs text-muted">Business account · Rana&apos;s phone</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3 py-3" dir={rtl ? "rtl" : "ltr"} lang={lang}>
          {THREAD.map((item, i) => {
            if (item.kind === "day") {
              return <div key={i} className="self-center rounded-lg bg-white px-2.5 py-0.5 text-xs text-ink-2">{item.label[lang]}</div>;
            }
            if (item.kind === "out") {
              return (
                <div key={i} className="max-w-[70%] self-end rounded-[16px_16px_4px_16px] bg-[#d9eedf] px-3 py-2 text-[15px] rtl:rounded-[16px_16px_16px_4px]">
                  {item.text[lang]}
                  <div className="text-end font-mono text-[11px] text-ink-2">{item.time}</div>
                </div>
              );
            }
            return (
              <div key={i} className="flex max-w-[88%] flex-col gap-1 self-start">
                <div dir="ltr" lang="en" className={clsx("text-[11px] font-semibold uppercase tracking-[0.06em] text-muted", rtl && "text-end")}>{item.tag}</div>
                <div className="rounded-[4px_16px_16px_16px] bg-white px-3 py-2.5 text-[15px] leading-relaxed rtl:rounded-[16px_4px_16px_16px]">
                  <Bold text={item.text[lang]} />
                  <div className="text-end font-mono text-[11px] text-muted">{item.time}</div>
                </div>
                {item.buttons && (
                  <div className="flex gap-1.5">
                    {item.buttons[lang].map((b) => (
                      <span key={b} className="flex min-h-10 flex-1 items-center justify-center rounded-xl bg-white px-2 text-sm font-semibold text-link">{b}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-4 rounded-[14px] border border-border bg-surface p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-base font-semibold">Rana&apos;s phone</h2>
          <div role="group" aria-label="Member's language" className="flex rounded-[10px] border border-border p-0.5">
            {(["en", "ar"] as const).map((l) => (
              <button key={l} type="button" aria-pressed={lang === l} onClick={() => setLang(l)}
                className={clsx("h-9 rounded-lg px-3 text-sm font-semibold", lang === l ? "bg-ink text-white" : "text-ink-2")}>
                {l === "en" ? "English" : "عربي"}
              </button>
            ))}
          </div>
        </div>
        <p className="text-sm text-ink-2">
          Everything here was sent automatically: the booking confirmation the moment the assistant booked her, the reminder 2 hours before, a rating after class, and the PT renewal offer when her package dropped to 2 sessions.
        </p>
        <p className="text-sm text-ink-2">Each member gets messages in the language they chose. Switch to see the Arabic version.</p>
        <p className="text-[13px] text-muted">Ratings feed the coach performance on the Team page. Taps on &ldquo;Cancel my spot&rdquo; free the place for the waitlist automatically.</p>
      </div>
    </div>
  );
}
