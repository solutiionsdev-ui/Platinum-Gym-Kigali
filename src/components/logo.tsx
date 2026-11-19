import clsx from "clsx";
import { brand } from "@/lib/brand";

export function BoltMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <span
      className={clsx("flex shrink-0 items-center justify-center rounded-[10px] bg-accent", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none" stroke="#0B0B0C" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
      </svg>
    </span>
  );
}

export function Wordmark({ className }: { className?: string }) {
  // The wordmark stays in Latin letters in both languages, like the logo would.
  return (
    <span dir="ltr" className={clsx("font-[family-name:var(--font-anton)] text-[26px] tracking-[0.06em]", className)}>
      {brand.short}
    </span>
  );
}
