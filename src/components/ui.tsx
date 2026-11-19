import clsx from "clsx";
import { ArrowRight, ImageIcon } from "lucide-react";
import type { ReactNode } from "react";

/** Button-looking links and buttons. */
export const btn = {
  accent:
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-accent px-7 text-[17px] font-semibold text-bg transition hover:brightness-95",
  outline:
    "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-control px-7 text-[17px] font-semibold text-ink transition hover:border-ink-2",
  light:
    "inline-flex min-h-[44px] items-center justify-center rounded-full bg-ink px-5 text-[15px] font-semibold text-bg transition hover:bg-white",
  pill: "inline-flex min-h-[44px] items-center justify-center rounded-full border border-line px-4 text-[15px] transition hover:border-control",
};

export function Arrow({ className }: { className?: string }) {
  return <ArrowRight aria-hidden className={clsx("size-[18px] rtl:-scale-x-100", className)} />;
}

export function Container({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={clsx("mx-auto w-full max-w-[1280px] px-4 sm:px-8", className)}>{children}</div>;
}

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return <p className={clsx("text-[13px] font-semibold uppercase tracking-[0.16em] text-muted", className)}>{children}</p>;
}

/** Striped stand-in for a photo, with a label saying what the photo should be. */
export function PhotoPlaceholder({ label, className, children }: { label: string; className?: string; children?: ReactNode }) {
  return (
    <div className={clsx("photo-placeholder flex flex-col justify-between rounded-[20px] border border-line p-4 text-[13px] text-faint", className)}>
      <span className="flex items-center gap-2">
        <ImageIcon aria-hidden className="size-4" strokeWidth={1.8} />
        {label}
      </span>
      {children}
    </div>
  );
}

export function SectionHead({ title, children, id }: { title: string; children?: ReactNode; id?: string }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
      <h2 id={id} className="font-display display-section uppercase">
        {title}
      </h2>
      {children}
    </div>
  );
}

/** Three short bars showing how hard a class is. */
export function LevelBars({ level, label }: { level: number; label: string }) {
  return (
    <span className="inline-flex items-center gap-1" role="img" aria-label={label}>
      {[1, 2, 3].map((n) => (
        <span key={n} className={clsx("h-1.5 w-[18px] rounded-[3px]", n <= level ? "bg-accent" : "bg-line")} />
      ))}
    </span>
  );
}

/** A WhatsApp-style message bubble, used to show members what they receive. */
export function WhatsAppBubble({ text, dir }: { text: string; dir?: "rtl" | "ltr" }) {
  return (
    <div
      dir={dir}
      className="whitespace-pre-line rounded-[4px_18px_18px_18px] bg-chat px-4 py-3.5 text-[15px] leading-relaxed text-chat-ink rtl:rounded-[18px_4px_18px_18px]"
    >
      {text}
    </div>
  );
}
