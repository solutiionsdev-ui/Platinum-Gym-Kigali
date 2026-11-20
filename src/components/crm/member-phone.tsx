import { ChevronLeft } from "lucide-react";
import { LogoMark } from "@/components/logo";
import { brand } from "@/lib/brand";

type Item =
  | { kind: "day"; label: string }
  | { kind: "in"; tag: string; time: string; text: string; buttons?: string[] }
  | { kind: "out"; time: string; text: string };

const THREAD: Item[] = [
  { kind: "day", label: "Today" },
  {
    kind: "in", tag: "Automatic · booking confirmed", time: "16:52",
    text: `Hi Sandrine, you're booked: *Spin with Eric*, today at 20:15, Studio 2.\nCan't make it? Cancel here: ${brand.shortLink}/m/7KQ2`,
  },
  {
    kind: "in", tag: "Automatic · 2 hours before class", time: "18:15",
    text: "Spin with Eric starts at *20:15* in Studio 2. Bring water and a towel. See you there.",
    buttons: ["I'm coming", "Cancel my spot"],
  },
  { kind: "out", time: "18:16", text: "I'm coming" },
  {
    kind: "in", tag: "Automatic · after class", time: "21:10",
    text: "How was Spin with Eric tonight? Tap a score from 1 to 5.",
    buttons: ["1", "2", "3", "4", "5"],
  },
  { kind: "day", label: "Friday 27 November" },
  {
    kind: "in", tag: "Automatic · PT package running low", time: "08:10",
    text: "Great session with Patrick this morning. You have *2 sessions left* in your package. Renew 10 sessions for 210,000 RWF?",
    buttons: ["Yes, renew", "Later"],
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

/** Sandrine's phone: the automatic messages a member receives. */
export function MemberPhone() {
  return (
    <div className="flex flex-wrap items-start gap-5">
      <div className="flex w-full max-w-[400px] flex-col overflow-hidden rounded-[22px] border border-border bg-[#ecede9] shadow-sm">
        <div className="flex items-center gap-3 border-b border-[#daddd8] bg-white px-3.5 py-3">
          <ChevronLeft aria-hidden className="size-5" />
          <LogoMark size={40} tone="dark" rounded="circle" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="font-semibold">{brand.name}</div>
            <div className="text-xs text-muted">Business account · Sandrine&apos;s phone</div>
          </div>
        </div>
        <div className="flex flex-col gap-2 px-3 py-3">
          {THREAD.map((item, i) => {
            if (item.kind === "day") {
              return <div key={i} className="self-center rounded-lg bg-white px-2.5 py-0.5 text-xs text-ink-2">{item.label}</div>;
            }
            if (item.kind === "out") {
              return (
                <div key={i} className="max-w-[70%] self-end rounded-[16px_16px_4px_16px] bg-[#d9eedf] px-3 py-2 text-[15px]">
                  {item.text}
                  <div className="text-end font-mono text-[11px] text-ink-2">{item.time}</div>
                </div>
              );
            }
            return (
              <div key={i} className="flex max-w-[88%] flex-col gap-1 self-start">
                <div className="text-[11px] font-semibold uppercase tracking-[0.06em] text-muted">{item.tag}</div>
                <div className="rounded-[4px_16px_16px_16px] bg-white px-3 py-2.5 text-[15px] leading-relaxed">
                  <Bold text={item.text} />
                  <div className="text-end font-mono text-[11px] text-muted">{item.time}</div>
                </div>
                {item.buttons && (
                  <div className="flex gap-1.5">
                    {item.buttons.map((b) => (
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
        <h2 className="text-base font-semibold">Sandrine&apos;s phone</h2>
        <p className="text-sm text-ink-2">
          Everything here was sent automatically: the booking confirmation the moment the assistant booked the class, the reminder 2 hours before, a rating after class, and the PT renewal offer when the package dropped to 2 sessions.
        </p>
        <p className="text-[13px] text-muted">Ratings feed the coach performance on the Team page. Taps on &ldquo;Cancel my spot&rdquo; free the place for the waitlist automatically.</p>
      </div>
    </div>
  );
}
