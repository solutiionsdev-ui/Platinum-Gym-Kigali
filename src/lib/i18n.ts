import { ar } from "@/i18n/ar";
import { en } from "@/i18n/en";

export const languages = ["en", "ar"] as const;
export type Lang = (typeof languages)[number];

/** A piece of sample data written in both languages. */
export type Text = { en: string; ar: string };

export function isLang(value: string): value is Lang {
  return (languages as readonly string[]).includes(value);
}

export function getDict(lang: Lang) {
  return lang === "ar" ? ar : en;
}

/** Reads the language from a page's params (the layout already rejects anything else). */
export async function langFrom(params: Promise<{ lang: string }>): Promise<Lang> {
  const { lang } = await params;
  return isLang(lang) ? lang : "en";
}

export function dirOf(lang: Lang) {
  return lang === "ar" ? "rtl" : "ltr";
}

/** Link to a page in the current language: href(lang, "/classes") → "/ar/classes". */
export function href(lang: Lang, path = "") {
  return `/${lang}${path}`;
}

/** The same page in the other language. */
export function switchLangPath(pathname: string, to: Lang) {
  const parts = pathname.split("/");
  if (parts.length > 1 && isLang(parts[1])) parts[1] = to;
  else return `/${to}`;
  return parts.join("/") || `/${to}`;
}
