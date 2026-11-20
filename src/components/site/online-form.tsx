"use client";

import clsx from "clsx";
import { useState, type FormEvent } from "react";
import { WhatsAppBubble } from "@/components/ui";
import { getDict } from "@/lib/i18n";

const GOALS = ["Lose weight", "Build muscle", "Tone & shape", "Get fit & healthy"];
const PLACES = ["At home, no equipment", "At home, a few weights", "In a gym near me"];
const DAYS = ["2 days", "3 days", "4 days", "5 days"];

/** Online coaching questionnaire. No database yet: submitting shows the WhatsApp reply. */
export function OnlineForm() {
  const t = getDict("en");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [goal, setGoal] = useState(GOALS[0]);
  const [place, setPlace] = useState(PLACES[0]);
  const [days, setDays] = useState(DAYS[1]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState(false);

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim() ? undefined : t.timetable.nameError,
      phone: phone.replace(/\D/g, "").length >= 7 ? undefined : t.timetable.phoneError,
    };
    setErrors(next);
    if (!next.name && !next.phone) setDone(true);
  }

  const field = "min-h-[52px] w-full rounded-[14px] border border-control bg-bg px-4 text-base text-ink placeholder:text-faint";

  if (done) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <p className="text-xl font-semibold">Thanks, {name.trim().split(/\s+/)[0]}!</p>
        <p className="text-muted">This is the WhatsApp message you get right now:</p>
        <WhatsAppBubble text={t.trial.waOnline(name.trim().split(/\s+/)[0])} />
        <p className="text-sm text-muted">Your answers go to the CRM&apos;s online clients list, where Gael&apos;s team writes your plan.</p>
        <button type="button" onClick={() => setDone(false)} className="min-h-12 self-start rounded-full border border-control px-5 font-semibold">Change my answers</button>
      </div>
    );
  }

  const Chips = ({ label, options, value, set }: { label: string; options: string[]; value: string; set: (v: string) => void }) => (
    <fieldset className="flex flex-col gap-2">
      <legend className="mb-2 text-sm font-semibold">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button key={o} type="button" aria-pressed={value === o} onClick={() => set(o)}
            className={clsx("min-h-11 rounded-full border px-4 text-[15px] font-semibold transition", value === o ? "border-accent bg-accent text-bg" : "border-line hover:border-control")}>
            {o}
          </button>
        ))}
      </div>
    </fieldset>
  );

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-5">
      <Chips label="1. Your goal" options={GOALS} value={goal} set={setGoal} />
      <Chips label="2. Where will you train?" options={PLACES} value={place} set={setPlace} />
      <Chips label="3. How many days a week?" options={DAYS} value={days} set={setDays} />
      <div className="flex flex-col gap-2">
        <label htmlFor="on-notes" className="text-sm font-semibold">4. Any pain or injury we should know about? (optional)</label>
        <input id="on-notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="e.g. knee pain when running" className={field} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2">
          <label htmlFor="on-name" className="text-sm font-semibold">{t.timetable.fullName}</label>
          <input id="on-name" value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder={t.timetable.namePlaceholder}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? "on-name-err" : undefined} className={field} />
          {errors.name && <p id="on-name-err" className="text-sm font-medium text-warn">{errors.name}</p>}
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="on-phone" className="text-sm font-semibold">{t.timetable.phone}</label>
          <input id="on-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder={t.timetable.phonePlaceholder}
            aria-invalid={!!errors.phone} aria-describedby={errors.phone ? "on-phone-err" : undefined} className={clsx(field, "font-mono")} />
          {errors.phone && <p id="on-phone-err" className="text-sm font-medium text-warn">{errors.phone}</p>}
        </div>
      </div>
      <button type="submit" className="min-h-14 rounded-full bg-accent text-[17px] font-semibold text-bg transition hover:brightness-95">{t.trial.submitOnline}</button>
      <p className="text-sm text-muted">Pay the first month only after you receive and like your plan. MTN MoMo, Airtel Money or card.</p>
    </form>
  );
}
