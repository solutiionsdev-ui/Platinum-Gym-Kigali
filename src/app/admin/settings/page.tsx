import type { Metadata } from "next";
import { DemoButton } from "@/components/crm/shell";
import { Card, PageHead, button } from "@/components/crm/ui";
import { brand } from "@/lib/brand";
import { getClassTypes, getCoach, getPasses, getPlans, getPtPackages } from "@/lib/data";

export const metadata: Metadata = { title: "Settings" };

const field = "h-11 w-full rounded-[10px] border border-border bg-surface px-3 text-ink";

export default function SettingsPage() {
  return (
    <>
      <PageHead title="Settings" sub="Changes aren't saved in the demo. Saving comes with the database (step 4).">
        <DemoButton message="Settings saved (demo: nothing is stored yet)" className={button.primary}>Save changes</DemoButton>
      </PageHead>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card title="Gym details" id="gym">
          <div className="grid gap-3 px-5 py-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1 text-sm font-medium">Name<input className={field} defaultValue={brand.name} /></label>
            <label className="flex flex-col gap-1 text-sm font-medium">Phone<input className={`${field} font-mono`} defaultValue={brand.phone} /></label>
            <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">Address<input className={field} defaultValue={brand.address.en} /></label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              Brand color
              <span className="flex items-center gap-2">
                <input type="color" defaultValue={brand.accent} aria-label="Brand color" className="h-11 w-14 rounded-[10px] border border-border" />
                <span className="font-mono text-sm text-muted">{brand.accent}</span>
              </span>
            </label>
            <label className="flex flex-col gap-1 text-sm font-medium">
              WhatsApp Business number
              <input className={field} placeholder="Not connected yet (step 5)" defaultValue={brand.whatsappNumber} />
            </label>
          </div>
        </Card>

        <Card title="Opening hours" id="hours">
          {brand.hours.map((h) => (
            <div key={h.days.en} className="flex items-center justify-between gap-3 border-b border-divider px-5 py-3 last:border-0">
              <span>{h.days.en}</span>
              <input aria-label={`${h.days.en} hours`} className={`${field} w-40 font-mono`} defaultValue={h.time} />
            </div>
          ))}
        </Card>

        <Card title="Memberships and prices" id="plans">
          {[...getPlans().map((p) => ({ name: p.name.en, price: p.price })), ...getPasses().map((p) => ({ name: p.name.en, price: p.price }))].map((p) => (
            <div key={p.name} className="flex items-center justify-between gap-3 border-b border-divider px-5 py-2.5 last:border-0">
              <span>{p.name}</span>
              <span className="flex items-center gap-1.5 text-muted"><input aria-label={`${p.name} price`} className={`${field} w-28 font-mono`} defaultValue={p.price} />RWF</span>
            </div>
          ))}
        </Card>

        <Card title="Personal training packages" id="pt">
          {getPtPackages().map((p) => (
            <div key={p.name.en} className="flex items-center justify-between gap-3 border-b border-divider px-5 py-2.5 last:border-0">
              <span>{p.name.en}</span>
              <span className="flex items-center gap-1.5 text-muted"><input aria-label={`${p.name.en} price`} className={`${field} w-28 font-mono`} defaultValue={p.price} />RWF</span>
            </div>
          ))}
        </Card>

        <Card title="Class types" id="classes">
          {getClassTypes().map((c) => (
            <div key={c.slug} className="flex flex-wrap items-center justify-between gap-3 border-b border-divider px-5 py-2.5 last:border-0">
              <span className="font-medium">{c.name.en}</span>
              <span className="text-sm text-muted">{c.mins} min · {c.coaches.map((s) => getCoach(s)?.first.en).join(", ")}</span>
            </div>
          ))}
        </Card>

        <Card title="Who can see what" id="roles">
          {[
            ["Owner", "Everything, including money and pay"],
            ["Front desk", "Members, check-in, bookings, payments. No payroll or profit."],
            ["Coaches and trainers", "Their own classes, PT clients and attendance. No money."],
          ].map(([role, what]) => (
            <div key={role} className="border-b border-divider px-5 py-3 last:border-0">
              <div className="font-medium">{role}</div>
              <div className="text-sm text-muted">{what}</div>
            </div>
          ))}
        </Card>
      </div>
    </>
  );
}
