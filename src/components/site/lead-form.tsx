"use client";

import clsx from "clsx";
import { useState, type FormEvent } from "react";
import { WhatsAppBubble } from "@/components/ui";
import { getClassTypes, getCoach, getPlans, getTrainers } from "@/lib/data";
import { getProgram, getPrograms } from "@/lib/programs";
import { getDict, type Lang } from "@/lib/i18n";

type Mode = "trial" | "consult" | "plan" | "program";

/**
 * Free trial, PT consultation and "request this plan" form.
 * No database yet (step 4): submitting shows the WhatsApp message the person would receive.
 */
export function LeadForm({
  lang,
  mode = "trial",
  tone = "dark",
  initialChoice = "",
  idPrefix = "lead",
}: {
  lang: Lang;
  mode?: Mode;
  tone?: "dark" | "onAccent";
  initialChoice?: string;
  idPrefix?: string;
}) {
  const t = getDict(lang);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [choice, setChoice] = useState(initialChoice);
  const [errors, setErrors] = useState<{ name?: string; phone?: string }>({});
  const [done, setDone] = useState(false);

  const options =
    mode === "program"
      ? getPrograms().map((p) => ({ value: p.slug, label: `${p.name} (${p.audience === "everyone" ? "everyone" : p.audience})` }))
      : mode === "plan"
      ? getPlans().map((p) => ({ value: p.id, label: p.name[lang] }))
      : mode === "consult"
        ? [{ value: "", label: t.trial.anyTrainer }, ...getTrainers().map((c) => ({ value: c.slug, label: c.name[lang] }))]
        : [{ value: "", label: t.trial.notSure }, ...getClassTypes().map((c) => ({ value: c.slug, label: c.name[lang] }))];
  const selectLabel = mode === "program" ? t.trial.programPick : mode === "plan" ? t.trial.planPick : mode === "consult" ? t.trial.trainerPick : t.trial.interest;
  const submitLabel = mode === "program" ? t.trial.submitProgram : mode === "plan" ? t.trial.submitPlan : mode === "consult" ? t.trial.submitConsult : t.trial.submit;
  const value = (mode === "plan" || mode === "program") && !choice ? options[0].value : choice;

  function submit(e: FormEvent) {
    e.preventDefault();
    const next = {
      name: name.trim() ? undefined : t.timetable.nameError,
      phone: phone.replace(/\D/g, "").length >= 7 ? undefined : t.timetable.phoneError,
    };
    setErrors(next);
    if (!next.name && !next.phone) setDone(true);
  }

  const first = name.trim().split(/\s+/)[0] || "";
  const chosenProgram = mode === "program" ? getProgram(value) : undefined;
  const message =
    chosenProgram
      ? t.trial.waProgram(first, chosenProgram.name, getCoach(chosenProgram.coach)?.first.en ?? "Your coach")
      : mode === "plan"
      ? t.trial.waPlan(first, options.find((o) => o.value === value)?.label ?? "")
      : mode === "consult"
        ? t.trial.waConsult(first, options.find((o) => o.value === value && value)?.label ?? "")
        : t.trial.waTrial(first);

  const onAccent = tone === "onAccent";
  const field = clsx(
    "min-h-[52px] w-full rounded-[14px] border px-4 text-base",
    onAccent ? "border-bg bg-white text-bg placeholder:text-[#5E6661]" : "border-control bg-bg text-ink placeholder:text-faint",
  );
  const errorText = clsx("text-sm font-medium", onAccent ? "text-[#7A1E16]" : "text-warn");

  if (done) {
    return (
      <div className="flex flex-col gap-4" aria-live="polite">
        <p className="text-xl font-semibold">{t.trial.done}</p>
        <p className={onAccent ? "text-bg" : "text-muted"}>{t.trial.doneText}</p>
        <WhatsAppBubble text={message} />
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setName("");
            setPhone("");
          }}
          className={clsx(
            "min-h-12 self-start rounded-full border px-5 font-semibold",
            onAccent ? "border-bg text-bg" : "border-control text-ink",
          )}
        >
          {t.trial.another}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="flex flex-col gap-2">
      <label htmlFor={`${idPrefix}-name`} className="text-sm font-semibold">{t.timetable.fullName}</label>
      <input
        id={`${idPrefix}-name`}
        type="text"
        autoComplete="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t.timetable.namePlaceholder}
        aria-invalid={!!errors.name}
        aria-describedby={errors.name ? `${idPrefix}-name-err` : undefined}
        className={field}
      />
      {errors.name && <p id={`${idPrefix}-name-err`} className={errorText}>{errors.name}</p>}

      <label htmlFor={`${idPrefix}-phone`} className="mt-3 text-sm font-semibold">{t.timetable.phone}</label>
      <input
        id={`${idPrefix}-phone`}
        type="tel"
        dir="ltr"
        autoComplete="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder={t.timetable.phonePlaceholder}
        aria-invalid={!!errors.phone}
        aria-describedby={errors.phone ? `${idPrefix}-phone-err` : undefined}
        className={clsx(field, "font-mono rtl:text-right")}
      />
      {errors.phone && <p id={`${idPrefix}-phone-err`} className={errorText}>{errors.phone}</p>}

      <label htmlFor={`${idPrefix}-choice`} className="mt-3 text-sm font-semibold">{selectLabel}</label>
      <select id={`${idPrefix}-choice`} value={value} onChange={(e) => setChoice(e.target.value)} className={field}>
        {options.map((o) => (
          <option key={o.value || "none"} value={o.value}>{o.label}</option>
        ))}
      </select>

      <button
        type="submit"
        className={clsx(
          "mt-4 min-h-14 rounded-full text-[17px] font-semibold transition",
          onAccent ? "bg-bg text-ink hover:bg-black" : "bg-accent text-bg hover:brightness-95",
        )}
      >
        {submitLabel}
      </button>
    </form>
  );
}
