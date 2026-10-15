import type { DayHours } from "./types";

/** Standard initial schedule template: Monday–Saturday 9:00 AM – 5:00 PM, Sunday closed. */
export const DEFAULT_HOURS: DayHours[] = [
  { day: 0, closed: true, open: "09:00", close: "17:00" },
  { day: 1, closed: false, open: "09:00", close: "17:00" },
  { day: 2, closed: false, open: "09:00", close: "17:00" },
  { day: 3, closed: false, open: "09:00", close: "17:00" },
  { day: 4, closed: false, open: "09:00", close: "17:00" },
  { day: 5, closed: false, open: "09:00", close: "17:00" },
  { day: 6, closed: false, open: "09:00", close: "17:00" },
];

export const CLINIC_HOURS = DEFAULT_HOURS;
