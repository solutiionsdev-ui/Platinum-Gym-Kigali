import Link from "next/link";
import { Container, btn } from "@/components/ui";

// Shown inside the site layout for unknown classes, trainers or member links.
export default function NotFound() {
  return (
    <Container className="flex min-h-[50vh] flex-col items-start justify-center gap-5 py-20">
      <h1 className="font-display display-page uppercase">404</h1>
      <p className="text-lg text-ink-2">This page doesn&apos;t exist. Try the timetable or the home page.</p>
      <div className="flex flex-wrap gap-3">
        <Link href="/en/classes" className={btn.accent}>Timetable</Link>
        <Link href="/en" className={btn.outline}>Home</Link>
      </div>
    </Container>
  );
}
