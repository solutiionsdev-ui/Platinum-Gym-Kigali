import clsx from "clsx";
import { brand } from "@/lib/brand";

/**
 * The gym's logo mark: its first letter in a colored square.
 * `tone` picks the colors: accent square with dark letter (website), or dark square with accent letter (CRM).
 */
export function LogoMark({ size = 36, tone = "accent", rounded = "square", className }: {
  size?: number;
  tone?: "accent" | "dark";
  rounded?: "square" | "circle";
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={clsx(
        "flex shrink-0 items-center justify-center leading-none",
        tone === "accent" ? "bg-accent text-[#0B0B0C]" : "bg-[#111412] text-accent",
        rounded === "circle" ? "rounded-full" : "rounded-[28%]",
        className,
      )}
      // Anton on the website; the CRM doesn't load Anton, so it falls back to Geist bold.
      style={{ width: size, height: size, fontSize: size * 0.56, fontWeight: 700, fontFamily: "var(--font-anton, var(--font-geist, sans-serif))" }}
    >
      {brand.monogram}
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  // The wordmark stays in Latin letters in both languages, like the logo would.
  return (
    <span dir="ltr" className={clsx("font-[family-name:var(--font-anton)] text-[26px] tracking-[0.06em]", className)}>
      {brand.wordmark}
    </span>
  );
}
