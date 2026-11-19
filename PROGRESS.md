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
- Tuesday's timetable gained the 09:00 Spin and 14:00 Yoga that the CRM Today screen shows. The CRM's 16:00 Mobility class isn't on the website yet (no Mobility class type); fix in step 2.

## Next
- Mario clicks through the website (desktop and phone, English and Arabic).
- Then **Step 2, the CRM** on sample data (KICKOFF.md).

## Open questions
- Does Mario have a reference gym website or Instagram for the look?
- Demo brand name OK, or another one?
