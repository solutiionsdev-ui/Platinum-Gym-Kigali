import clsx from "clsx";
import Link from "next/link";

const TABS = [
  { href: "/admin/members", label: "All members" },
  { href: "/admin/members/leads", label: "Leads and trials" },
  { href: "/admin/members/check-in", label: "Check-in" },
];

export function MembersTabs({ active }: { active: string }) {
  return (
    <nav aria-label="Members sections" className="flex flex-wrap gap-1 border-b border-border">
      {TABS.map((t) => {
        const on = t.href === active;
        return (
          <Link
            key={t.href}
            href={t.href}
            aria-current={on ? "page" : undefined}
            className={clsx("-mb-px flex h-11 items-center border-b-2 px-3.5", on ? "border-ink font-semibold" : "border-transparent font-medium text-muted hover:text-ink")}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
