export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "noshow"
  | "cancelled";

export type DayHours = {
  day: number;
  closed: boolean;
  open: string;
  close: string;
};

export type Business = {
  id: number;
  name: string;
  slug: string;
  timezone: string;
  bufferMinutes: number;
  maxPerSlot: number;
  hours: DayHours[];
  remind24h: boolean;
  remind2h: boolean;
  remindMorning: boolean;
  templateEn: string;
  templateUr: string;
  lang: "en" | "ur";
  onboarded: boolean;
  waPhoneId: string;
  waConnected: boolean;
};

export type Staff = { id: number; name: string };
export type Service = {
  id: number;
  name: string;
  durationMin: number;
  pricePkr: number;
  category: string;
};
export type Customer = {
  id: number;
  name: string;
  phone: string;
  visits: number;
  noshows: number;
};

export type BookingRow = {
  id: number;
  startsAt: string;
  status: BookingStatus;
  source: string;
  customerId: number;
  customerName: string;
  customerPhone: string;
  serviceId: number;
  serviceName: string;
  durationMin: number;
  pricePkr: number;
  staffId: number;
  staffName: string;
};

export type ReminderJob = {
  id: number;
  bookingId: number;
  kind: string;
  sendAt: string;
  status: string;
  body: string;
  sentAt: string | null;
  simulated?: boolean;
};

export type WaMessage = {
  id: number;
  direction: string;
  body: string;
  simulated: boolean;
  createdAt: string;
  customerName: string | null;
};

export type OverviewStats = {
  bookingsToday: number;
  noshowsWeek: number;
  bookingsWeek: number;
  revenueToday: number;
  noshowRateMonth: number;
  noshowRateLastMonth: number;
  remindersSentMonth: number;
  confirmedViaReminder: number;
  revenueRecovered: number;
};

export type DashboardPayload = {
  business: Business;
  staff: Staff[];
  services: Service[];
  bookings: BookingRow[];
  customers: Customer[];
  stats: OverviewStats;
  jobs: ReminderJob[];
  messages: WaMessage[];
  waConfigured: boolean;
};

export const DEFAULT_TEMPLATE_EN = `Hi {{name}}
This is {{shop}} reminding you of your {{service}} on {{date}} at {{time}}.

Reply YES to confirm or NO to cancel.`;

export const DEFAULT_TEMPLATE_UR = `السلام علیکم {{name}}
{{shop}} سے یاد دہانی: آپ کی {{service}} {{date}} کو {{time}} بجے ہے۔

تصدیق کے لیے YES لکھیں، منسوخ کے لیے NO۔`;
