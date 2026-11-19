# CLAUDE.md: rules for every session on the Gym System

## Read first
- Read `BRIEF.md` at the start of every session. It is the source of truth for scope, design and business rules.
- Read `PROGRESS.md` to see what's done and what's next.
- Approved reference screens go in `/design` once step 0b is done.

## Who you're working with
- Mario (solutiions.dev) is **not a developer**. Explain in plain words, step by step. No jargon without a one-line explanation.
- Michel also works on this repo, on his own branch (see Git below).
- When Mario needs to do something (create an account, paste a key, click a button), give numbered steps.
- Be direct and honest. If something he asks for is a bad idea, say so and say why.

## How to work
- Build **one step at a time** (BRIEF section 8). At the end of each step: start the dev server, give Mario the localhost link, list what to click to test, and stop.
- Update `PROGRESS.md` at the end of each session: what was done, what's next, open questions.
- Before saying anything is done: run `npm run typecheck`, `npm run lint` and `npm run build`, and fix errors.
- Check every screen at phone width (390px) as well as desktop, and every website page in Arabic (right-to-left) as well as English.

## Design
- Follow BRIEF section 2: website bold and dark, CRM calm and clean. Once the design canvas (step 0b) is approved, match it exactly.
- Put tokens in one place (Tailwind theme / CSS variables). Brand name, logo, accent color and contact details come only from `src/lib/brand.ts`, so the demo can be rebranded per gym.
- Use lucide-react icons. No emoji in the UI.
- In the CRM, status colors are for status only. Everything else stays black / grey / white.

## Data & safety
- All data reads go through `src/lib/data.ts`. Sample data must be clearly sample and live in `src/lib/sample-data.ts` so Supabase can replace it later.
- Never commit secrets. Keys go in `.env.local` (git-ignored); keep `.env.example` updated with names only.
- In development, WhatsApp messages go **only to test numbers**. Never message real members from dev.
- Money changes (payments, discounts, refunds, price edits, freezes/extensions) always require confirmation and must write to `audit_log`.
- The assistant never guesses which member: one exact match → act and confirm back; otherwise ask. Messages to more than one member need a "yes" after showing the count and the text.

## Git
- Branches: `main` (approved, stable), `mario-branch` (Mario's work), `michel-branch` (Michel's work).
- Work on the branch of whoever you're working with: `mario-branch` for Mario. Never commit straight to `main`.
- Before starting, check which branch you're on and pull the latest.
- Merge into `main` only when Mario asks.
- Small, clear commits after each working piece.
- Don't push or open pull requests unless Mario asks.
