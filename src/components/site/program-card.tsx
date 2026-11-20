import Link from "next/link";
import { Arrow, Photo } from "@/components/ui";
import type { Program } from "@/lib/programs";

export function ProgramCard({ p }: { p: Program }) {
  return (
    <Link href={`/en/programs/${p.slug}`} className="group flex min-w-0 flex-col overflow-hidden rounded-[22px] border border-line bg-surface transition hover:border-accent">
      <Photo k={p.image} alt={p.name} className="h-52 w-full transition duration-500 group-hover:scale-[1.02]" />
      <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">{p.level}</div>
        <h3 className="font-display text-[34px] uppercase leading-none">{p.name}</h3>
        <p className="text-[15px] text-ink-2">{p.goal}</p>
        <div className="mt-auto flex flex-wrap gap-2 pt-1 text-sm text-ink-2">
          <span className="rounded-full border border-line px-3 py-1">{p.weeks} weeks</span>
          <span className="rounded-full border border-line px-3 py-1">{p.daysPerWeek} days a week</span>
        </div>
        <span className="inline-flex items-center gap-1.5 text-[15px] font-semibold text-accent">
          See the program <Arrow className="size-4" />
        </span>
      </div>
    </Link>
  );
}
