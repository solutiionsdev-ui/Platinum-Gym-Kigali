/**
 * Everything that changes when we pitch this demo to a different gym.
 * Names, logo letter, accent color, contact details and hours live here and nowhere else.
 */
export const brand = {
  /** Full name, e.g. in the footer and page titles. */
  name: "Platinum Gym",
  nameAr: "بلاتينوم جيم",
  /** Short name used in sentences: "Today at Platinum", "Platinum Assistant". */
  short: "Platinum",
  shortAr: "بلاتينوم",
  /** Logo: a letter in a colored square, and the wordmark next to it (stays in Latin letters in Arabic too). */
  monogram: "P",
  wordmark: "PLATINUM",
  /** The gym owner: shown in the CRM and addressed by the WhatsApp assistant. */
  owner: { name: "Gael", first: "Gael", initials: "G" },
  /** Website accent. The CRM only uses it in the logo mark. */
  accent: "#C8F135",
  phone: "+961 1 234 567",
  /**
   * WhatsApp Business number in international format without "+", e.g. "9613123456".
   * Left empty in the demo so no button opens a chat with a random number.
   */
  whatsappNumber: "",
  address: {
    en: "Sassine Square, Achrafieh, Beirut",
    ar: "ساحة ساسين، الأشرفية، بيروت",
  },
  hours: [
    { days: { en: "Mon – Fri", ar: "الإثنين – الجمعة" }, time: "06:00 – 23:00" },
    { days: { en: "Saturday", ar: "السبت" }, time: "07:00 – 21:00" },
    { days: { en: "Sunday", ar: "الأحد" }, time: "08:00 – 18:00" },
  ],
  instagram: "https://instagram.com/",
  /** Short web address shown in WhatsApp messages for the member's private page. */
  shortLink: "platinumgym.lb",
} as const;
