# Gym System — Project Brief

Built by **solutiions.dev** as a **demo system to sell to gyms** (Lebanon first). One product with four parts:

1. **Website** for members and visitors: see the gym, its classes, prices and trainers, and book.
2. **CRM** for the owner and staff: classes, members, money, team and performance.
3. **Owner's WhatsApp assistant**: the owner asks questions and gets things done in the system from WhatsApp.
4. **Member WhatsApp automations**: reminders for classes, PT sessions and payments, plus follow-ups.

Design canvas (approved screens, 19 Nov 2026): https://claude.ai/artifact/92Zr4x9P5eiCF9FsnxHEEF (copy in `/design`).

Demo brand: **VOLT Fitness Club**, Beirut (made up). The name, logo, colors, address and contact details live in **one file** (`src/lib/brand.ts`) so the demo can be rebranded for each gym we pitch.

---

## 1. What this is

**Users**
- **Owner**: sees everything, including money and team pay. Also talks to the system through the WhatsApp assistant.
- **Front desk**: checks members in, takes payments, books classes, handles trials and leads. No access to payroll or profit.
- **Coaches & personal trainers**: see their own classes and PT clients, mark attendance, add notes and measurements. No access to money, except their own sessions and commission.
- **Members**: never log in to the CRM. They use the website (booking) and WhatsApp (confirmations, reminders, "my bookings" link).
- **Visitors**: browse the website, book a free trial or ask a question on WhatsApp.

**Principles**
1. **The website sells, the CRM calms.** Website: bold, dark, energetic. CRM: minimal and calm, black/grey/white, with color only for status.
2. CRM home is a **to-do list ("Needs you")**, not a wall of charts. Charts only where they answer a question (money, attendance, performance).
3. **WhatsApp-first** for everything member-facing. Members book with their name + WhatsApp number. No passwords.
4. Front desk screens are designed for a **phone or tablet** at the reception desk.
5. Money changes (discounts, price edits, payments, refunds, freezes that move an end date) **always require confirmation** and are logged.
6. Prices in **USD**; support recording **LBP** payments with the day's exchange rate.
7. Website and WhatsApp messages in **English + Arabic** (Arabic is right-to-left). The CRM is in English.

---

## 2. Design system

The final look is decided in **step 0b (design canvas)**. Starting point:

### Website (bold, dark)
| Token | Hex | Use |
|---|---|---|
| bg | #0B0B0C | Page background |
| surface | #151517 | Cards, sections |
| line | #2A2A2E | Borders |
| ink | #F5F5F2 | Main text |
| muted | #A6A6AD | Secondary text (never lighter: contrast) |
| accent | #C8F135 | Buttons, highlights (electric lime). **Changeable per gym** from `brand.ts` |
| on-accent | #0B0B0C | Text on accent buttons |

- **Fonts:** a condensed display font for big headlines (e.g. Barlow Condensed or Anton, uppercase), Geist for body text, **IBM Plex Sans Arabic** for Arabic.
- Big full-bleed photos, short punchy copy, large buttons (min 48px). Sticky "Book a free trial" button + WhatsApp button on phones.
- Photos: royalty-free stock or AI-generated for the demo, replaced with the real gym's photos per client.

### CRM (calm, same family as the EV-workshop CRM)
| Token | Hex | Use |
|---|---|---|
| bg | #F6F7F6 | App background |
| surface | #FFFFFF | Cards, sidebar |
| border | #E4E7E5 | Card borders |
| divider | #EEF0EE | Rows inside cards |
| ink | #111412 | Main text, primary buttons, active nav |
| muted | #5E6661 | Secondary text |
| accent | = brand accent, only in the logo mark and small highlights. Primary buttons and the active menu item use ink. Configurable. |

**Status colors** (text on background, all must pass 4.5:1 contrast; final values set in step 0b)
| Membership | Booking | Payment |
|---|---|---|
| Trial · Active · Expiring soon · Expired · Frozen · Cancelled | Booked · Waitlist · Attended · No-show · Late cancel · Cancelled | Paid · Due soon · Overdue · Partly paid |

**Shapes & sizing:** cards radius 14px with 1px border; buttons min 44px tall, radius 10px; status chips are pills with a dot; touch targets ≥ 44px; icons lucide-react 18px. Every screen must work at phone width (390px). On phones the CRM uses a bottom bar instead of the sidebar.

---

## 3. Scope

### A. Website (public)
1. **Home**: hero + "Book a free trial", what we offer, class types, trainers, membership plans, member results/testimonials, opening hours and location, WhatsApp button.
2. **Classes & timetable**: weekly schedule, filter by class type, coach and time of day; each class shows spots left; class detail page (what it is, level, duration, coach).
3. **Book a class**: pick a session → name + WhatsApp number → confirm. Full class → join the waitlist. Confirmation arrives on WhatsApp.
4. **Memberships & prices**: plans (monthly, 3/6/12 months, class packs, day pass, student/couple), comparison, "Join" → request goes to the CRM (paid at the gym or by transfer in v1).
5. **Personal training**: trainer profiles (specialty, certifications, photo), PT packages, book a PT session or a free consultation.
6. **Facilities & services**: gym floor, studios, extras such as body-composition scan, nutrition coaching, sauna (depends on the gym).
7. **Free trial / day pass** booking.
8. **About, FAQ, contact & location** (map, hours, parking).
9. **"My bookings" page**: a private link sent on WhatsApp (`/m/<code>`) showing the member's upcoming bookings, membership end date, PT sessions left, with cancel buttons. No login.
10. **English / Arabic** switch on every page.

### B. CRM (`/admin`)
1. **Today**: "Needs you" list (section 9), today's classes with bookings, PT sessions today, check-ins so far, money collected today.
2. **Schedule & classes**: weekly calendar, class types, rooms, recurring sessions (coach, capacity, duration), roster per session, waitlist, mark attendance, cancel or move a session (booked members are notified).
3. **Check-in**: front desk search by name or phone (later: QR code), shows membership status and any money owed at a glance.
4. **Members**: list with status filters; member page with contact, plan, start/end dates, freeze history, payments, bookings and attendance, PT package balance, body measurements and progress, health notes and waiver, emergency contact, notes, WhatsApp history.
5. **Leads & trials**: requests from the website and WhatsApp, pipeline **New → Contacted → Trial booked → Trial done → Joined / Lost**, with who followed up and when.
6. **Personal training**: PT packages sold, sessions left, each trainer's PT calendar, session notes.
7. **Money (accounting)**: income by type (memberships, PT, day passes, extras), payments (cash USD, cash LBP, card, transfer, Whish, OMT), receipts, who owes what, expenses by category (rent, salaries, utilities, generator/fuel, equipment, marketing), monthly **profit & loss**, daily exchange rate.
8. **Team (HR)**: employees (role, contract, pay type: monthly / hourly / per class, PT commission %), shift schedule, clock-in/out, leave requests, monthly payroll (base + classes + PT commission − advances).
9. **Performance**: per coach: classes taught, average fill rate, attendance and no-show rate, members kept (retention of their regulars), PT sessions delivered, PT packages sold, member ratings. Per front desk: trials converted, payments collected, renewals made. Ranking for the month, kept simple.
10. **Messages**: WhatsApp inbox, one conversation per member, staff can reply.
11. **Automations**: every automatic message (section 3D) with on/off, timing, English + Arabic preview, and a log of what was sent.
12. **Reports**: revenue trend, active members over time, churn and renewals, class popularity, peak hours.
13. **Settings**: gym info and brand, plans and prices, class types, rooms, opening hours, staff roles and access, WhatsApp templates, exchange rate.

### C. Owner's WhatsApp assistant
One WhatsApp Business number for the gym. Members message it normally. The **owner's personal number is whitelisted** → assistant mode with full access. Staff numbers can get limited access (e.g. coaches: their own classes and attendance, no money).

Understands text and **voice notes** in Lebanese Arabic, Franco-Arab and English.

- **Ask**: "How many members expire this week?", "How full is tonight's 7pm spin?", "Who owes money?", "Collected this month?", "Who hasn't come in 2 weeks?", "How is Karim doing this month?" (coach performance), "Trials this week and how many joined?"
- **Do**: book or cancel a member's class, cancel a session and notify everyone booked, record a payment, freeze or extend a membership, add an expense, send a reminder or a renewal offer to one member, send a message to everyone booked in a class.
- **Daily summary at 08:00**: today's classes and how full they are, PT sessions, payments due, memberships expiring, trials to follow up, staff on shift.
- **Personal reminders**: "remind me tomorrow at 10 to call the equipment supplier".

**Member-matching rule:** one exact match → act, then confirm back who it was ("Booked Rana Haddad, +961 3 xx xx 21, into Tue 7pm Spin"). No match or several matches → ask which one. **Never guess.**
**Money rule:** payments, discounts, refunds, price changes and freezes/extensions need the owner's confirmation reply, and are logged with who/when.
**Broadcast rule:** any message to more than one member shows the count and the text first and needs a "yes".

### D. Member WhatsApp automations
| Message | When (default, editable) |
|---|---|
| Booking confirmed (class, PT, trial) | Right after booking |
| Class reminder (with cancel link) | 2 hours before |
| PT session reminder | 24 hours and 2 hours before |
| Spot opened from waitlist | As soon as a spot frees up |
| Class cancelled or moved | As soon as staff change it |
| Payment due | 3 days before |
| Payment overdue | Day 1 and day 7 after |
| Membership expiring | 7 days and 1 day before |
| Membership expired → renewal offer | Day after expiry |
| Trial follow-up ("how was it?" + offer) | Evening of the trial |
| Missed class (no-show) | Same day |
| "We miss you" | No visit for 14 days |
| PT package running low | 2 sessions left |
| Welcome (how to book, hours, rules) | When they join |
| Birthday | On the day |

- **Quiet hours**: nothing automatic between 22:00 and 08:00 (Beirut time).
- Members can reply **STOP** to stop non-essential messages; booking confirmations and payment messages still go out.
- Each member gets messages in their language (English or Arabic).

**WhatsApp platform rules to respect**
- Free-form replies only within 24 hours of the member's last message.
- Everything else (reminders, payment messages, offers) must use **Meta-approved message templates** (small per-message fee). All automated messages must be written as templates and approved before going live.
- In development, messages go **only to test numbers**. Never message real members from a development environment.

---

## 4. Screens

### Website
`/` Home · `/classes` Timetable · `/classes/[type]` Class detail · `/book/[session]` Booking · `/memberships` Prices · `/training` Personal training · `/trainers/[slug]` Trainer · `/facilities` · `/trial` Free trial · `/about` · `/contact` · `/m/[code]` My bookings · Arabic versions of every page.

### CRM (menu: 8 sections)
Today · Schedule · Members (incl. Check-in and Leads) · Training (PT) · Money · Team (incl. Performance) · Messages (incl. Automations and Assistant) · Settings. Reports live inside Money and Team where they answer a question.

### Demo helpers
`/guide`: one page that links every screen with a line on what to click, for Mario to demo to a gym owner.
`/admin/assistant`: a **scripted** WhatsApp-style chat (step 3) that answers from sample data, so the assistant can be shown before any Meta setup.

---

## 5. Status flows

- **Membership:** Trial → Active → Expiring soon (≤ 7 days) → Expired. Active ↔ Frozen (end date moves by the frozen days). Any → Cancelled.
- **Booking:** Booked or Waitlist → Attended / No-show / Late cancel (< 2 h before, may cost a credit) / Cancelled. Waitlist → Booked when a spot frees up.
- **Lead:** New → Contacted → Trial booked → Trial done → Joined / Lost (with a reason).
- **Payment:** Due soon → Paid / Partly paid / Overdue.

---

## 6. Data model (starting point)

- **gyms** (for several branches later): name, brand, logo, accent, phone, address, hours, currency settings, time zone
- **staff**: name, phone, role (owner / front_desk / coach / trainer), pay_type, base_pay, per_class_rate, pt_commission_pct, active, photo, bio, specialties
- **members**: name, phone (WhatsApp), email, language, birthday, gender, emergency_contact, health_notes, waiver_signed_at, source (website / walk-in / referral / instagram), access_code (for `/m/<code>`), opted_out_at
- **plans**: name, name_ar, type (time / class_pack / pt_pack / day_pass), duration_days, class_credits, pt_sessions, price_usd, active
- **memberships**: member_id, plan_id, status, start_date, end_date, credits_left, frozen_from, frozen_until, sold_by
- **class_types**: name, name_ar, description, level, duration_min, color_tag
- **rooms**: name, capacity
- **sessions**: class_type_id, coach_id, room_id, starts_at, capacity, status (scheduled / cancelled), recurring_rule
- **bookings**: session_id, member_id, status, booked_via (website / whatsapp / desk / assistant), booked_at, cancelled_at, checked_in_at
- **pt_sessions**: member_id, trainer_id, membership_id, starts_at, status, notes
- **check_ins**: member_id, at, by_staff_id, method (desk / qr)
- **measurements**: member_id, date, weight, body_fat_pct, muscle_mass, notes, by_staff_id
- **leads**: name, phone, source, status, interest, assigned_to, next_follow_up, lost_reason
- **payments**: member_id, membership_id, amount, currency, rate, method, received_by, confirmed_by, created_at
- **expenses**: category, amount, currency, rate, paid_at, note, added_by
- **exchange_rates**: date, lbp_per_usd, set_by
- **shifts**: staff_id, starts_at, ends_at, role
- **attendance_staff**: staff_id, clock_in, clock_out
- **leave_requests**: staff_id, from, to, type, status, decided_by
- **payroll**: staff_id, month, base, classes_count, class_pay, pt_commission, advances, total, paid_at
- **ratings**: member_id, session_id or pt_session_id, staff_id, score, comment
- **automations**: key, enabled, timing, template_name_en, template_name_ar
- **messages**: member_id, direction, template_name, body, status, sent_at, automation_key
- **audit_log**: who, what, before/after, when (all money and membership-date changes)

---

## 7. Tech stack

Same as Mario's other projects (EV-workshop CRM, Studiio OS):
- **Next.js 15** (App Router) + **TypeScript** + **Tailwind CSS 4** + **lucide-react**. One app: website at `/`, CRM at `/admin`.
- All data reads go through **`src/lib/data.ts`**; sample data lives in **`src/lib/sample-data.ts`** so the database can replace it without touching pages.
- English/Arabic text in simple dictionary files (`src/i18n/en.ts`, `src/i18n/ar.ts`), Arabic pages right-to-left.
- **Supabase** (step 4): Postgres, logins for staff, storage for photos, row-level security per role.
- **Vercel** for hosting and preview links.
- **WhatsApp Cloud API** (Meta) for all WhatsApp messages (step 5).
- **Scheduled jobs** (reminders, 08:00 summary): n8n or Supabase scheduled functions, decided at step 5.
- **Claude (Anthropic API)** for the owner's assistant, with tools that read and change CRM data; a speech-to-text service for voice notes. Model chosen at step 5.
- Online card payments: later, provider to be chosen (options differ in Lebanon).

---

## 8. Build steps (one at a time: stop and show Mario after each)

0. **Brief & rules** ✅ This file, `CLAUDE.md`, `PROGRESS.md`, `KICKOFF.md`, repo branches.
0b. **Design canvas** ✅ approved by Mario on 19 Nov 2026: website Home, Timetable + booking (clickable), Memberships, Home on phone, Arabic booking on phone; CRM Today, Member page, Money, Team performance, Today on phone; WhatsApp owner's assistant and member reminders. Saved as an artifact and in `/design`.
1. **Website, clickable, sample data**: every page in section 4, EN + AR, booking flow with a fake confirmation (shows the WhatsApp message it would send).
2. **CRM, clickable, sample data**: all 8 sections with realistic sample data (≈ 250 members, 6 coaches, 3 months of payments and attendance).
3. **WhatsApp demo**: scripted owner assistant (`/admin/assistant`), Automations screen with EN/AR previews, member-side message previews, `/guide` demo page.
3b. **Preview link** on Vercel → the demo is ready to pitch.
4. **Database & logins**: Supabase tables, staff logins with roles, website bookings saved for real, "Needs you" generated by rules (section 9).
5. **Real WhatsApp**: templates (EN + AR) reviewed by Mario then submitted to Meta, automations on a schedule, owner assistant powered by Claude, 08:00 summary.
6. **Extras** (when a real gym signs): QR check-in, online payments, installable member app (PWA), body-scan import, several branches.

---

## 9. "Needs you" rules (CRM Today)

- Payments overdue (oldest first) and payments due in the next 3 days
- Memberships expiring in the next 7 days with no renewal
- New leads not contacted within 24 hours; trials done yesterday with no follow-up
- Classes in the next 24 hours under 30% full, or full with a waitlist
- PT packages with ≤ 2 sessions left
- Members who haven't come in 14+ days (top 10 by value)
- Staff: leave requests waiting, shifts with nobody assigned, coach absent with a class today
- No exchange rate set for today

(Thresholds editable in Settings.)

---

## 10. Defaults chosen (19 Nov 2026)

Demo brand (VOLT Fitness Club, Beirut) · website + WhatsApp in English and Arabic, CRM in English · USD with LBP recording · memberships + group classes + personal training · website bold and dark, CRM calm and clean. Mario can change any of these.

---

## 11. Open questions (for a real gym client)

- Real name, logo, photos, address, hours, WhatsApp Business number
- Plans and prices; class packs; student/couple/corporate deals; joining fee?
- Class types, rooms and capacities; cancellation rule (how late can members cancel?)
- How coaches and trainers are paid (monthly, per class, PT commission %)
- Payment methods they accept; how they handle LBP
- Freeze rules (how many days per year, fee?)
- Do they sell supplements or drinks (needs a small shop/stock module)?
- Who can give discounts besides the owner
- Arabic: simple standard Arabic or Lebanese dialect for WhatsApp messages?
- Do they already use a system or Excel we need to import members from?
