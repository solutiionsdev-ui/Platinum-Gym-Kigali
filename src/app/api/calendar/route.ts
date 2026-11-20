import { brand } from "@/lib/brand";
import { icsCalendar, sessionEvent } from "@/lib/calendar";
import { getCoach, getSessions } from "@/lib/data";

/**
 * Calendar feed (.ics).
 * - /api/calendar                  every class, repeating weekly: subscribe in Google Calendar ("From URL")
 * - /api/calendar?coach=emmanuel   one coach's classes
 * - /api/calendar?session=<id>     one class, as a file to add (Apple Calendar, Outlook)
 */
export function GET(req: Request) {
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("session");
  const coachSlug = url.searchParams.get("coach");
  const headers = { "Content-Type": "text/calendar; charset=utf-8" };

  if (sessionId) {
    const s = getSessions().find((x) => x.id === sessionId);
    if (!s) return new Response("Class not found", { status: 404 });
    return new Response(icsCalendar(brand.name, [sessionEvent(s)]), {
      headers: { ...headers, "Content-Disposition": `attachment; filename="platinum-${s.id}.ics"` },
    });
  }

  const coach = coachSlug ? getCoach(coachSlug) : undefined;
  if (coachSlug && !coach) return new Response("Coach not found", { status: 404 });
  const list = getSessions().filter((s) => !coach || s.coach === coach.slug);
  const name = coach ? `${brand.name} · ${coach.first.en}'s classes` : `${brand.name} · Classes`;
  return new Response(icsCalendar(name, list.map((s) => ({ ...sessionEvent(s), weekly: true }))), {
    headers: { ...headers, "Content-Disposition": 'inline; filename="platinum-classes.ics"', "Cache-Control": "public, max-age=3600" },
  });
}
