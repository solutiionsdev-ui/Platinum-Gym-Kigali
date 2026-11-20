"use client";

import clsx from "clsx";
import { ChevronLeft, Mic, Play, SendHorizontal } from "lucide-react";
import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from "react";
import { LogoMark } from "@/components/logo";
import { dailySummary, respond, STARTERS, VOICE_NOTE, type ChatMessage, type Pending } from "@/lib/assistant-demo";
import { brand } from "@/lib/brand";

const WAVE = [6, 10, 16, 12, 20, 14, 8, 18, 22, 12, 9, 16, 20, 11, 7, 14, 19, 10, 6, 12, 17, 13, 8, 15, 11, 7, 10, 6];

/** *bold* and line breaks, like WhatsApp. */
function Rich({ text }: { text: string }) {
  return (
    <>
      {text.split("\n").map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line.split(/(\*[^*]+\*)/g).map((part, j) =>
            part.startsWith("*") && part.endsWith("*") && part.length > 2 ? <strong key={j}>{part.slice(1, -1)}</strong> : <Fragment key={j}>{part}</Fragment>,
          )}
        </Fragment>
      ))}
    </>
  );
}

function clock(start: number, step: number) {
  const m = start + step;
  return `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
}

/** The owner's WhatsApp assistant, scripted for the demo. */
export function AssistantChat({ starters = true }: { starters?: boolean }) {
  const [messages, setMessages] = useState<ChatMessage[]>([{ from: "bot", text: dailySummary(), time: "08:00" }]);
  const [buttons, setButtons] = useState<string[]>([]);
  const [pending, setPending] = useState<Pending>(null);
  const [text, setText] = useState("");
  const [typing, setTyping] = useState(false);
  const step = useRef(0);
  const scroller = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  function send(owner: ChatMessage, input: string) {
    if (typing) return;
    const time = clock(16 * 60 + 44, step.current++);
    setMessages((m) => [...m, { ...owner, time } as ChatMessage]);
    setButtons([]);
    setTyping(true);
    const turn = respond(input, pending);
    setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, ...turn.replies.map((r) => ({ from: "bot" as const, text: r.text, quote: r.quote, time }))]);
      setButtons(turn.buttons);
      setPending(turn.pending);
    }, 700);
  }

  function submit(e: FormEvent) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setText("");
    send({ from: "me", kind: "text", text: value, time: "" }, value);
  }

  const sendText = (value: string) => send({ from: "me", kind: "text", text: value, time: "" }, value);
  const sendVoice = () => send({ from: "me", kind: "voice", seconds: VOICE_NOTE.seconds, transcript: VOICE_NOTE.transcript, time: "" }, VOICE_NOTE.transcript);

  return (
    <div className="flex flex-wrap items-start gap-5">
      {/* Phone */}
      <div className="flex h-[720px] max-h-[calc(100vh-140px)] min-h-[520px] w-full max-w-[420px] flex-col overflow-hidden rounded-[22px] border border-border bg-[#ecede9] shadow-sm">
        <div className="flex items-center gap-3 bg-ink px-3.5 py-3 text-white">
          <ChevronLeft aria-hidden className="size-5" />
          <LogoMark size={40} rounded="circle" />
          <div className="min-w-0 flex-1 leading-tight">
            <div className="font-semibold">{brand.short} Assistant</div>
            <div className="text-xs text-[#b9c0bb]">{typing ? "typing…" : "On WhatsApp · owner access"}</div>
          </div>
        </div>

        <div ref={scroller} role="log" aria-live="polite" aria-label="Chat with the assistant" className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-3">
          <div className="self-center rounded-lg bg-white px-2.5 py-0.5 text-xs text-ink-2">Today</div>
          {messages.map((m, i) =>
            m.from === "bot" ? (
              <div key={i} className="flex max-w-[88%] flex-col gap-1.5 self-start">
                <Bubble side="in" time={m.time}>
                  <Rich text={m.text} />
                </Bubble>
                {m.quote && (
                  <div className="rounded-xl border border-border bg-white/70 px-3 py-2 text-[13px]">
                    <div className="mb-0.5 font-semibold text-link">Sent to {m.quote.to}</div>
                    <div className="text-ink-2">{m.quote.text}</div>
                  </div>
                )}
              </div>
            ) : m.kind === "voice" ? (
              <div key={i} className="flex w-[78%] flex-col gap-2 self-end rounded-[16px_16px_4px_16px] bg-ink px-3 py-2.5 text-white">
                <div className="flex items-center gap-2.5">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-accent">
                    <Play aria-hidden className="size-3.5 fill-ink text-ink" />
                  </span>
                  <span aria-hidden className="flex h-6 flex-1 items-center gap-0.5">
                    {WAVE.map((h, j) => <span key={j} className="flex-1 rounded-sm bg-faint" style={{ height: h }} />)}
                  </span>
                  <span className="font-mono text-xs text-[#b9c0bb]">0:0{m.seconds}</span>
                </div>
                <div className="border-t border-[#2b322e] pt-1.5 text-[13px] text-[#d5dad6]">
                  <span className="text-faint">Voice note:</span> &ldquo;{m.transcript}&rdquo;
                  <span className="mt-0.5 block text-xs text-faint">{VOICE_NOTE.meaning}</span>
                </div>
                <div className="text-end font-mono text-[11px] text-[#b9c0bb]">{m.time}</div>
              </div>
            ) : (
              <Bubble key={i} side="out" time={m.time}>{m.text}</Bubble>
            ),
          )}
          {typing && (
            <div className="self-start rounded-[16px_16px_16px_4px] bg-white px-3.5 py-3" aria-label="The assistant is typing">
              <span className="flex gap-1">
                {[0, 1, 2].map((d) => <span key={d} className="size-1.5 animate-pulse rounded-full bg-faint" style={{ animationDelay: `${d * 150}ms` }} />)}
              </span>
            </div>
          )}
          {buttons.length > 0 && !typing && (
            <div className="flex max-w-[88%] flex-wrap gap-1.5 self-start">
              {buttons.map((b) => (
                <button key={b} type="button" onClick={() => sendText(b)} className="min-h-10 flex-1 rounded-xl bg-white px-3 text-sm font-semibold text-link hover:bg-[#f7f8f7]">
                  {b}
                </button>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={submit} className="flex items-center gap-2 px-2.5 pb-3.5 pt-2">
          <label htmlFor="assistant-in" className="sr-only">Message the assistant</label>
          <input
            id="assistant-in"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Ask or tell me anything"
            autoComplete="off"
            className="h-[46px] min-w-0 flex-1 rounded-full bg-white px-4 text-ink placeholder:text-muted"
          />
          {text.trim() ? (
            <button type="submit" aria-label="Send" className="inline-flex size-[46px] items-center justify-center rounded-full bg-ink text-accent">
              <SendHorizontal aria-hidden className="size-5" />
            </button>
          ) : (
            <button type="button" onClick={sendVoice} aria-label="Send the demo voice note" className="inline-flex size-[46px] items-center justify-center rounded-full bg-ink text-accent">
              <Mic aria-hidden className="size-5" />
            </button>
          )}
        </form>
      </div>

      {/* Side panel */}
      {starters && (
        <div className="flex min-w-0 flex-[1_1_320px] flex-col gap-5">
          <section aria-labelledby="try-h" className="rounded-[14px] border border-border bg-surface p-5">
            <h2 id="try-h" className="text-base font-semibold">Try asking</h2>
            <p className="mt-1 text-sm text-muted">Tap one, type your own, or press the microphone to send a voice note in Kinyarwanda and English.</p>
            <div className="mt-3 flex flex-col gap-2">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => sendText(s)} disabled={typing}
                  className="min-h-11 rounded-[10px] border border-border px-3.5 text-start text-[15px] hover:border-bar-muted disabled:opacity-50">
                  {s}
                </button>
              ))}
              <button type="button" onClick={sendVoice} disabled={typing}
                className="flex min-h-11 items-center gap-2 rounded-[10px] border border-border px-3.5 text-start text-[15px] hover:border-bar-muted disabled:opacity-50">
                <Mic aria-hidden className="size-4 text-muted" /> Voice note: &ldquo;{VOICE_NOTE.transcript}&rdquo;
              </button>
            </div>
          </section>
          <section aria-labelledby="rules-h" className="rounded-[14px] border border-border bg-surface p-5 text-sm">
            <h2 id="rules-h" className="text-base font-semibold">How it behaves</h2>
            <ul className="mt-2 flex flex-col gap-2 text-ink-2">
              <li><strong className="text-ink">Never guesses who.</strong> One exact member → it acts and says who. Several → it asks (try &ldquo;Book Kevin into boxing&rdquo;).</li>
              <li><strong className="text-ink">Money needs your yes.</strong> Payments, discounts and refunds are confirmed first and logged.</li>
              <li><strong className="text-ink">Group messages need your yes.</strong> It shows how many people and the exact text first.</li>
              <li><strong className="text-ink">Daily summary at 08:00</strong>, like the first message here.</li>
            </ul>
            <p className="mt-3 text-[13px] text-muted">This is the scripted demo (step 3). The real assistant runs on Claude, reads and changes the CRM, and understands any text or voice note (step 5).</p>
          </section>
        </div>
      )}
    </div>
  );
}

function Bubble({ side, time, children }: { side: "in" | "out"; time: string; children: ReactNode }) {
  return (
    <div
      className={clsx(
        "max-w-full px-3 py-2 text-[15px] leading-snug",
        side === "in" ? "self-start rounded-[16px_16px_16px_4px] bg-white" : "max-w-[78%] self-end rounded-[16px_16px_4px_16px] bg-ink text-white",
      )}
    >
      {children}
      <div className={clsx("mt-0.5 text-end font-mono text-[11px]", side === "in" ? "text-muted" : "text-[#b9c0bb]")}>{time}</div>
    </div>
  );
}
