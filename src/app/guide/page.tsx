import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { brand } from "@/lib/brand";

type Screen = { href: string; title: string; click: string };

const SECTIONS: { title: string; sub: string; screens: Screen[] }[] = [
  {
    title: "Website",
    sub: "What members and visitors see. Works on phones.",
    screens: [
      { href: "/en", title: "Home", click: "Gael's slogan, real photos, the 'Start here' block, programs for men and women, real prices." },
      { href: "/en/start", title: "Find my program (quiz)", click: "3 taps: goal, man or woman, level. You get a program, a first class and a package." },
      { href: "/en/programs", title: "Training programs", click: "For men, for women, and Akantu for everyone. Open one: a normal week, what changes, start form." },
      { href: "/en/online", title: "Online coaching", click: "For people outside Rebero or abroad. Fill the 4 questions and see the WhatsApp reply." },
      { href: "/en/tour", title: "Virtual tour", click: "Tap a zone on the map to see it. Sauna and changing rooms wait for 360° photos. Video loads on tap." },
      { href: "/en/first-visit", title: "Your first visit", click: "What happens step by step, what to bring, gym words made simple." },
      { href: "/en/classes", title: "Timetable and booking", click: "Pick Tuesday 19:30 Abs & Core, type any name and number, confirm: the WhatsApp message, 'Add to Google Calendar', and it lands in the CRM." },
      { href: "/en/memberships", title: "Memberships and prices", click: "Prices in RWF. Press 'Request this plan' on 12 months." },
      { href: "/en/training", title: "Personal training", click: "Open a trainer and book a free consultation." },
      { href: "/en/trial", title: "Free trial", click: "Fill the form: you see the WhatsApp reply, and it appears in the CRM's Leads straight away (same browser)." },
      { href: "/en/m/7KQ2", title: "Member's private page", click: "The link members get on WhatsApp. Cancel a booking, no login." },
    ],
  },
  {
    title: "CRM",
    sub: "The owner and staff side. Sample data: 520 members, demo day Tuesday 24 November, 16:40.",
    screens: [
      { href: "/admin", title: "Today", click: "'Needs you' is the to-do list. 'From the website, live' shows bookings and forms the moment they're sent." },
      { href: "/admin/members", title: "Members", click: "Filter 'Owes money' or 'Not seen in 2 weeks'. Search by name or phone." },
      { href: "/admin/members/m-001", title: "Member page (Sandrine)", click: "Membership, visits, body scans, payments, PT package, WhatsApp history." },
      { href: "/admin/members/leads", title: "Leads and trials", click: "From website request to joined. Website requests arrive with a gold 'Website · new' tag." },
      { href: "/admin/members/check-in", title: "Check-in", click: "Type 'Olivier': he owes 115,000 RWF and his package ends Saturday." },
      { href: "/admin/schedule", title: "Calendar", click: "Week view of every class and PT session. Filter by coach. Click 19:30 Abs & Core to see who booked, website bookings on top." },
      { href: "/admin/money", title: "Money", click: "November profit, who owes, mobile money payments to match." },
      { href: "/admin/team", title: "Team performance", click: "Which coach fills classes, keeps members, sells PT. Approve Donyori's leave." },
      { href: "/admin/training", title: "Training & online clients", click: "PT today, packages running low, and the online coaching clients with their Monday check-ins." },
      { href: "/admin/settings", title: "Settings", click: "Google Calendar sync and a calendar link to subscribe to. 'Clear website test data' resets the demo." },
    ],
  },
  {
    title: "WhatsApp",
    sub: "The owner's assistant and the automatic messages members receive.",
    screens: [
      { href: "/admin/messages/assistant", title: "Owner's assistant", click: "Tap 'Who hasn't paid this month?', then press the microphone to send a voice note." },
      { href: "/admin/messages/member", title: "What members see", click: "Sandrine's phone: confirmation, reminder, rating, and the Monday program check-in." },
      { href: "/admin/messages", title: "Automatic messages", click: "15 messages with on/off switches and previews." },
    ],
  },
];

const SCRIPT = [
  ["Open the website on your phone", "His slogan, his photos, his prices. Works like an app, nothing to download.", "/en"],
  ["Take the quiz as a beginner", "'Tone & shape' · woman · new: it suggests Strong & Confident, a first class and a package.", "/en/start"],
  ["Show the programs", "Men and women split, explained in simple words, with a normal week and what changes.", "/en/programs"],
  ["Virtual tour and online coaching", "Walk the gym on the map; online plans for people who can't come in.", "/en/tour"],
  ["Book a class as a new member", "Tuesday 19:30 Abs & Core. Point at the WhatsApp confirmation: no app, no password.", "/en/classes"],
  ["Switch to the owner's side", "The booking you just made is already in 'From the website, live'. Then the 'Needs you' list: what to deal with first.", "/admin"],
  ["Open the calendar", "The whole week, classes and PT, per coach. Click 19:30 Abs & Core: the new booking is on top. Settings syncs it with Google Calendar.", "/admin/schedule"],
  ["Ask the assistant who hasn't paid", "Then 'Yes, send': three reminders go out.", "/admin/messages/assistant"],
  ["Send the voice note", "'Shyira Sandrine Uwimana muri abs ya 6:30pm uyu munsi': it sees 18:30 is full and offers 19:30.", "/admin/messages/assistant"],
  ["Show what Sandrine receives", "Confirmation, reminder 2 hours before, rating after class, Monday program check-in.", "/admin/messages/member"],
  ["Money", "Profit this month, who owes, MoMo payments to match.", "/admin/money"],
  ["Team", "Coach performance the owner never had in numbers before.", "/admin/team"],
  ["Front desk check-in", "Type 'Olivier': it warns he owes money.", "/admin/members/check-in"],
] as const;

export default function GuidePage() {
  return (
    <main className="mx-auto flex max-w-[1080px] flex-col gap-10 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <LogoMark image size={40} rounded="circle" />
          <span className="font-[family-name:var(--font-anton)] text-[22px] tracking-[0.08em]">{brand.wordmark}</span>
          <span className="text-muted">· demo system</span>
        </div>
        <h1 className="text-[32px] font-semibold tracking-[-0.01em]">Demo guide</h1>
        <p className="max-w-[680px] text-[17px] text-ink-2">
          Every screen of the demo, with what to click. All names and numbers are made up. Nothing is saved or sent: buttons show what would happen.
        </p>
      </header>

      <section aria-labelledby="script-h" className="rounded-[14px] border border-border bg-surface p-6">
        <h2 id="script-h" className="text-xl font-semibold">10-minute demo for a gym owner</h2>
        <ol className="mt-4 flex flex-col">
          {SCRIPT.map(([title, text, href], i) => (
            <li key={title} className="flex items-start gap-4 border-b border-divider py-3 last:border-0">
              <span className="w-7 shrink-0 font-mono text-muted">{String(i + 1).padStart(2, "0")}</span>
              <div className="min-w-0 flex-1">
                <div className="font-semibold">{title}</div>
                <div className="text-sm text-muted">{text}</div>
              </div>
              <Link href={href} className="inline-flex min-h-11 shrink-0 items-center gap-1 text-sm font-semibold text-link hover:underline">
                Open <ArrowUpRight aria-hidden className="size-4" />
              </Link>
            </li>
          ))}
        </ol>
      </section>

      {SECTIONS.map((s) => (
        <section key={s.title} aria-labelledby={`sec-${s.title}`}>
          <h2 id={`sec-${s.title}`} className="text-xl font-semibold">{s.title}</h2>
          <p className="text-muted">{s.sub}</p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {s.screens.map((sc) => (
              <Link key={sc.href} href={sc.href} className="group flex flex-col gap-1.5 rounded-[14px] border border-border bg-surface p-4 transition hover:border-bar-muted">
                <span className="flex items-center justify-between gap-2 font-semibold">
                  {sc.title}
                  <ArrowUpRight aria-hidden className="size-4 text-muted group-hover:text-ink" />
                </span>
                <span className="font-mono text-xs text-muted">{sc.href}</span>
                <span className="text-sm text-ink-2">{sc.click}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <footer className="border-t border-border pt-6 text-sm text-muted">
        Built by solutiions.dev. Next steps: database and logins (step 4), real WhatsApp with Meta-approved templates and the Claude-powered assistant (step 5).
      </footer>
    </main>
  );
}
