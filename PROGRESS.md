# Progress

## Step 0: Brief & rules · done 19 Nov 2026
- `BRIEF.md`: full scope (website, CRM, owner's WhatsApp assistant, member WhatsApp automations), design starting point, data model, build steps.
- `CLAUDE.md`: working rules for every Claude Code session.
- `KICKOFF.md`: the prompt to paste for each step.
- Branches on GitHub: `main`, `mario-branch`, `michel-branch`.
- Defaults chosen (BRIEF section 10): demo brand VOLT Fitness Club (Beirut), English + Arabic for website and WhatsApp, USD + LBP, memberships + classes + PT, website dark and bold, CRM calm.

## Step 0b: Design canvas · approved by Mario 19 Nov 2026
Canvas: https://claude.ai/artifact/92Zr4x9P5eiCF9FsnxHEEF (copy of every screen in `/design`, see `design/README.md`).

12 screens in three rows:
- **Website** (dark, condensed headlines, lime accent): Home, Timetable + booking (clickable: pick a day and class, fill the form, see the WhatsApp confirmation), Memberships and PT prices, Home on phone, Booking on phone in Arabic.
- **CRM** (calm, light, same family as the EV-workshop CRM): Today with "Needs you", Member page, Money, Team performance, Today on phone with a bottom bar.
- **WhatsApp**: owner's assistant (text and a Franco-Arabic voice note, never guesses the member, asks before sending to several people), member reminders (booking confirmed, 2 h reminder, rating after class, PT package low, Arabic version).

Decisions made while designing (Mario can change any):
- Website accent color is a Tweak (lime, orange, blue, white) so the demo can be rebranded per gym.
- CRM uses black for primary buttons and the active menu item; the brand color appears only in the logo.
- Photos are labelled placeholders until a real gym sends theirs.
- One demo day across all screens: Tuesday 24 November 2026, 16:40, with matching numbers (e.g. $355 overdue from 3 members, $1,240 collected today, Rana Haddad booked into 20:15 Spin).
- Added Team performance and phone versions beyond the original 0b list, since HR performance and phone use were in Mario's request.

## Step 1: Website, clickable, sample data · built 19 Nov 2026, waiting for Mario's click-through

### What's in it
Every page in English (`/en/...`) and Arabic (`/ar/...`, right to left). `/` opens the English site.
- Home, Timetable + booking (`/classes`), class pages (`/classes/spin` …), Memberships, Personal training, trainer pages (`/trainers/rami` …), Facilities, Free trial (`/trial`, and `/trial?plan=12m` for "Request this plan"), About, Contact.
- Member's private page from WhatsApp links: `/en/m/7KQ2` (Rana's bookings, cancel buttons).
- Booking: pick a class → name + WhatsApp number → confirmation showing the WhatsApp message and when the reminder goes out. Full classes offer the waitlist. Classes before "now" (Tuesday 16:40 in the demo) show as Finished.
- Phones: menu button, a pinned "Book a free trial" bar, booking form as a sheet from the bottom.

### How it's built
- Next.js 15 + TypeScript + Tailwind 4, same as the EV-workshop CRM.
- Brand (name, accent, address, hours, WhatsApp number) only in `src/lib/brand.ts`.
- All text in `src/i18n/en.ts` and `src/i18n/ar.ts`. Sample data in `src/lib/sample-data.ts`, read only through `src/lib/data.ts`.
- Forms don't save anything yet (step 4). WhatsApp buttons go to the Contact page until a real number is set in `brand.ts`.

### Running it on this computer
`npm run dev` in this folder → http://localhost:1122 (it runs in the "Gym site :1122" tab of the Terminal panel).

### Small differences from the design (on purpose)
- Booking happens in the timetable's side panel (sheet on phones), as on the canvas, so there's no separate `/book/...` page from BRIEF section 4.
- Header "Free trial" opens its own `/trial` page; the Home page also has the trial form.
- Tuesday's timetable gained the 09:00 Spin and 14:00 Yoga that the CRM Today screen shows. The canvas's 16:00 Mobility class was dropped: the CRM reads the same timetable as the website, so Today shows 9 classes.

## Step 2: CRM, clickable, sample data · built 19 Nov 2026, waiting for Mario's click-through

Open http://localhost:1122/admin (English only, separate look from the website).

### What's in it
- **Today** (`/admin`): summary sentence, 4 numbers, "Needs you" built from the data (overdue payments, ending membership, new leads, full class with waitlist, nearly empty class, leave request, exchange rate), classes and PT today.
- **Schedule**: the same week as the website; open a class to see who's booked, the waitlist and (for past classes) who came.
- **Members**: 520 sample members (486 active) with search and filters (ending soon, owes money, not seen in 2 weeks…); every member has a page. Rana Haddad (`/admin/members/m-001`) has the full detail from the canvas.
- **Leads and trials** (`/admin/members/leads`): pipeline New → Contacted → Trial booked → Trial done → Joined / Lost.
- **Check-in** (`/admin/members/check-in`): search by name or phone, warns if someone owes money or the membership ended.
- **Training**: trainers, PT sessions today, packages running low.
- **Money**: month summary, 6-month chart, where money came from, who owes, exchange rate (can be set), expenses, latest payments.
- **Team**: coach performance, front desk numbers, staff list, who's on shift, Maya's leave request, payroll estimate.
- **Messages**: all 15 automatic WhatsApp messages with on/off switches and English/Arabic previews, latest messages.
- **Settings**: gym details, hours, prices, class types, who can see what.
- Phones: top bar, bottom bar (Today, Schedule, Check in, Members, More).

### How it's built
- `src/app/admin` has its own layout and styles (`admin.css`), separate from the website.
- Sample data in `src/lib/crm-sample-data.ts` (members are generated the same way every time), read only through `src/lib/crm-data.ts`. The timetable comes from the website's `src/lib/data.ts`, so both sides agree.
- Buttons that would send or save something show a short message at the bottom instead (nothing is stored until step 4).
- Test builds while the site runs: `NEXT_BUILD_DIR=.next-check npm run build && rm -rf .next-check` (a plain `npm run build` overwrites the running site's files and breaks it until restarted; leaving `.next-check` around confuses the type check).

### Not in step 2 (on purpose)
- No logins or roles yet (step 4). Everyone sees everything.
- The owner's WhatsApp assistant chat is step 3; Messages shows a card for it.

## Step 3: WhatsApp demo · built 19 Nov 2026, waiting for Mario's click-through

- **Owner's assistant** (`/admin/messages/assistant`): WhatsApp-style chat that starts with the 08:00 daily summary. Type, tap a suggestion, or press the microphone for a Franco-Arabic voice note ("7ot Rana Haddad bi spin lyom 7 l masa"). Understands: who owes, how full tonight is, booking a member into a class, recording a payment, who hasn't come in 2 weeks, memberships ending, coach performance, money collected, new trials, cancelling a class, prices, personal reminders.
  - Follows the brief's rules: several members match → asks which (try "Book Rami into spin"); money → asks for a yes; group messages → shows the count and the text, asks for a yes.
  - Logic in `src/lib/assistant-demo.ts`, answers built from the same sample data as the CRM.
- **What members see** (`/admin/messages/member`): Rana's phone with the booking confirmation, 2-hour reminder, rating after class and PT renewal offer, in English or Arabic.
- **Automatic messages** (`/admin/messages`): the 15 messages with switches and previews (from step 2), now with tabs to the two screens above.
- **Demo guide** (`/guide`): every screen with what to click, plus a 10-minute script for showing a gym owner. Linked from the CRM sidebar.

## Rename: Platinum Gym · 20 Nov 2026
- Gym is now **Platinum Gym** (Arabic: بلاتينوم جيم), owner **Gael Abou Samra**. Everything comes from `src/lib/brand.ts`: name, short name, logo letter, wordmark, owner, short link (`platinumgym.lb`, a placeholder).
- The VOLT lightning bolt was replaced by a "P" mark (`LogoMark` in `src/components/logo.tsx`), also in the browser tab icon.
- Colors are unchanged (lime accent). The design canvas on claude.ai still shows VOLT; it stays as the layout reference.
- Still sample data: address, hours, prices, coaches, members.

## Next
- Mario clicks through everything, starting at http://localhost:1122/guide.
- Then **Step 3b: preview link** on Vercel so gym owners can open the demo without Mario's computer (KICKOFF.md).

## Open questions
- Does Mario have a reference gym website or Instagram for the look?
- Demo brand name OK, or another one?
