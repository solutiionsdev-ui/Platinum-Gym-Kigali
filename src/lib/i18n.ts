import { en } from "@/i18n/en";

/**
 * The website is English only (decided 20 Nov 2026 for Kigali).
 * The /en prefix and this file stay, so a second language (French or Kinyarwanda) can be added later
 * by adding it to `languages`, writing src/i18n/<lang>.ts and filling the sample data's text.
 */
export const languages = ["en"] as const;
export type Lang = (typeof languages)[number];

/** A piece of sample data, one entry per website language. */
export type Text = Record<Lang, string>;

export function isLang(value: string): value is Lang {
  return (languages as readonly string[]).includes(value);
}

export function getDict(lang: Lang) {
  void lang;
  return en;
}

/** Reads the language from a page's params (the layout already rejects anything else). */
export async function langFrom(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  return isLang(lang) ? lang : "en";
}

/** Link to a page in the current language: href(lang, "/classes") → "/en/classes". */
export function href(lang: Lang, path = "") {
  return `/${lang}${path}`;
}
