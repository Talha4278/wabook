import type { DayHours } from "./types";

/** Mon–Sat 5:00 PM – 10:00 PM PKT, Sunday closed. */
export const CLINIC_HOURS: DayHours[] = [
  { day: 0, closed: true, open: "17:00", close: "22:00" },
  { day: 1, closed: false, open: "17:00", close: "22:00" },
  { day: 2, closed: false, open: "17:00", close: "22:00" },
  { day: 3, closed: false, open: "17:00", close: "22:00" },
  { day: 4, closed: false, open: "17:00", close: "22:00" },
  { day: 5, closed: false, open: "17:00", close: "22:00" },
  { day: 6, closed: false, open: "17:00", close: "22:00" },
];

export const CLINIC_STAFF = [
  "Dr. Muhammad Hashir (BDS, RDS, CHPE)",
  "Dr. Rameesha Hashir (BDS, RDS, Certified Aesthetician)",
  "Dr. Umer Farooq (BDS, RDS, FCPS)",
] as const;

/** Typical PKR list prices for a private clinic in Pakistan — owner can edit. */
export const CLINIC_SERVICES: { category: string; name: string; durationMin: number; pricePkr: number }[] = [
  { category: "Dental", name: "Root canal treatment", durationMin: 90, pricePkr: 15000 },
  { category: "Dental", name: "Scaling & polishing", durationMin: 45, pricePkr: 5000 },
  { category: "Dental", name: "Teeth whitening / bleaching", durationMin: 60, pricePkr: 18000 },
  { category: "Dental", name: "Cosmetic tooth-colored filling", durationMin: 40, pricePkr: 6000 },
  { category: "Dental", name: "Smile design consult", durationMin: 60, pricePkr: 8000 },
  { category: "Dental", name: "Gum treatment", durationMin: 45, pricePkr: 8000 },
  { category: "Dental", name: "Dental jewellery", durationMin: 30, pricePkr: 4000 },
  { category: "Dental", name: "Dental implants & bone management", durationMin: 120, pricePkr: 80000 },
  { category: "Dental", name: "Removable & fixed dentures", durationMin: 90, pricePkr: 25000 },
  { category: "Dental", name: "Cast partial dentures", durationMin: 90, pricePkr: 30000 },
  { category: "Dental", name: "Zirconium crown", durationMin: 60, pricePkr: 18000 },
  { category: "Dental", name: "PFM crown", durationMin: 60, pricePkr: 12000 },
  { category: "Dental", name: "Simple extraction", durationMin: 30, pricePkr: 4000 },
  { category: "Dental", name: "Complex extraction & surgery", durationMin: 60, pricePkr: 12000 },
  { category: "Dental", name: "Wisdom tooth surgery", durationMin: 60, pricePkr: 15000 },
  { category: "Dental", name: "Pits and fissure sealants", durationMin: 30, pricePkr: 3500 },
  { category: "Dental", name: "Orthodontic treatment (visit)", durationMin: 45, pricePkr: 8000 },
  { category: "Dental", name: "Clear aligners (visit)", durationMin: 45, pricePkr: 15000 },
  { category: "Aesthetic", name: "Hydrafacial", durationMin: 60, pricePkr: 12000 },
  { category: "Aesthetic", name: "Laser", durationMin: 45, pricePkr: 10000 },
  { category: "Aesthetic", name: "PRP (face / hair)", durationMin: 60, pricePkr: 15000 },
  { category: "Aesthetic", name: "Microneedling", durationMin: 45, pricePkr: 10000 },
  { category: "Aesthetic", name: "Mesotherapy", durationMin: 45, pricePkr: 8000 },
  { category: "Aesthetic", name: "Mole removal", durationMin: 30, pricePkr: 8000 },
  { category: "Aesthetic", name: "Chemical peel", durationMin: 40, pricePkr: 7000 },
];
