import type { Metadata } from "next";
import Link from "next/link";
import { Tour } from "@/components/site/tour";
import { Container, btn } from "@/components/ui";
import { brand } from "@/lib/brand";

export const metadata: Metadata = { title: "Virtual tour" };

export default function TourPage() {
  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-[640px]">
          <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">{brand.size} · {brand.equipment} equipment · open 24/7</p>
          <h1 className="mt-2 font-display display-page uppercase">Virtual tour</h1>
          <p className="mt-3 text-lg text-ink-2">Walk around the gym before you come. Tap a zone on the map to see it and what you can do there.</p>
        </div>
        <Link href="/en/first-visit" className={btn.outline}>What happens on my first visit?</Link>
      </div>
      <div className="mt-10"><Tour /></div>
    </Container>
  );
}
