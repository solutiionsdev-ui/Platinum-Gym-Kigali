/**
 * Training programs: men's, women's and the signature Akantu program.
 * Written in plain words for people new to gyms. SAMPLE content for the demo: Gael's team adjusts it.
 */
import type { PhotoKey } from "./photos";

export type Audience = "men" | "women" | "everyone";
export type Goal = "lose" | "muscle" | "tone" | "fit";

export type Program = {
  slug: string;
  audience: Audience;
  name: string;
  /** The promise, in one short sentence. */
  goal: string;
  weeks: number;
  daysPerWeek: number;
  level: "New to the gym" | "Some experience" | "Every level";
  minutes: number;
  forWho: string;
  whatYouDo: string[];
  /** A normal week, Monday to Sunday. "" = rest day. */
  week: string[];
  /** What changes, step by step. */
  stages: { when: string; what: string }[];
  coach: string;
  image: PhotoKey;
  goals: Goal[];
  /** A myth this program answers, for people who were told the wrong thing. */
  myth?: { q: string; a: string };
};

export const programs: Program[] = [
  {
    slug: "akantu",
    audience: "everyone",
    name: "Akantu",
    goal: "Our signature program: get fit, lose fat and move better, all in one.",
    weeks: 6, daysPerWeek: 3, level: "Every level", minutes: 90,
    forWho: "Anyone who wants one clear plan that works on everything. Gael created it.",
    whatYouDo: [
      "Three 90-minute Akantu classes a week (Mon, Wed, Fri at 6:00)",
      "Each class: stretch, build stamina, train balance, then burn fat",
      "The coach shows a lighter version of every move if you are new",
    ],
    week: ["Akantu class", "", "Akantu class", "Walk 30 minutes", "Akantu class", "Bootcamp (optional)", ""],
    stages: [
      { when: "Weeks 1–2", what: "Learn the moves. You will be tired, that is normal." },
      { when: "Weeks 3–4", what: "You finish the class with energy left. Clothes start to fit better." },
      { when: "Weeks 5–6", what: "Faster, stronger, less belly. We measure your progress on the body scan." },
    ],
    coach: "gael", image: "floorDark", goals: ["fit", "lose"],
  },
  {
    slug: "build-muscle",
    audience: "men",
    name: "Build Muscle",
    goal: "Bigger, stronger chest, arms and legs.",
    weeks: 8, daysPerWeek: 4, level: "Some experience", minutes: 60,
    forWho: "Men who already train a little and want to grow.",
    whatYouDo: [
      "Lift weights 4 days a week, one body part each day",
      "Add a little more weight every week, with a coach checking your form",
      "Eat more protein: eggs, beans, fish, chicken (we give you a simple local food list)",
    ],
    week: ["Chest & arms", "Legs", "", "Back & shoulders", "Full body", "Bootcamp (optional)", ""],
    stages: [
      { when: "Weeks 1–2", what: "Learn each exercise properly with light weights." },
      { when: "Weeks 3–5", what: "Heavier weights. You feel stronger every week." },
      { when: "Weeks 6–8", what: "Muscles look bigger. We check your progress with the body scan." },
    ],
    coach: "emmanuel", image: "liftingMan", goals: ["muscle", "tone"],
  },
  {
    slug: "lose-the-belly",
    audience: "men",
    name: "Lose the Belly",
    goal: "A flatter belly and more energy in 6 weeks.",
    weeks: 6, daysPerWeek: 4, level: "Every level", minutes: 60,
    forWho: "Men who want to lose weight around the middle.",
    whatYouDo: [
      "2 Abs & Core classes and 2 cardio sessions a week",
      "Fewer sugary drinks and less late-night eating (simple changes, no strict diet)",
      "Walk at least 30 minutes on rest days",
    ],
    week: ["Cardio 40 min", "Abs & Core class", "", "Cardio 40 min", "Abs & Core class", "Bootcamp", "Walk"],
    stages: [
      { when: "Weeks 1–2", what: "Belt feels looser, you sleep better." },
      { when: "Weeks 3–4", what: "Weight goes down steadily, about half a kilo a week." },
      { when: "Weeks 5–6", what: "Visible change in the mirror and in the body scan." },
    ],
    coach: "mido", image: "cardioClimber", goals: ["lose", "fit"],
  },
  {
    slug: "strong-start-men",
    audience: "men",
    name: "Strong Start",
    goal: "Your first month in a gym, without stress or injury.",
    weeks: 4, daysPerWeek: 3, level: "New to the gym", minutes: 45,
    forWho: "Men who have never trained, or stopped for a long time.",
    whatYouDo: [
      "3 short sessions a week on the machines, which are safer to learn on",
      "A coach shows you every machine on day 1",
      "One Mobility class a week so you are not stiff",
    ],
    week: ["Machines, full body", "", "Mobility class", "Machines, full body", "", "Machines, full body", ""],
    stages: [
      { when: "Week 1", what: "Learn the machines and how much weight to use." },
      { when: "Weeks 2–3", what: "Same exercises, a bit heavier. You start to feel strong." },
      { when: "Week 4", what: "Ready to move on to Build Muscle or Lose the Belly." },
    ],
    coach: "emmanuel", image: "machineRow", goals: ["muscle", "fit", "lose", "tone"],
  },
  {
    slug: "tone-and-shape",
    audience: "women",
    name: "Tone & Shape",
    goal: "Firm legs, glutes and arms, without getting bulky.",
    weeks: 8, daysPerWeek: 4, level: "Every level", minutes: 60,
    forWho: "Women who want a firmer, stronger body.",
    whatYouDo: [
      "Light weights for legs, glutes and arms, 3 days a week",
      "One Step Aerobics or Aerobics class for the heart",
      "A coach shows you the right weight to start with",
    ],
    week: ["Legs & glutes", "Aerobics class", "", "Arms & back", "Legs & glutes", "Step Aerobics", ""],
    stages: [
      { when: "Weeks 1–2", what: "Learn the moves with light weights." },
      { when: "Weeks 3–5", what: "Legs and arms feel firmer, posture improves." },
      { when: "Weeks 6–8", what: "Clear shape change. We check it on the body scan." },
    ],
    coach: "mido", image: "stretching", goals: ["tone", "muscle"],
    myth: { q: "Will weights make me bulky?", a: "No. It is very hard for women to build big muscles. Weights make you firm and help you burn more calories, even at rest." },
  },
  {
    slug: "lose-weight-safely",
    audience: "women",
    name: "Lose Weight Safely",
    goal: "Lose weight steadily, keep your energy, no crash diet.",
    weeks: 6, daysPerWeek: 4, level: "Every level", minutes: 45,
    forWho: "Women who want to lose weight and keep it off.",
    whatYouDo: [
      "2 Aerobics classes and 1 Step Aerobics class a week, with music",
      "1 light weights session to keep your body firm while you lose weight",
      "Simple food changes: water instead of soda, more vegetables, smaller dinners",
    ],
    week: ["Aerobics class", "", "Light weights", "Aerobics class", "", "Step Aerobics", "Walk"],
    stages: [
      { when: "Weeks 1–2", what: "More energy, better sleep." },
      { when: "Weeks 3–4", what: "About half a kilo a week, without feeling hungry all the time." },
      { when: "Weeks 5–6", what: "Clothes fit differently. We check it on the body scan." },
    ],
    coach: "donyori", image: "cardioWalk", goals: ["lose", "fit"],
    myth: { q: "Do I have to stop eating to lose weight?", a: "No. Skipping meals makes you tired and hungry. Eat regular meals, just smaller portions and less sugar." },
  },
  {
    slug: "strong-and-confident",
    audience: "women",
    name: "Strong & Confident",
    goal: "Your first month in a gym, step by step, at your pace.",
    weeks: 4, daysPerWeek: 3, level: "New to the gym", minutes: 45,
    forWho: "Women who are new to the gym or feel shy to start.",
    whatYouDo: [
      "A coach welcomes you and shows you everything on day 1",
      "3 short sessions a week: one Mobility class, two easy machine workouts",
      "Train at quieter times if you prefer: the gym is open 24 hours",
    ],
    week: ["Easy machines", "", "Mobility class", "", "Easy machines", "", ""],
    stages: [
      { when: "Week 1", what: "Meet your coach and learn the basics." },
      { when: "Weeks 2–3", what: "You know your way around and feel at home." },
      { when: "Week 4", what: "Ready for Tone & Shape or Lose Weight Safely." },
    ],
    coach: "tutor", image: "studioMural", goals: ["tone", "lose", "fit", "muscle"],
  },
];

export const getPrograms = () => programs;
export const getProgram = (slug: string) => programs.find((p) => p.slug === slug);
export const programsFor = (a: Audience) => programs.filter((p) => p.audience === a);

/** The "Start here" quiz result. */
export function recommend(goal: Goal, who: "man" | "woman", level: "new" | "some" | "often"): Program {
  const audience: Audience = who === "man" ? "men" : "women";
  if (level === "new") return getProgram(who === "man" ? "strong-start-men" : "strong-and-confident")!;
  if (goal === "fit") return getProgram("akantu")!;
  if (who === "man") return getProgram(goal === "lose" ? "lose-the-belly" : "build-muscle")!;
  return getProgram(goal === "lose" ? "lose-weight-safely" : "tone-and-shape")! ?? programsFor(audience)[0];
}

/** First class to try for each program. */
export const firstClass: Record<string, string> = {
  akantu: "akantu",
  "build-muscle": "traditional",
  "lose-the-belly": "abs",
  "strong-start-men": "mobility",
  "tone-and-shape": "steps",
  "lose-weight-safely": "aerobics",
  "strong-and-confident": "mobility",
};

/** Online coaching price (SAMPLE, Gael sets the real one). */
export const ONLINE_PRICE = 60000;
