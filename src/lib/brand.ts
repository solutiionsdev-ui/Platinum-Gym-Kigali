/**
 * Everything that changes when we pitch this demo to a different gym.
 * Real details from platinumgymkigali.com (reviewed 20 Nov 2026) unless marked sample.
 */
export const brand = {
  /** Full name, e.g. in the footer and page titles. */
  name: "Platinum Gym",
  /** Short name used in sentences: "Today at Platinum", "Platinum Assistant". */
  short: "Platinum",
  /** Logo: the gym's own logo image; the letter is the fallback where an image doesn't fit. */
  logoUrl: "https://platinumgymkigali.com/assets/logo.png",
  monogram: "P",
  wordmark: "PLATINUM",
  slogan: { line1: "Empower yourself.", line2: "Transform", accent: "your body." },
  /** The gym owner and founder: shown in the CRM and addressed by the WhatsApp assistant. */
  owner: { name: "Gael", first: "Gael", initials: "G" },
  /** The gym's yellow (from its current website). The CRM only uses it in the logo mark. */
  accent: "#F4C842",
  currency: "RWF",
  city: "Kigali",
  phone: "+250 790 666 688",
  email: "info@platinumgymkigali.com",
  /**
   * WhatsApp Business number in international format without "+", e.g. "250790666688".
   * Left empty in the demo so no button opens a real chat; WhatsApp buttons go to the Contact page.
   */
  whatsappNumber: "",
  address: { en: "Rebero, near SAWA City, Kigali" },
  plusCode: "2369+5R Kigali",
  size: "465 m² (5,000 sq ft)",
  equipment: "Technogym",
  /** Open 24/7. Classes run in the evenings and on weekend mornings. */
  hours: [{ days: { en: "Every day" }, time: "Open 24 hours" }],
  instagram: "https://www.instagram.com/platinumgymkigali/",
  /** His own video, from the current website. */
  youtubeId: "aDSwIo8Ky_E",
  /** Short web address shown in WhatsApp messages for the member's private page (placeholder). */
  shortLink: "platinumgymkigali.com",
} as const;

/** "120,000 RWF" */
export const money = (n: number) => `${n.toLocaleString("en-US")} ${brand.currency}`;
