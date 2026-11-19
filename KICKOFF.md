# Prompts to paste into Claude Code

Paste one at a time. Wait until each step is finished and you've tested it before moving on. Work on `mario-branch`.

---

## Step 0b: Design canvas

```
Read CLAUDE.md, BRIEF.md and PROGRESS.md. Do step 0b from BRIEF section 8: design the key screens (website Home, Timetable + booking, Memberships; CRM Today, Member page, Money; the WhatsApp assistant chat) on one design canvas for me to approve. Show me desktop and phone versions. Don't build the app yet.
```

## Step 1: Website, clickable, sample data

```
Read PROGRESS.md. Set up a Next.js 15 + TypeScript + Tailwind 4 project in this folder (keep BRIEF.md, CLAUDE.md, KICKOFF.md, PROGRESS.md, README.md and /design as they are). Build step 1 from BRIEF section 8, matching the approved design. Then start the dev server, give me the localhost link and a short list of what to click.
```

## Step 2: CRM, clickable, sample data

```
Read PROGRESS.md. Build step 2 from BRIEF section 8: the CRM at /admin with realistic sample data, matching the approved design.
```

## Step 3: WhatsApp demo

```
Read PROGRESS.md. Build step 3 from BRIEF section 8: the scripted owner assistant, the Automations screen with English and Arabic previews, and the /guide demo page.
```

## Step 3b: Preview link

```
Deploy the current version to Vercel as a preview so I can show it to gyms. Walk me through any account steps one by one.
```

## Step 4: Database & logins

```
Read PROGRESS.md. Start step 4 from BRIEF section 8: connect Supabase, create the tables from BRIEF section 6, staff logins with roles, real bookings from the website. Walk me through creating the Supabase project step by step first.
```

## Step 5: Real WhatsApp

```
Read PROGRESS.md. Start step 5 from BRIEF section 8. First list every automatic message as a WhatsApp template in English and Arabic so I can review them before we submit them to Meta. Follow the member-matching, money and broadcast rules exactly.
```
