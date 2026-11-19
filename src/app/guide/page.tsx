import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

type Screen = { href: string; title: string; click: string };

const SECTIONS: { title: string; sub: string; screens: Screen[] }[] = [
  {
    title: "Website",
    sub: "What members and visitors see. English and Arabic, works on phones.",
    screens: [
      { href: "/en", title: "Home", click: "Scroll the page; the 'Today at VOLT' strip shows spots left in tonight's classes." },
      { href: "/ar", title: "Home in Arabic", click: "Same site, right to left. The عربي / English button switches any page." },
      { href: "/en/classes", title: "Timetable and booking", click: "Pick Tuesday 20:15 Spin, type any name and number, confirm: you see the WhatsApp message the member gets." },
      { href: "/en/memberships", title: "Memberships and prices", click: "Press 'Request this plan' on 12 months." },
      { href: "/en/training", title: "Personal training", click: "Open a trainer and book a free consultation." },
      { href: "/en/trial", title: "Free trial", click: "Fill the form: you see the WhatsApp reply. Saving it as a lead in the CRM comes with the database (step 4)." },
      { href: "/en/m/7KQ2", title: "Member's private page", click: "The link members get on WhatsApp. Cancel a booking, no login." },
    ],
  },
  {
    title: "CRM",
    sub: "The owner and staff side. Sample data: 520 members, demo day Tuesday 24 November, 16:40.",
    screens: [
      { href: "/admin", title: "Today", click: "'Needs you' is the to-do list. Press 'Send reminders' or 'Offer 20:15'." },
      { href: "/admin/members", title: "Members", click: "Filter 'Owes money' or 'Not seen in 2 weeks'. Search by name or phone." },
      { href: "/admin/members/m-001", title: "Member page (Rana)", click: "Membership, visits, body scans, payments, PT package, WhatsApp history." },
      { href: "/admin/members/leads", title: "Leads and trials", click: "From website request to joined. Press 'Send offer' on a finished trial." },
      { href: "/admin/members/check-in", title: "Check-in", click: "Type 'Hadi': he owes $160 and his membership ends Saturday." },
      { href: "/admin/schedule", title: "Schedule", click: "Open 19:00 Spin to see who's booked and the waitlist." },
      { href: "/admin/money", title: "Money", click: "November profit, who owes, set today's LBP rate." },
      { href: "/admin/team", title: "Team performance", click: "Which coach fills classes, keeps members, sells PT. Approve Maya's leave." },
      { href: "/admin/settings", title: "Settings", click: "Gym details, prices, class types, who can see what." },
    ],
  },
  {
    title: "WhatsApp",
    sub: "The owner's assistant and the automatic messages members receive.",
    screens: [
      { href: "/admin/messages/assistant", title: "Owner's assistant", click: "Tap 'Who hasn't paid this month?', then press the microphone to send a voice note." },
      { href: "/admin/messages/member", title: "What members see", click: "Rana's phone: confirmation, reminder, rating, PT renewal. Switch to Arabic." },
      { href: "/admin/messages", title: "Automatic messages", click: "15 messages with on/off switches and English/Arabic previews." },
    ],
  },
];

const SCRIPT = [
  ["Open the website on your phone", "Show the Arabic version with one tap.", "/ar"],
  ["Book a class as a new member", "Tuesday 20:15 Spin. Point at the WhatsApp confirmation: no app, no password.", "/en/classes"],
  ["Switch to the owner's side", "Today's 'Needs you' list: what to deal with first, not a wall of charts.", "/admin"],
  ["Ask the assistant who hasn't paid", "Then 'Yes, send': three reminders go out.", "/admin/messages/assistant"],
  ["Send the voice note", "'7ot Rana Haddad bi spin lyom 7 l masa': it sees 19:00 is full and offers 20:15.", "/admin/messages/assistant"],
  ["Show what Rana receives", "Confirmation, reminder 2 hours before, rating after class, in her language.", "/admin/messages/member"],
  ["Money", "Profit this month, who owes, LBP rate.", "/admin/money"],
  ["Team", "Coach performance the owner never had in numbers before.", "/admin/team"],
  ["Front desk check-in", "Type 'Hadi': it warns he owes money.", "/admin/members/check-in"],
] as const;

export default function GuidePage() {
  return (
    <main className="mx-auto flex max-w-[1080px] flex-col gap-10 px-4 py-10 sm:px-8">
      <header className="flex flex-col gap-2">
        <div className="flex items-center gap-2.5">
          <span className="flex size-9 items-center justify-center rounded-[10px] bg-ink">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z" />
            </svg>
          </span>
          <span className="font-bold tracking-[0.04em]">VOLT gym system</span>
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
