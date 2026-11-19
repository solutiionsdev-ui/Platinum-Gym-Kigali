"use client";

import { useState, type FormEvent } from "react";
import { brand } from "@/lib/brand";
import { Chip } from "./ui";
import { useToast } from "./toast";

/** Today's LBP rate. Every LBP payment uses the rate of its day. */
export function RateForm({ yesterday }: { yesterday: number }) {
  const toast = useToast();
  const [value, setValue] = useState("");
  const [rate, setRate] = useState<number | null>(null);

  function submit(e: FormEvent) {
    e.preventDefault();
    const n = Number(value.replace(/[^\d]/g, ""));
    if (!n) return;
    setRate(n);
    toast(`Today's rate set: ${n.toLocaleString("en-US")} LBP per $1`);
  }

  return (
    <section id="rate" aria-labelledby="rate-h" className="flex flex-col gap-2.5 rounded-[14px] border border-border bg-surface px-5 py-4">
      <div className="flex items-center justify-between gap-2.5">
        <h2 id="rate-h" className="text-base font-semibold">Exchange rate</h2>
        {rate ? <Chip cls="bg-ok-bg text-ok">Set for today</Chip> : <Chip cls="bg-warn-bg text-warn">Not set today</Chip>}
      </div>
      <div className="text-sm text-ink-2">
        {rate ? (
          <>Today: <strong className="font-mono text-ink">{rate.toLocaleString("en-US")} LBP</strong> per $1, set by {brand.owner.first} at 16:40</>
        ) : (
          <>Yesterday: <strong className="font-mono text-ink">{yesterday.toLocaleString("en-US")} LBP</strong> per $1, set by Sara Mansour at 08:12</>
        )}
      </div>
      <form onSubmit={submit} className="flex gap-2">
        <label htmlFor="rate-in" className="sr-only">Today&apos;s rate in LBP per dollar</label>
        <input
          id="rate-in"
          inputMode="numeric"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={yesterday.toLocaleString("en-US")}
          className="h-11 min-w-0 flex-1 rounded-[10px] border border-border px-3 font-mono placeholder:text-faint"
        />
        <button type="submit" className="h-11 rounded-[10px] bg-ink px-4 font-semibold text-white">Set rate</button>
      </form>
    </section>
  );
}
