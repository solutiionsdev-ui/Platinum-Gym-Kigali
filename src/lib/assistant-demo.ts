/**
 * The owner's WhatsApp assistant, scripted for the demo (step 3).
 * It recognises a set of questions and commands in English, plus a few Kinyarwanda words (yego, oya, shyira, muri)
 * and answers from the sample data, so the numbers match the rest of the CRM.
 * The real assistant (step 5) runs on Claude with tools that read and change the database.
 *
 * Rules it follows (BRIEF section 3C):
 * - Member matching: one exact match → act and confirm back; none or several → ask. Never guess.
 * - Money: payments, discounts and refunds need a "yes" first, and are logged.
 * - Broadcast: a message to more than one member shows the count and the text first, and needs a "yes".
 */
import {
  fmtDate, getCoachStats, getExpiringSoon, getLeads, getMembers, getMoney, getNotSeen, getOverdue, getPtToday, getTodayClasses,
  PLAN_LABELS, PLAN_PRICES, rwf, type CrmMember,
} from "./crm-data";
import { brand } from "./brand";
import { demoToday, getClassType, getCoach, getCoaches, getRoomName, getSessionsForDay, isFull, isPast, spotsLeft } from "./data";
import type { Session } from "./types";

export type ChatMessage =
  | { from: "me"; kind: "text"; text: string; time: string }
  | { from: "me"; kind: "voice"; seconds: number; transcript: string; time: string }
  | { from: "bot"; text: string; time: string; quote?: { to: string; text: string } };

/** What the assistant is waiting for an answer to. */
export type Pending =
  | null
  | { type: "send_reminders"; ids: string[] }
  | { type: "broadcast"; label: string; count: number }
  | { type: "pick_member"; candidates: string[]; classText: string }
  | { type: "pick_class"; memberId: string; options: { label: string; sessionId: string; waitlist: boolean }[] }
  | { type: "confirm_payment"; memberId: string; amount: number; method: string; what: string };

export type BotTurn = { replies: { text: string; quote?: { to: string; text: string } }[]; buttons: string[]; pending: Pending };

const CLASS_WORDS: Record<string, string[]> = {
  spin: ["spin", "spinning", "bike"],
  hiit: ["hiit"],
  strength: ["strength", "weights"],
  boxing: ["boxing", "box"],
  yoga: ["yoga"],
  pilates: ["pilates"],
};

const YES = /^(yes|yeah|yep|ok|okay|sure|send|go|do it|confirm|yego|ego)\b/i;
const NO = /^(no|not now|nope|cancel|stop|oya)\b/i;

const first = (name: string) => name.split(" ")[0];
const dayName = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function sessionLabel(s: Session) {
  const type = getClassType(s.type)!;
  const coach = getCoach(s.coach)!;
  return `${s.day === demoToday ? "today" : dayName[s.day]} ${s.time} ${type.name.en} with ${coach.first.en}`;
}

/** Members whose name matches what the owner typed. Exact full name wins. */
function matchMembers(text: string): CrmMember[] {
  const t = text.trim().toLowerCase();
  if (!t) return [];
  const members = getMembers();
  const exact = members.filter((m) => m.name.toLowerCase() === t);
  if (exact.length) return exact;
  const words = t.split(/\s+/).filter((w) => w.length > 1);
  return members.filter((m) => {
    const n = m.name.toLowerCase();
    return words.every((w) => n.split(" ").some((part) => part.startsWith(w)));
  });
}

function findClassType(text: string) {
  const t = text.toLowerCase();
  return Object.keys(CLASS_WORDS).find((k) => CLASS_WORDS[k].some((w) => t.includes(w)));
}

function findHour(text: string): number | null {
  const t = text.toLowerCase();
  // A number on its own ("7", "7pm", "19:00"), not a digit glued to a word.
  const m = t.match(/(?:^|\s)(\d{1,2})(?::(\d{2}))?\s*(pm|am)?(?=\s|$|[^a-z0-9])/);
  if (!m) return null;
  let h = Number(m[1]);
  if (h > 23) return null;
  const evening = m[3] && !/am/.test(m[3]);
  if (evening && h < 12) h += 12;
  if (!m[3] && h >= 5 && h <= 9 && /(tonight|uyu munsi|today)/.test(t)) h += 12;
  return h;
}

/** The member part of "book Sandrine Uwimana into tonight's spin". */
function nameFromBooking(text: string) {
  const cleaned = text
    .replace(/^(please\s+)?(book|put|add|shyira)\s+/i, "")
    .replace(/\s+(in|into|for|to|muri|mu)\s+.*$/i, "")
    .replace(/\s+(spin|hiit|strength|boxing|yoga|pilates)\b.*$/i, "");
  return cleaned.trim();
}

function bookingOptions(memberId: string, typeSlug: string, hour: number | null) {
  const today = getSessionsForDay(demoToday).filter((s) => !isPast(s) && s.type === typeSlug);
  const pool = today.length ? today : [1, 2, 3].flatMap((d) => getSessionsForDay(demoToday + d).filter((s) => s.type === typeSlug)).slice(0, 2);
  const wanted = hour !== null ? pool.find((s) => Number(s.time.split(":")[0]) === hour) : pool[0];
  return { wanted, pool, memberId };
}

function offerBooking(member: CrmMember, typeSlug: string, hour: number | null): BotTurn {
  const typeName = getClassType(typeSlug)!.name.en;
  const { wanted, pool } = bookingOptions(member.id, typeSlug, hour);
  const who = `${member.name}, ${member.phone.replace(/(\d{3}) (\d{3})$/, "•• $2")}`;
  if (!wanted) {
    return { replies: [{ text: `No ${typeName} left today or in the next days. Want me to look at another class?` }], buttons: [], pending: null };
  }
  if (!isFull(wanted)) {
    return confirmBooking(member, wanted);
  }
  const alternatives = pool.filter((s) => s.id !== wanted.id && !isFull(s));
  const options = [
    ...alternatives.slice(0, 1).map((s) => ({ label: `Book ${s.time}`, sessionId: s.id, waitlist: false })),
    { label: `Waitlist ${wanted.time}`, sessionId: wanted.id, waitlist: true },
  ];
  const alt = alternatives[0];
  return {
    replies: [
      {
        text:
          `*${who}*\n` +
          `${sessionLabel(wanted).replace(/^./, (c) => c.toUpperCase())} is full, ${wanted.waiting} on the waitlist.` +
          (alt ? ` ${alt.time} ${typeName} still has ${spotsLeft(alt)} spots.` : "") +
          " Which one?",
      },
    ],
    buttons: options.map((o) => o.label),
    pending: { type: "pick_class", memberId: member.id, options },
  };
}

function confirmBooking(member: CrmMember, s: Session, waitlist = false): BotTurn {
  const type = getClassType(s.type)!;
  const coach = getCoach(s.coach)!;
  const room = getRoomName(s.room, "en");
  if (waitlist) {
    return {
      replies: [
        {
          text: `Done. *${member.name}* is #${s.waiting + 1} on the waitlist for ${sessionLabel(s)}. If a spot opens, it goes to them automatically with a WhatsApp message.`,
          quote: { to: first(member.name), text: `Hi ${first(member.name)}, you're on the waitlist for ${type.name.en} with ${coach.first.en}, ${s.day === demoToday ? "today" : dayName[s.day]} at ${s.time}. You're number ${s.waiting + 1}. We'll message you here the moment a spot opens.` },
        },
      ],
      buttons: [],
      pending: null,
    };
  }
  const remind = `${String(Number(s.time.slice(0, 2)) - 2).padStart(2, "0")}${s.time.slice(2)}`;
  return {
    replies: [
      {
        text: `Done. *${member.name}* is booked into ${type.name.en} with ${coach.first.en}, ${s.day === demoToday ? "today" : dayName[s.day]} ${s.time}, ${room}. Confirmation sent, reminder at ${remind}.`,
        quote: { to: first(member.name), text: `Hi ${first(member.name)}, you're booked: ${type.name.en} with ${coach.first.en}, ${s.day === demoToday ? "today" : dayName[s.day]} at ${s.time}, ${room}. Can't make it? Cancel here: ${brand.shortLink}/m/7KQ2` },
      },
    ],
    buttons: [],
    pending: null,
  };
}

function bookFlow(text: string): BotTurn | null {
  const typeSlug = findClassType(text);
  const isBooking = /^(please\s+)?(book|put|add|shyira)\b/i.test(text.trim());
  if (!isBooking) return null;
  const name = nameFromBooking(text);
  if (!typeSlug) {
    return { replies: [{ text: `Which class should I book ${name || "them"} into? For example "book ${name || "Sandrine"} into tonight's spin".` }], buttons: [], pending: null };
  }
  const matches = matchMembers(name);
  if (matches.length === 0) {
    return { replies: [{ text: `I can't find a member called "${name}". Check the spelling, or send me their phone number.` }], buttons: [], pending: null };
  }
  if (matches.length > 1) {
    const shown = matches.slice(0, 4);
    return {
      replies: [
        {
          text:
            `I found ${matches.length} members called "${name}". Which one?\n` +
            shown.map((m) => `• ${m.name} · ${m.phone.replace(/(\d{3}) (\d{3})$/, "•• $2")}`).join("\n") +
            (matches.length > 4 ? `\n…and ${matches.length - 4} more. Send the full name.` : ""),
        },
      ],
      buttons: shown.map((m) => m.name),
      pending: { type: "pick_member", candidates: shown.map((m) => m.id), classText: text },
    };
  }
  return offerBooking(matches[0], typeSlug, findHour(text));
}

function paymentFlow(text: string): BotTurn | null {
  const m = text.match(/^(.+?)\s+(paid|payed|yishyuye)\s+(\d[\d,]*)\s*(k)?\s*(?:rwf|frw)?(?:\s*(?:by|with|on|via)?\s*(cash|card|momo|mtn momo|mtn|airtel money|airtel|transfer))?/i);
  if (!m) return null;
  const matches = matchMembers(m[1]);
  const amount = Number(m[3].replace(/,/g, "")) * (m[4] ? 1000 : 1);
  const METHODS: Record<string, string> = { cash: "Cash", card: "Card", momo: "MTN MoMo", "mtn momo": "MTN MoMo", mtn: "MTN MoMo", "airtel money": "Airtel Money", airtel: "Airtel Money", transfer: "Bank transfer" };
  const method = m[5] ? METHODS[m[5].toLowerCase()] ?? m[5] : "Cash";
  if (matches.length !== 1) {
    return {
      replies: [{ text: matches.length === 0 ? `I can't find a member called "${m[1]}".` : `${matches.length} members match "${m[1]}". Send the full name so I record it on the right person.` }],
      buttons: [],
      pending: null,
    };
  }
  const member = matches[0];
  const what = member.owes > 0 ? member.owesFor ?? "balance" : PLAN_LABELS[member.planId];
  return {
    replies: [
      {
        text:
          `Record *${rwf(amount)} ${method}* from *${member.name}* for ${what}?` +
          (member.owes > 0 && amount !== member.owes ? `\nHeads up: they owe ${rwf(member.owes)}, so ${rwf(Math.max(member.owes - amount, 0))} would stay open.` : "") +
          "\nMoney changes need your yes, and they're logged with who and when.",
      },
    ],
    buttons: ["Yes, record it", "No"],
    pending: { type: "confirm_payment", memberId: member.id, amount, method, what },
  };
}

function cancelClassFlow(text: string): BotTurn | null {
  if (!/^(cancel|ulghi)/i.test(text.trim())) return null;
  const typeSlug = findClassType(text);
  const hour = findHour(text);
  const s = getSessionsForDay(demoToday).find((x) => !isPast(x) && (!typeSlug || x.type === typeSlug) && (hour === null || Number(x.time.split(":")[0]) === hour));
  if (!s) return { replies: [{ text: "Which class? For example \"cancel tonight's 20:30 yoga\"." }], buttons: [], pending: null };
  const type = getClassType(s.type)!;
  const msg = `Sorry, ${type.name.en} with ${getCoach(s.coach)!.first.en} today at ${s.time} is cancelled. Pick another class here: ${brand.shortLink}/m/…`;
  return {
    replies: [{ text: `Cancel ${sessionLabel(s)}? *${s.booked} members* are booked and each gets this message:`, quote: { to: `${s.booked} members`, text: msg } }],
    buttons: [`Yes, cancel and tell ${s.booked}`, "No"],
    pending: { type: "broadcast", label: `${s.time} ${type.name.en} cancelled. ${s.booked} members told, and the class is off the website.`, count: s.booked },
  };
}

/** Morning summary, also sent automatically at 08:00. */
export function dailySummary() {
  const classes = getTodayClasses();
  const full = classes.filter((c) => c.booked >= c.cap);
  const overdue = getOverdue();
  const expiring = getExpiringSoon();
  const leads = getLeads().filter((l) => l.stage === "new");
  return (
    `*Good morning ${brand.owner.first}. Today, Tue 24 Nov:*\n` +
    `• ${classes.length} classes${full.length ? `, ${full.map((c) => `${c.time} ${c.name}`).join(" and ")} full` : ""}\n` +
    `• ${getPtToday().length} PT sessions\n` +
    `• ${overdue.length} payments overdue, ${rwf(overdue.reduce((s, m) => s + m.owes, 0))}\n` +
    `• ${expiring.length} memberships end this week\n` +
    `• ${leads.length} new trial requests from the website\n` +
    `• On shift: Clarisse at the desk, Jean-Paul on the floor`
  );
}

export const STARTERS = [
  "Who hasn't paid this month?",
  "How full is tonight?",
  "Book Sandrine Uwimana into tonight's 7pm spin",
  "Who hasn't come in 2 weeks?",
  "Fabrice Murenzi paid 60,000 MoMo",
  "How is Eric doing this month?",
  "Collected this month?",
  "Cancel tonight's 20:30 yoga",
  "Book Kevin into spin",
];

export const VOICE_NOTE = { seconds: 5, transcript: "Shyira Sandrine Uwimana muri spin ya 7pm uyu munsi", meaning: "Put Sandrine Uwimana in today's 7pm spin (Kinyarwanda and English)" };

/** Works out the assistant's answer to one owner message. */
export function respond(input: string, pending: Pending): BotTurn {
  const text = input.trim();
  const t = text.toLowerCase();

  // Answers to a question the assistant asked.
  if (pending) {
    if (pending.type === "pick_member") {
      const chosen = getMembers().find((m) => pending.candidates.includes(m.id) && m.name.toLowerCase() === t);
      if (chosen) {
        const typeSlug = findClassType(pending.classText) ?? "spin";
        return offerBooking(chosen, typeSlug, findHour(pending.classText));
      }
    }
    if (pending.type === "pick_class") {
      const opt = pending.options.find((o) => o.label.toLowerCase() === t || t.includes(o.label.split(" ")[1]));
      const member = getMembers().find((m) => m.id === pending.memberId)!;
      if (opt) {
        const s = getSessionsForDay(demoToday).concat([1, 2, 3].flatMap((d) => getSessionsForDay(demoToday + d))).find((x) => x.id === opt.sessionId)!;
        return confirmBooking(member, s, opt.waitlist);
      }
    }
    if (YES.test(t)) {
      if (pending.type === "send_reminders") {
        return { replies: [{ text: `Sent to all ${pending.ids.length}. I'll tell you as soon as each one pays.` }], buttons: [], pending: null };
      }
      if (pending.type === "broadcast") {
        return { replies: [{ text: `Done. ${pending.label}` }], buttons: [], pending: null };
      }
      if (pending.type === "confirm_payment") {
        const member = getMembers().find((m) => m.id === pending.memberId)!;
        return {
          replies: [
            {
              text: `Recorded: ${rwf(pending.amount)} ${pending.method} from ${member.name} for ${pending.what}. Logged as confirmed by ${brand.owner.first}, just now. Receipt sent on WhatsApp.`,
              quote: { to: first(member.name), text: `Thanks ${first(member.name)}! We received ${rwf(pending.amount)} for ${pending.what}. This is your receipt. See you at ${brand.short}.` },
            },
          ],
          buttons: [],
          pending: null,
        };
      }
    }
    if (NO.test(t)) {
      return { replies: [{ text: "OK, I won't do anything. Anything else?" }], buttons: [], pending: null };
    }
  }

  const flows = [bookFlow(text), paymentFlow(text), cancelClassFlow(text)];
  const flow = flows.find(Boolean);
  if (flow) return flow;

  // Who owes money
  if (/(paid|pay|owe|overdue|money owed)/.test(t) && !/collect/.test(t)) {
    const overdue = getOverdue();
    const total = overdue.reduce((s, m) => s + m.owes, 0);
    const due = getMoney().dueSoon;
    return {
      replies: [
        {
          text:
            `*${overdue.length} members are overdue, ${rwf(total)} in total:*\n` +
            overdue.map((m) => `• ${m.name} · ${rwf(m.owes)} · ${m.daysLate} days (${m.owesFor})`).join("\n") +
            `\n\n${due.length} more payments are due in the next week (${rwf(due.reduce((s, d) => s + d.amount, 0))}).\nSend each overdue member a payment reminder?`,
        },
      ],
      buttons: ["Yes, send", "Not now"],
      pending: { type: "send_reminders", ids: overdue.map((m) => m.id) },
    };
  }

  // Tonight / classes
  if (/(tonight|how full|full|classes today|class today)/.test(t)) {
    const later = getTodayClasses().filter((c) => c.state !== "done");
    return {
      replies: [
        {
          text:
            `*Still to come today:*\n` +
            later.map((c) => `• ${c.time} ${c.name} with ${c.coachName}: ${c.booked}/${c.cap}${c.booked >= c.cap ? ` FULL, ${c.waiting} waiting` : ""}`).join("\n") +
            `\n\nWant me to offer the 19:00 Spin waitlist the 20:15 class?`,
        },
      ],
      buttons: ["Yes, offer 20:15", "Not now"],
      pending: { type: "broadcast", label: "The 5 people waiting for 19:00 Spin were offered 20:15. I'll book whoever says yes.", count: 5 },
    };
  }

  // Not seen
  if (/(haven'?t come|havent come|not seen|missing|disappeared|2 weeks|two weeks)/.test(t)) {
    const away = getNotSeen(14);
    const msg = `Hi {name}, it's been two weeks! Your spot is waiting. Here's this week's timetable: ${brand.shortLink}/classes`;
    return {
      replies: [
        {
          text:
            `*${away.length} active members haven't come in 2 weeks or more.* Longest away:\n` +
            [...away].sort((a, b) => a.lastVisit.localeCompare(b.lastVisit)).slice(0, 5).map((m) => `• ${m.name} · last visit ${fmtDate(m.lastVisit, false)}`).join("\n") +
            `\n\nSend all ${away.length} the "we miss you" message?`,
          quote: { to: `${away.length} members`, text: msg },
        },
      ],
      buttons: [`Yes, send to ${away.length}`, "Not now"],
      pending: { type: "broadcast", label: `"We miss you" sent to ${away.length} members. I'll tell you who books.`, count: away.length },
    };
  }

  // Expiring
  if (/(expir|ending|ends|renew)/.test(t)) {
    const exp = getExpiringSoon();
    return {
      replies: [
        {
          text:
            `*${exp.length} memberships end in the next 7 days:*\n` +
            exp.slice(0, 6).map((m) => `• ${m.name} · ${PLAN_LABELS[m.planId]} · ends ${fmtDate(m.end, false)}`).join("\n") +
            (exp.length > 6 ? `\n…and ${exp.length - 6} more.` : "") +
            `\n\nSend them all the renewal reminder?`,
          quote: { to: `${exp.length} members`, text: "Hi {name}, your membership ends on {date}. Renew now and keep your spot in your favourite classes. Reply RENEW." },
        },
      ],
      buttons: [`Yes, send to ${exp.length}`, "Not now"],
      pending: { type: "broadcast", label: `Renewal reminder sent to ${exp.length} members.`, count: exp.length },
    };
  }

  // Money collected
  if (/(collect|revenue|income|profit|money)/.test(t)) {
    const money = getMoney();
    return {
      replies: [
        {
          text:
            `*November so far:* ${rwf(money.in)} in, ${rwf(money.out)} out, *${rwf(money.in - money.out)} profit*.\n` +
            `Today: ${rwf(money.collectedToday)} collected (8 payments).\n` +
            `Biggest income: memberships ${rwf(money.sources[0].amount)}, personal training ${rwf(money.sources[1].amount)}.`,
        },
      ],
      buttons: ["Who hasn't paid this month?"],
      pending: null,
    };
  }

  // Coach performance
  const coach = getCoaches().find((c) => t.includes(c.first.en.toLowerCase()) && /(how|doing|performance|stats|month)/.test(t));
  if (coach) {
    const s = getCoachStats().find((x) => x.slug === coach.slug)!;
    const all = getCoachStats();
    const rank = [...all].sort((a, b) => b.fill - a.fill).findIndex((x) => x.slug === coach.slug) + 1;
    return {
      replies: [
        {
          text:
            `*${coach.name.en}, November so far:*\n` +
            `• ${s.classes} classes, ${s.fill}% full (#${rank} of ${all.length} coaches)\n` +
            `• No-shows ${s.noshow}% · regulars kept ${s.kept}%\n` +
            (s.pt ? `• ${s.pt} PT sessions, ${s.sold} packages sold\n` : "") +
            `• Rating ${s.rating.toFixed(1)} from members`,
        },
      ],
      buttons: [],
      pending: null,
    };
  }

  // Leads and trials
  if (/(trial|lead|new people)/.test(t)) {
    const leads = getLeads();
    const fresh = leads.filter((l) => l.stage === "new");
    return {
      replies: [
        {
          text:
            `*This week: 11 trials, 6 joined.*\n` +
            `New requests not contacted yet:\n` +
            fresh.map((l) => `• ${l.name} · ${l.interest} · ${l.when}`).join("\n") +
            `\n\nSend them the hello message with a link to book a free class?`,
        },
      ],
      buttons: ["Yes, send", "Not now"],
      pending: { type: "broadcast", label: `Hello message sent to ${fresh.length} new leads.`, count: fresh.length },
    };
  }

  // Summary
  if (/(summary|today|morning)/.test(t)) {
    return { replies: [{ text: dailySummary() }], buttons: [], pending: null };
  }

  // Personal reminder
  if (/remind me/.test(t)) {
    const what = text.replace(/.*remind me\s*/i, "");
    return { replies: [{ text: `OK, I'll remind you ${what || "then"}.` }], buttons: [], pending: null };
  }

  // Prices
  if (/(price|how much)/.test(t)) {
    return { replies: [{ text: `Monthly ${rwf(PLAN_PRICES.monthly)} · 3 months ${rwf(PLAN_PRICES["3m"])} · 6 months ${rwf(PLAN_PRICES["6m"])} · 12 months ${rwf(PLAN_PRICES["12m"])} · 10-class pack ${rwf(PLAN_PRICES.pack10)}.` }], buttons: [], pending: null };
  }

  return {
    replies: [
      {
        text:
          "In this demo I understand questions like:\n• Who hasn't paid this month?\n• How full is tonight?\n• Book Sandrine Uwimana into tonight's spin\n• Fabrice Murenzi paid 60,000 MoMo\n• Who hasn't come in 2 weeks?\n• How is Eric doing?\n\nThe real assistant (step 5) understands anything you write or say.",
      },
    ],
    buttons: [],
    pending: null,
  };
}
