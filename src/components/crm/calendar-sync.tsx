"use client";

import clsx from "clsx";
import { CalendarDays, Copy, Download, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { clearDemoData, useDemoData } from "@/lib/demo-store";
import { useToast } from "./toast";
import { Card, button } from "./ui";

const OPTIONS = [
  { key: "classes", label: "Classes", text: "Each class goes into its coach's calendar, with the room and how many are booked." },
  { key: "pt", label: "Personal training", text: "Each PT session goes into the trainer's calendar. Moves and cancellations update it." },
  { key: "owner", label: "Gael's calendar", text: "The owner sees every class and PT session in one calendar." },
  { key: "members", label: "Members", text: "After booking on the website, members get “Add to Google Calendar” and an iPhone/Outlook file." },
] as const;

/** Settings: Google Calendar sync (demo) and the real calendar feed link. */
export function CalendarSync({ coaches }: { coaches: { slug: string; name: string }[] }) {
  const toast = useToast();
  const [connected, setConnected] = useState(false);
  const [on, setOn] = useState<Record<string, boolean>>({ classes: true, pt: true, owner: true, members: true });
  const [coach, setCoach] = useState("all");
  const [origin, setOrigin] = useState("");
  useEffect(() => setOrigin(window.location.origin), []);
  const path = `/api/calendar${coach === "all" ? "" : `?coach=${coach}`}`;

  async function copy() {
    try {
      await navigator.clipboard.writeText(origin + path);
      toast("Calendar link copied");
    } catch {
      toast("Select the link and copy it");
    }
  }

  return (
    <Card title="Calendar sync" id="calendar" className="lg:col-span-2">
      <div className="flex flex-col gap-5 px-5 py-4">
        <div className="flex flex-wrap items-center gap-4">
          <span className="flex size-11 items-center justify-center rounded-xl bg-[#e8f0fe] text-[#1a56c4]">
            <CalendarDays aria-hidden className="size-6" />
          </span>
          <div className="min-w-[200px] flex-1">
            <div className="font-semibold">Google Calendar</div>
            <div className="text-sm text-muted">
              {connected ? "Connected (demo). Classes and PT sessions appear in Gael's and the coaches' calendars." : "Not connected. Gael signs in with Google once; coaches accept an invite."}
            </div>
          </div>
          {connected ? (
            <button type="button" className={button.secondary} onClick={() => { setConnected(false); toast("Google Calendar disconnected"); }}>Disconnect</button>
          ) : (
            <button type="button" className={button.primary} onClick={() => { setConnected(true); toast("Demo: the real system opens Google sign-in here, then syncs every class and PT session"); }}>
              Connect Google Calendar
            </button>
          )}
        </div>

        <fieldset className="grid gap-2 sm:grid-cols-2">
          <legend className="mb-2 text-sm font-semibold">What goes into calendars</legend>
          {OPTIONS.map((o) => (
            <label key={o.key} className={clsx("flex cursor-pointer gap-3 rounded-xl border p-3.5 transition", on[o.key] ? "border-ink" : "border-border")}>
              <input type="checkbox" checked={on[o.key]} onChange={(e) => setOn((s) => ({ ...s, [o.key]: e.target.checked }))} className="mt-0.5 size-5 shrink-0 accent-[#111412]" />
              <span>
                <span className="block font-semibold">{o.label}</span>
                <span className="block text-sm text-muted">{o.text}</span>
              </span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-col gap-2 rounded-xl bg-bg p-4">
          <div className="text-sm font-semibold">Or subscribe with a link (works today)</div>
          <p className="text-sm text-muted">
            Paste it in Google Calendar (Other calendars → From URL), Apple Calendar or Outlook. Classes repeat every week. Google can only reach it once the demo is online (preview link).
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="feed-coach">Whose classes</label>
            <select id="feed-coach" value={coach} onChange={(e) => setCoach(e.target.value)} className="h-11 rounded-[10px] border border-border bg-surface px-3">
              <option value="all">All classes</option>
              {coaches.map((c) => <option key={c.slug} value={c.slug}>{c.name}&apos;s classes</option>)}
            </select>
            <input readOnly value={origin + path} aria-label="Calendar link" onFocus={(e) => e.currentTarget.select()}
              className="h-11 min-w-0 flex-[1_1_260px] rounded-[10px] border border-border bg-surface px-3 font-mono text-sm" />
            <button type="button" onClick={copy} className={button.small}><Copy aria-hidden className="size-4" /> Copy</button>
            <a href={path} download="platinum-classes.ics" className={button.small}><Download aria-hidden className="size-4" /> Download</a>
          </div>
        </div>
      </div>
    </Card>
  );
}

/** Settings: what the website has sent in this browser, and a button to start the demo fresh. */
export function WebsiteTestData() {
  const data = useDemoData();
  const toast = useToast();
  const total = data.bookings.length + data.leads.length;
  return (
    <Card title="Website connection" id="website">
      <div className="flex flex-col gap-3 px-5 py-4">
        <p className="text-ink-2">
          Bookings and forms from the website show up live in Today, Calendar, Leads and Training. In the demo they&apos;re kept in this browser only; the database (step 4) makes them
          reach every phone and computer.
        </p>
        <p className="font-medium">
          {total === 0 ? "Nothing from the website yet." : `${data.bookings.length} bookings and ${data.leads.length} forms from the website so far.`}
        </p>
        <button type="button" disabled={total === 0} onClick={() => { clearDemoData(); toast("Website test data cleared: the demo starts fresh"); }}
          className={clsx(button.secondary, "self-start disabled:cursor-not-allowed disabled:opacity-50")}>
          <Trash2 aria-hidden className="size-4" /> Clear website test data
        </button>
      </div>
    </Card>
  );
}
