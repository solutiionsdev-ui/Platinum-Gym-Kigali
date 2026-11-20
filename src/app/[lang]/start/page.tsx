import type { Metadata } from "next";
import { StartQuiz } from "@/components/site/start-quiz";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Start here" };

export default function StartPage() {
  return (
    <Container className="pb-24 pt-10 sm:pt-14">
      <div className="max-w-[960px]">
        <p className="text-[13px] font-semibold uppercase tracking-[0.16em] text-muted">Start here · 3 questions · 30 seconds</p>
        <h1 className="mt-2 font-display display-page uppercase">Find your program</h1>
        <p className="mt-3 max-w-[620px] text-lg text-ink-2">
          Not sure where to begin? Answer 3 quick questions and we show you the right program, your first class and the best package for you.
        </p>
        <div className="mt-10">
          <StartQuiz />
        </div>
      </div>
    </Container>
  );
}
