/**
 * Everything that changes when we pitch this demo to a different gym.
 * Names, logo letter, accent color, money, contact details and hours live here and nowhere else.
 */
export const brand = {
  /** Full name, e.g. in the footer and page titles. */
  name: "Platinum Gym",
  /** Short name used in sentences: "Today at Platinum", "Platinum Assistant". */
  short: "Platinum",
  /** Logo: a letter in a colored square, and the wordmark next to it. */
  monogram: "P",
  wordmark: "PLATINUM",
  /** The gym owner: shown in the CRM and addressed by the WhatsApp assistant. */
  owner: { name: "Gael", first: "Gael", initials: "G" },
  /** Website accent. The CRM only uses it in the logo mark. */
  accent: "#C8F135",
  /** Prices are in Rwandan francs, written "60,000 RWF". */
  currency: "RWF",
  city: "Kigali",
  phone: "+250 788 123 456",
  /**
   * WhatsApp Business number in international format without "+", e.g. "250788123456".
   * Left empty in the demo so no button opens a chat with a random number.
   */
  whatsappNumber: "",
  address: { en: "KG 9 Ave, Nyarutarama, Kigali" },
  hours: [
    { days: { en: "Mon – Fri" }, time: "06:00 – 22:00" },
    { days: { en: "Saturday" }, time: "07:00 – 20:00" },
    { days: { en: "Sunday" }, time: "08:00 – 14:00" },
  ],
  instagram: "https://instagram.com/",
  /** Short web address shown in WhatsApp messages for the member's private page (placeholder). */
  shortLink: "platinumgym.rw",
} as const;

/** "60,000 RWF" */
export const money = (n: number) => `${n.toLocaleString("en-US")} ${brand.currency}`;
