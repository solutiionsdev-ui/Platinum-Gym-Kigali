/* eslint-disable @next/next/no-img-element */
import clsx from "clsx";
import { brand } from "@/lib/brand";

/**
 * The gym's logo mark. `image` shows the gym's own logo; otherwise its first letter in a colored square
 * (accent square with dark letter on the website, dark square with accent letter in the CRM).
 */
export function LogoMark({ size = 36, tone = "accent", rounded = "square", image = false, className }: {
  size?: number;
  tone?: "accent" | "dark";
  rounded?: "square" | "circle";
  image?: boolean;
  className?: string;
}) {
  if (image && brand.logoUrl) {
    return (
      <img
        src={brand.logoUrl}
        alt=""
        aria-hidden
        width={size}
        height={size}
        className={clsx("shrink-0 object-contain", rounded === "circle" ? "rounded-full" : "rounded-[22%]", className)}
        style={{ width: size, height: size }}
      />
    );
  }
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
  return (
    <span dir="ltr" className={clsx("font-[family-name:var(--font-anton)] text-[24px] tracking-[0.06em]", className)}>
      {brand.wordmark}
    </span>
  );
}
