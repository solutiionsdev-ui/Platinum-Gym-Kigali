/**
 * SAMPLE DATA ONLY. Made-up gym, people and numbers for the demo.
 * Everything here is read through src/lib/data.ts, so the database (step 4) can replace this file.
 * The demo day is Tuesday 24 November 2026, 16:40 (same as the CRM screens on the design canvas).
 */
import type { Text } from "./i18n";
import type {
  ClassType, Coach, CompareRow, DemoMember, Facility, Faq, Pass, Plan, PtPackage, RoomKey, Session,
} from "./types";

export const DEMO_TODAY = 1; // Tuesday
export const DEMO_NOW = "16:40";
export const WEEK_DATES = [23, 24, 25, 26, 27, 28, 29];

export const rooms: Record<RoomKey, Text> = {
  studio1: { en: "Studio 1", ar: "استوديو 1" },
  studio2: { en: "Studio 2", ar: "استوديو 2" },
  floor: { en: "Gym floor", ar: "صالة الأوزان" },
  turf: { en: "Turf", ar: "منطقة العشب" },
};

export const classTypes: ClassType[] = [
  {
    slug: "spin", name: { en: "Spin", ar: "سبين" }, mins: 45, level: 3, perWeek: 9, coaches: ["karim"],
    text: { en: "Indoor cycling to loud music. Ride at your own resistance.", ar: "دراجات ثابتة على إيقاع موسيقى عالية. كلٌّ يتحكّم بالمقاومة على مستواه." },
    photo: { en: "Spin studio, lights down", ar: "استوديو السبين بإضاءة خافتة" },
  },
  {
    slug: "hiit", name: { en: "HIIT", ar: "HIIT" }, mins: 40, level: 3, perWeek: 8, coaches: ["lea"],
    text: { en: "Short bursts, short rests. Done in 40 minutes, felt for two days.", ar: "جهد قصير وراحة قصيرة. تنتهي في 40 دقيقة وتشعرون بها ليومين." },
    photo: { en: "HIIT circuit on the turf", ar: "دائرة تمارين HIIT على العشب" },
  },
  {
    slug: "strength", name: { en: "Strength", ar: "قوة" }, mins: 55, level: 2, perWeek: 7, coaches: ["joe"],
    text: { en: "Coached lifting in small groups: squat, press, deadlift, done right.", ar: "رفع أثقال بإشراف مدرّب في مجموعات صغيرة: قرفصاء، ضغط ورفعة مميتة بالشكل الصحيح." },
    photo: { en: "Barbell class at the racks", ar: "حصة البار عند الأقفاص" },
  },
  {
    slug: "boxing", name: { en: "Boxing", ar: "ملاكمة" }, mins: 50, level: 2, perWeek: 5, coaches: ["lea"],
    text: { en: "Technique, pads and bag rounds. Gloves available at the desk.", ar: "تقنية، تمارين على الوسائد وجولات على الكيس. القفازات متوفرة في الاستقبال." },
    photo: { en: "Pads and gloves session", ar: "حصة قفازات ووسائد" },
  },
  {
    slug: "yoga", name: { en: "Yoga", ar: "يوغا" }, mins: 60, level: 1, perWeek: 6, coaches: ["maya"],
    text: { en: "Flow and stretch classes to balance the hard days.", ar: "حصص انسيابية وتمدّد لتوازن الأيام الصعبة." },
    photo: { en: "Yoga studio, morning light", ar: "استوديو اليوغا بضوء الصباح" },
  },
  {
    slug: "pilates", name: { en: "Pilates", ar: "بيلاتس" }, mins: 50, level: 1, perWeek: 5, coaches: ["maya"],
    text: { en: "Core, posture and control. Good for backs that sit all day.", ar: "تقوية الجذع والقوام والتحكّم. مفيدة لمن يجلس طوال النهار." },
    photo: { en: "Mat Pilates class", ar: "حصة بيلاتس على الحصيرة" },
  },
];

export const coaches: Coach[] = [
  {
    slug: "karim", name: { en: "Karim Saliba", ar: "كريم صليبا" }, first: { en: "Karim", ar: "كريم" },
    role: { en: "Spin & HIIT", ar: "سبين وHIIT" }, trainer: false,
    bio: { en: "Former track cyclist. These Spin classes fill up first, so book early.", ar: "درّاج سابق على المضمار. حصص السبين معه تمتلئ أولاً، فاحجزوا باكراً." },
    specialties: [{ en: "Indoor cycling", ar: "الدراجات الثابتة" }, { en: "Conditioning", ar: "اللياقة القلبية" }],
  },
  {
    slug: "maya", name: { en: "Maya Khoury", ar: "مايا خوري" }, first: { en: "Maya", ar: "مايا" },
    role: { en: "Yoga & Pilates", ar: "يوغا وبيلاتس" }, trainer: false,
    bio: { en: "Certified yoga and mat Pilates teacher. Calm classes that still make you work.", ar: "مدرّبة يوغا وبيلاتس معتمدة. حصص هادئة تتطلّب جهداً حقيقياً." },
    specialties: [{ en: "Vinyasa yoga", ar: "يوغا فينياسا" }, { en: "Mat Pilates", ar: "بيلاتس على الحصيرة" }],
  },
  {
    slug: "joe", name: { en: "Joe Nassar", ar: "جو نصار" }, first: { en: "Joe", ar: "جو" },
    role: { en: "Strength & powerlifting", ar: "القوة ورفع الأثقال" }, trainer: true,
    bio: { en: "Competitive powerlifter. Teaches the big lifts step by step, from your first squat.", ar: "رافع أثقال في المنافسات. يعلّم الحركات الأساسية خطوة بخطوة، من أول قرفصاء." },
    specialties: [{ en: "Barbell technique", ar: "تقنية البار" }, { en: "Powerlifting", ar: "رفع الأثقال" }],
  },
  {
    slug: "lea", name: { en: "Lea Frem", ar: "ليا فرم" }, first: { en: "Lea", ar: "ليا" },
    role: { en: "HIIT & Boxing", ar: "HIIT وملاكمة" }, trainer: false,
    bio: { en: "Amateur boxer. Fast, loud classes with clean technique.", ar: "ملاكمة هاوية. حصص سريعة وحماسية بتقنية نظيفة." },
    specialties: [{ en: "Boxing", ar: "الملاكمة" }, { en: "Circuit training", ar: "التمارين الدائرية" }],
  },
  {
    slug: "rami", name: { en: "Rami Aoun", ar: "رامي عون" }, first: { en: "Rami", ar: "رامي" },
    role: { en: "Personal trainer · strength", ar: "مدرّب شخصي · القوة" }, trainer: true,
    bio: { en: "Builds strength plans around busy schedules and old injuries. Tracks every session.", ar: "يبني خطط قوة تناسب الجداول المزدحمة والإصابات القديمة، ويتابع كل جلسة." },
    specialties: [{ en: "Strength", ar: "القوة" }, { en: "Body recomposition", ar: "تحسين تركيب الجسم" }, { en: "Coming back from injury", ar: "العودة بعد الإصابة" }],
  },
  {
    slug: "nour", name: { en: "Nour Fakhoury", ar: "نور فاخوري" }, first: { en: "Nour", ar: "نور" },
    role: { en: "Personal trainer · mobility", ar: "مدرّبة شخصية · الحركة والمرونة" }, trainer: true,
    bio: { en: "Mobility and posture work for desk-bound backs, runners and anyone who feels stiff.", ar: "تمارين الحركة والقوام لمن يجلس على المكتب، وللعدّائين، ولكل من يشعر بالتيبّس." },
    specialties: [{ en: "Mobility", ar: "الحركة والمرونة" }, { en: "Posture", ar: "القوام" }, { en: "Running", ar: "الجري" }],
  },
];

type Row = [time: string, type: string, coach: string, room: RoomKey, cap: number, booked: number, waiting?: number];
const weekRows: Row[][] = [
  [["06:30", "spin", "karim", "studio2", 20, 18], ["07:30", "strength", "joe", "floor", 12, 9], ["12:30", "hiit", "lea", "turf", 16, 7], ["17:30", "boxing", "lea", "studio1", 14, 11], ["19:00", "spin", "karim", "studio2", 20, 20, 3], ["20:30", "yoga", "maya", "studio1", 18, 9]],
  [["07:00", "pilates", "maya", "studio1", 14, 8], ["09:00", "spin", "karim", "studio2", 20, 15], ["12:30", "strength", "joe", "floor", 12, 12, 1], ["14:00", "yoga", "maya", "studio1", 18, 7], ["17:30", "hiit", "lea", "turf", 16, 10], ["18:30", "strength", "joe", "floor", 12, 9], ["19:00", "spin", "karim", "studio2", 20, 20, 5], ["20:15", "spin", "karim", "studio2", 20, 16], ["20:30", "yoga", "maya", "studio1", 18, 9]],
  [["06:30", "hiit", "lea", "turf", 16, 12], ["07:30", "yoga", "maya", "studio1", 18, 6], ["12:30", "spin", "karim", "studio2", 20, 11], ["18:00", "boxing", "lea", "studio1", 14, 14, 2], ["19:00", "strength", "joe", "floor", 12, 7], ["20:00", "pilates", "maya", "studio1", 14, 10]],
  [["07:00", "spin", "karim", "studio2", 20, 13], ["12:30", "hiit", "lea", "turf", 16, 9], ["17:30", "strength", "joe", "floor", 12, 10], ["18:30", "strength", "joe", "floor", 12, 12, 2], ["19:00", "spin", "karim", "studio2", 20, 19], ["20:30", "yoga", "maya", "studio1", 18, 12]],
  [["06:30", "strength", "joe", "floor", 12, 8], ["07:30", "pilates", "maya", "studio1", 14, 9], ["17:30", "hiit", "lea", "turf", 16, 16, 4], ["18:30", "boxing", "lea", "studio1", 14, 6], ["19:30", "spin", "karim", "studio2", 20, 12]],
  [["09:00", "pilates", "maya", "studio1", 14, 3], ["10:00", "spin", "karim", "studio2", 20, 17], ["11:00", "strength", "joe", "floor", 12, 11], ["12:00", "hiit", "lea", "turf", 16, 8]],
  [["10:00", "yoga", "maya", "studio1", 18, 14], ["11:00", "spin", "karim", "studio2", 20, 9], ["12:00", "boxing", "lea", "studio1", 14, 5]],
];

export const sessions: Session[] = weekRows.flatMap((rows, day) =>
  rows.map(([time, type, coach, room, cap, booked, waiting = 0]) => ({
    id: `${day}-${time.replace(":", "")}-${type}`,
    day, time, type, coach, room, cap, booked, waiting,
  })),
);

export const plans: Plan[] = [
  {
    id: "monthly", name: { en: "Monthly", ar: "شهري" }, price: 55, best: false,
    per: { en: "per month, stop any month", ar: "شهرياً، أوقفوه متى شئتم" },
    points: [{ en: "Gym floor and every class", ar: "صالة الأوزان وكل الحصص" }, { en: "Sauna and recovery area", ar: "الساونا ومنطقة الاستشفاء" }],
  },
  {
    id: "3m", name: { en: "3 months", ar: "3 أشهر" }, price: 150, best: false,
    per: { en: "$50 a month", ar: "50$ شهرياً" },
    points: [{ en: "Everything in Monthly", ar: "كل ما في الاشتراك الشهري" }, { en: "Up to 10 freeze days", ar: "تجميد حتى 10 أيام" }, { en: "Body scan every month", ar: "قياس تركيب الجسم كل شهر" }],
  },
  {
    id: "6m", name: { en: "6 months", ar: "6 أشهر" }, price: 280, best: false,
    per: { en: "$47 a month", ar: "47$ شهرياً" },
    points: [{ en: "Everything in 3 months", ar: "كل ما في اشتراك 3 أشهر" }, { en: "Up to 20 freeze days", ar: "تجميد حتى 20 يوماً" }, { en: "1 guest pass a month", ar: "دعوة ضيف واحدة شهرياً" }],
  },
  {
    id: "12m", name: { en: "12 months", ar: "12 شهراً" }, price: 500, best: true,
    per: { en: "$42 a month", ar: "42$ شهرياً" },
    points: [{ en: "Everything in 6 months", ar: "كل ما في اشتراك 6 أشهر" }, { en: "Up to 30 freeze days", ar: "تجميد حتى 30 يوماً" }, { en: "2 guest passes a month", ar: "دعوتا ضيف شهرياً" }],
  },
];

export const passes: Pass[] = [
  { name: { en: "Student monthly", ar: "اشتراك طالب شهري" }, note: { en: "Valid university ID, classes before 17:00", ar: "بطاقة جامعية سارية، الحصص قبل الساعة 17:00" }, price: 40 },
  { name: { en: "10-class pack", ar: "باقة 10 حصص" }, note: { en: "Any class, use within 2 months", ar: "أي حصة، خلال شهرين" }, price: 80 },
  { name: { en: "Day pass", ar: "دخول ليوم واحد" }, note: { en: "Gym floor and one class", ar: "صالة الأوزان وحصة واحدة" }, price: 10 },
];

const YES: Text = { en: "Yes", ar: "نعم" };
const NONE: Text = { en: "None", ar: "لا" };
const num = (n: string): Text => ({ en: n, ar: n });
export const compareRows: CompareRow[] = [
  { label: { en: "Gym floor, 6:00 – 23:00", ar: "صالة الأوزان، 6:00 – 23:00" }, values: [YES, YES, YES, YES] },
  { label: { en: "All group classes", ar: "كل الحصص الجماعية" }, values: [YES, YES, YES, YES] },
  { label: { en: "Sauna and recovery area", ar: "الساونا ومنطقة الاستشفاء" }, values: [YES, YES, YES, YES] },
  {
    label: { en: "Body-composition scan", ar: "قياس تركيب الجسم" },
    values: [{ en: "Every 3 months", ar: "كل 3 أشهر" }, { en: "Every month", ar: "كل شهر" }, { en: "Every month", ar: "كل شهر" }, { en: "Every month", ar: "كل شهر" }],
  },
  { label: { en: "Freeze days", ar: "أيام التجميد" }, values: [NONE, num("10"), num("20"), num("30")] },
  { label: { en: "Guest passes", ar: "دعوات الضيوف" }, values: [NONE, NONE, { en: "1 a month", ar: "1 شهرياً" }, { en: "2 a month", ar: "2 شهرياً" }] },
  { label: { en: "Price per month", ar: "السعر الشهري" }, values: [{ en: "$55", ar: "55$" }, { en: "$50", ar: "50$" }, { en: "$47", ar: "47$" }, { en: "$42", ar: "42$" }] },
];

export const ptPackages: PtPackage[] = [
  { name: { en: "Single session", ar: "جلسة واحدة" }, price: 35, per: { en: "per session", ar: "للجلسة" }, note: { en: "Try it, or top up between packages.", ar: "للتجربة أو بين الباقات." } },
  { name: { en: "5 sessions", ar: "5 جلسات" }, price: 160, per: { en: "$32 each", ar: "32$ للجلسة" }, note: { en: "Use within 6 weeks.", ar: "تُستخدم خلال 6 أسابيع." } },
  { name: { en: "10 sessions", ar: "10 جلسات" }, price: 300, per: { en: "$30 each", ar: "30$ للجلسة" }, note: { en: "Use within 3 months. Includes a written plan.", ar: "تُستخدم خلال 3 أشهر. تشمل خطة مكتوبة." } },
];

export const faqs: Faq[] = [
  {
    q: { en: "Can I freeze my membership?", ar: "هل يمكنني تجميد اشتراكي؟" },
    a: {
      en: "3, 6 and 12-month plans come with freeze days for travel or injury. Ask at the desk or on WhatsApp and your end date moves by the days you freeze.",
      ar: "اشتراكات 3 و6 و12 شهراً تأتي مع أيام تجميد للسفر أو الإصابة. اطلبوا ذلك في الاستقبال أو على واتساب، فيتأخّر تاريخ الانتهاء بعدد الأيام المجمّدة.",
    },
  },
  {
    q: { en: "How late can I cancel a class?", ar: "حتى متى يمكنني إلغاء حصة؟" },
    a: {
      en: "Up to 2 hours before it starts, from the link in your WhatsApp confirmation. Later than that, a class pack loses one class.",
      ar: "حتى ساعتين قبل بدايتها، من الرابط في رسالة التأكيد على واتساب. بعد ذلك تُحتسب حصة من باقة الحصص.",
    },
  },
  {
    q: { en: "Which payment methods do you accept?", ar: "ما طرق الدفع المقبولة؟" },
    a: {
      en: "Cash in USD or LBP at the day's rate, card, Whish and OMT. You get the receipt on WhatsApp.",
      ar: "نقداً بالدولار أو بالليرة حسب سعر اليوم، بالبطاقة، أو عبر Whish وOMT. يصلكم الإيصال على واتساب.",
    },
  },
  {
    q: { en: "I have never trained before. Where do I start?", ar: "لم أتدرّب من قبل. من أين أبدأ؟" },
    a: {
      en: "Book a free trial class or a free consultation with a trainer. We will suggest the right classes for your level.",
      ar: "احجزوا حصة تجريبية مجانية أو استشارة مجانية مع مدرّب. سنقترح الحصص المناسبة لمستواكم.",
    },
  },
];

export const facilities: Facility[] = [
  { title: { en: "Gym floor", ar: "صالة الأوزان" }, text: { en: "Racks, free weights up to 50 kg, cable machines and cardio.", ar: "أقفاص، أوزان حرّة حتى 50 كلغ، أجهزة كابلات وأجهزة كارديو." }, photo: { en: "Gym floor with racks", ar: "صالة الأوزان والأقفاص" } },
  { title: { en: "Studios", ar: "الاستوديوهات" }, text: { en: "Two studios: Spin with 20 bikes, and a quiet studio for Yoga, Pilates and Boxing.", ar: "استوديوهان: سبين مع 20 دراجة، واستوديو هادئ لليوغا والبيلاتس والملاكمة." }, photo: { en: "Spin studio", ar: "استوديو السبين" } },
  { title: { en: "Turf", ar: "منطقة العشب" }, text: { en: "20 metres of turf for sleds, HIIT circuits and conditioning.", ar: "20 متراً من العشب للزلاجات ودوائر HIIT واللياقة." }, photo: { en: "Turf lane with sleds", ar: "ممر العشب والزلاجات" } },
  { title: { en: "Sauna and recovery", ar: "الساونا والاستشفاء" }, text: { en: "Sauna, foam rollers and a stretching zone to finish your session.", ar: "ساونا وأسطوانات تدليك ومنطقة تمدّد لإنهاء التمرين." }, photo: { en: "Sauna and stretching zone", ar: "الساونا ومنطقة التمدّد" } },
  { title: { en: "Body scan", ar: "قياس تركيب الجسم" }, text: { en: "A monthly body-composition scan: weight, body fat and muscle, tracked over time.", ar: "قياس شهري لتركيب الجسم: الوزن والدهون والعضل، مع متابعة التغيّر." }, photo: { en: "Body-composition scanner", ar: "جهاز قياس تركيب الجسم" } },
  { title: { en: "Changing rooms", ar: "غرف تبديل الملابس" }, text: { en: "Showers, lockers with your own code and towels at the desk.", ar: "دوشات، خزائن برمز خاص، ومناشف في الاستقبال." }, photo: { en: "Changing room and lockers", ar: "غرفة تبديل الملابس والخزائن" } },
];

/** The member page reached from WhatsApp links: /en/m/7KQ2 */
export const demoMembers: DemoMember[] = [
  {
    code: "7KQ2",
    name: { en: "Rana Haddad", ar: "رنا حداد" },
    first: { en: "Rana", ar: "رنا" },
    plan: { en: "12 months · all access", ar: "12 شهراً · كل المرافق" },
    ends: { en: "13 March 2027", ar: "13 آذار 2027" },
    daysLeft: 109,
    ptLeft: 3,
    trainer: "rami",
    bookings: [
      { id: "b1", when: { en: "Today · 20:15", ar: "اليوم · 20:15" }, what: { en: "Spin with Karim · Studio 2", ar: "سبين مع كريم · استوديو 2" }, status: "booked" },
      { id: "b2", when: { en: "Thu 26 Nov · 18:30", ar: "الخميس 26 تشرين الثاني · 18:30" }, what: { en: "Strength with Joe · Gym floor", ar: "قوة مع جو · صالة الأوزان" }, status: "waitlist", place: 2 },
      { id: "b3", when: { en: "Fri 27 Nov · 07:00", ar: "الجمعة 27 تشرين الثاني · 07:00" }, what: { en: "Personal training with Rami", ar: "تدريب شخصي مع رامي" }, status: "booked" },
    ],
  },
];
