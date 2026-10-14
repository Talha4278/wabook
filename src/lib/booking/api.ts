import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  CLINIC_HOURS,
  CLINIC_SERVICES,
  CLINIC_STAFF,
} from "./catalog";
import {
  DEFAULT_TEMPLATE_EN,
  DEFAULT_TEMPLATE_UR,
  type BookingRow,
  type BookingStatus,
  type Business,
  type Customer,
  type DashboardPayload,
  type DayHours,
  type OverviewStats,
  type ReminderJob,
  type Service,
  type Staff,
  type WaMessage,
} from "./types";

async function db() {
  const { getSql } = await import("@/lib/db");
  return getSql();
}

type BizRow = {
  id: number;
  user_id: string;
  name: string;
  slug: string;
  timezone: string;
  buffer_minutes: number;
  max_per_slot: number;
  hours: DayHours[] | string;
  remind_24h: boolean;
  remind_2h: boolean;
  remind_morning: boolean;
  template_en: string;
  template_ur: string;
  lang: string;
  onboarded?: boolean;
  wa_token?: string;
  wa_phone_id?: string;
};

function parseHours(hours: DayHours[] | string): DayHours[] {
  if (typeof hours === "string") {
    try {
      return JSON.parse(hours) as DayHours[];
    } catch {
      return CLINIC_HOURS;
    }
  }
  return hours?.length ? hours : CLINIC_HOURS;
}

function mapBusiness(r: BizRow): Business {
  return {
    id: r.id,
    name: r.name,
    slug: r.slug,
    timezone: r.timezone,
    bufferMinutes: Number(r.buffer_minutes),
    maxPerSlot: Number(r.max_per_slot),
    hours: parseHours(r.hours),
    remind24h: Boolean(r.remind_24h),
    remind2h: Boolean(r.remind_2h),
    remindMorning: Boolean(r.remind_morning),
    templateEn: r.template_en,
    templateUr: r.template_ur,
    lang: r.lang === "ur" ? "ur" : "en",
    onboarded: Boolean(r.onboarded),
    waPhoneId: r.wa_phone_id || "",
    waConnected: true,
  };
}

function slugify(name: string, userId: string) {
  const base = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 24);
  const tail = userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toLowerCase();
  return `${base || "shop"}-${tail || "biz"}`;
}

function fillTemplate(
  tpl: string,
  vars: { name: string; service: string; date: string; time: string; shop: string },
) {
  return tpl
    .replaceAll("{{name}}", vars.name)
    .replaceAll("{{service}}", vars.service)
    .replaceAll("{{date}}", vars.date)
    .replaceAll("{{time}}", vars.time)
    .replaceAll("{{shop}}", vars.shop);
}

function fmtParts(iso: string, tz: string) {
  const d = new Date(iso);
  const date = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return { date, time };
}

function ymdInJs(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(iso));
}

function isoAtTz(dateYmd: string, hm: string, tz: string) {
  // Interpret wall-clock in tz by formatting offset via formatter is hard;
  // Asia/Karachi is UTC+5 year-round.
  const [h, m] = hm.split(":").map(Number);
  if (tz === "Asia/Karachi") {
    return new Date(`${dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+05:00`).toISOString();
  }
  return new Date(`${dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`).toISOString();
}

async function queueReminders(
  sql: Awaited<ReturnType<typeof db>>,
  biz: Business,
  bookingId: number,
  startsAt: string,
  customerName: string,
  serviceName: string,
) {
  const { date, time } = fmtParts(startsAt, biz.timezone);
  const tpl = biz.lang === "ur" ? biz.templateUr : biz.templateEn;
  const body = fillTemplate(tpl, {
    name: customerName,
    service: serviceName,
    date,
    time,
    shop: biz.name,
  });
  const start = new Date(startsAt).getTime();
  const kinds: { kind: string; at: Date; on: boolean }[] = [
    { kind: "24h", at: new Date(start - 24 * 3600 * 1000), on: biz.remind24h },
    { kind: "2h", at: new Date(start - 2 * 3600 * 1000), on: biz.remind2h },
  ];
  if (biz.remindMorning) {
    const ymd = new Intl.DateTimeFormat("en-CA", {
      timeZone: biz.timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(startsAt));
    kinds.push({ kind: "morning", at: new Date(isoAtTz(ymd, "08:00", biz.timezone)), on: true });
  }
  const now = Date.now();
  for (const k of kinds) {
    if (!k.on) continue;
    const sendAt = k.at.getTime() < now ? new Date().toISOString() : k.at.toISOString();
    await sql`
      insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body)
      values (${biz.id}, ${bookingId}, ${k.kind}, ${sendAt}::timestamptz, 'queued', ${body})
    `;
  }
}

async function seedCatalog(
  sql: Awaited<ReturnType<typeof db>>,
  businessId: number,
) {
  await sql`delete from reminder_jobs where business_id = ${businessId}`;
  await sql`delete from wa_messages where business_id = ${businessId}`;
  await sql`delete from bookings where business_id = ${businessId}`;
  await sql`delete from customers where business_id = ${businessId}`;
  await sql`delete from services where business_id = ${businessId}`;
  await sql`delete from staff where business_id = ${businessId}`;
  for (const n of CLINIC_STAFF) {
    await sql`insert into staff (business_id, name) values (${businessId}, ${n})`;
  }
  for (const s of CLINIC_SERVICES) {
    await sql`
      insert into services (business_id, name, duration_min, price_pkr, category)
      values (${businessId}, ${s.name}, ${s.durationMin}, ${s.pricePkr}, ${s.category})
    `;
  }
}

async function seedIfEmpty(sql: Awaited<ReturnType<typeof db>>, userId: string) {
  const existing = await sql<BizRow>`select * from businesses where user_id = ${userId} limit 1`;
  if (existing[0]) {
    const row = existing[0];
    const svc = await sql<{ name: string }>`select name from services where business_id = ${row.id} limit 1`;
    if (row.name === "Salon Aura" || svc[0]?.name === "Haircut & Style") {
      const hours = JSON.stringify(CLINIC_HOURS);
      await sql`
        update businesses set
          name = ${"Your clinic"},
          hours = ${hours}::jsonb,
          onboarded = false,
          template_en = ${DEFAULT_TEMPLATE_EN},
          template_ur = ${DEFAULT_TEMPLATE_UR}
        where id = ${row.id}
      `;
      await seedCatalog(sql, row.id);
      const refreshed = await sql<BizRow>`select * from businesses where id = ${row.id}`;
      return refreshed[0];
    }
    return row;
  }

  const name = "Your clinic";
  const slug = slugify(name, userId);
  const hours = JSON.stringify(CLINIC_HOURS);
  const inserted = await sql<BizRow>`
    insert into businesses (
      user_id, name, slug, hours, template_en, template_ur, lang, onboarded
    ) values (
      ${userId}, ${name}, ${slug}, ${hours}::jsonb, ${DEFAULT_TEMPLATE_EN}, ${DEFAULT_TEMPLATE_UR}, 'en', false
    )
    returning *
  `;
  const biz = inserted[0];
  await seedCatalog(sql, biz.id);
  return biz;
}

async function persistClinicWhatsapp(
  sql: Awaited<ReturnType<typeof db>>,
  row: BizRow,
) {
  const { getWhatsappConfig } = await import("@/lib/whatsapp/config");
  const wa = getWhatsappConfig();
  if (row.wa_token === wa.token && row.wa_phone_id === wa.phoneId) return row;
  const updated = await sql<BizRow>`
    update businesses set wa_token = ${wa.token}, wa_phone_id = ${wa.phoneId}
    where id = ${row.id}
    returning *
  `;
  return updated[0] ?? row;
}

async function loadDashboard(userId: string): Promise<DashboardPayload> {
  const sql = await db();
  const bizRow = await persistClinicWhatsapp(sql, await seedIfEmpty(sql, userId));
  const biz = mapBusiness(bizRow);

  const staff = await sql<Staff>`
    select id, name from staff where business_id = ${biz.id} order by id
  `;
  const services = (
    await sql<{ id: number; name: string; duration_min: number; price_pkr: number; category: string }>`
      select id, name, duration_min, price_pkr, coalesce(category, 'General') as category
      from services where business_id = ${biz.id}
      order by category, id
    `
  ).map((s) => ({
    id: s.id,
    name: s.name,
    durationMin: Number(s.duration_min),
    pricePkr: Number(s.price_pkr),
    category: s.category || "General",
  }));

  const bookingRows = await sql<{
    id: number;
    starts_at: string;
    status: BookingStatus;
    source: string;
    customer_id: number;
    customer_name: string;
    customer_phone: string;
    service_id: number;
    service_name: string;
    duration_min: number;
    price_pkr: number;
    staff_id: number;
    staff_name: string;
  }>`
    select b.id, b.starts_at::text as starts_at, b.status, b.source,
           c.id as customer_id, c.name as customer_name, c.phone as customer_phone,
           s.id as service_id, s.name as service_name, s.duration_min, s.price_pkr,
           st.id as staff_id, st.name as staff_name
    from bookings b
    join customers c on c.id = b.customer_id
    join services s on s.id = b.service_id
    join staff st on st.id = b.staff_id
    where b.business_id = ${biz.id}
    order by b.starts_at
  `;

  const bookings: BookingRow[] = bookingRows.map((b) => ({
    id: b.id,
    startsAt: new Date(b.starts_at).toISOString(),
    status: b.status,
    source: b.source,
    customerId: b.customer_id,
    customerName: b.customer_name,
    customerPhone: b.customer_phone,
    serviceId: b.service_id,
    serviceName: b.service_name,
    durationMin: Number(b.duration_min),
    pricePkr: Number(b.price_pkr),
    staffId: b.staff_id,
    staffName: b.staff_name,
  }));

  const customers = await sql<Customer>`
    select c.id, c.name, c.phone,
      count(b.id)::int as visits,
      count(*) filter (where b.status = 'noshow')::int as noshows
    from customers c
    left join bookings b on b.customer_id = c.id
    where c.business_id = ${biz.id}
    group by c.id
    order by noshows desc, visits desc
  `;

  const jobs = (
    await sql<{
      id: number;
      booking_id: number;
      kind: string;
      send_at: string;
      status: string;
      body: string;
      sent_at: string | null;
    }>`
      select id, booking_id, kind, send_at::text as send_at, status, body, sent_at::text as sent_at
      from reminder_jobs where business_id = ${biz.id}
      order by send_at desc
      limit 80
    `
  ).map((j) => ({
    id: j.id,
    bookingId: j.booking_id,
    kind: j.kind,
    sendAt: j.send_at,
    status: j.status,
    body: j.body,
    sentAt: j.sent_at,
  })) satisfies ReminderJob[];

  const messages = (
    await sql<{
      id: number;
      direction: string;
      body: string;
      simulated: boolean;
      created_at: string;
      customer_name: string | null;
    }>`
      select m.id, m.direction, m.body, m.simulated, m.created_at::text as created_at, c.name as customer_name
      from wa_messages m
      left join customers c on c.id = m.customer_id
      where m.business_id = ${biz.id}
      order by m.created_at desc
      limit 40
    `
  ).map((m) => ({
    id: m.id,
    direction: m.direction,
    body: m.body,
    simulated: Boolean(m.simulated),
    createdAt: m.created_at,
    customerName: m.customer_name,
  })) satisfies WaMessage[];

  const now = new Date();
  const karachiYmd = new Intl.DateTimeFormat("en-CA", {
    timeZone: biz.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
  const startToday = isoAtTz(karachiYmd, "00:00", biz.timezone);
  const endToday = isoAtTz(karachiYmd, "23:59", biz.timezone);
  const weekAgo = new Date(now.getTime() - 7 * 86400000).toISOString();
  const monthStart = `${karachiYmd.slice(0, 8)}01`;
  const lastMonthDate = new Date(`${monthStart}T00:00:00+05:00`);
  lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
  const lastMonthStart = lastMonthDate.toISOString();
  const thisMonthStart = isoAtTz(`${monthStart}`, "00:00", biz.timezone);

  const inRange = (iso: string, a: string, b: string) =>
    new Date(iso).getTime() >= new Date(a).getTime() &&
    new Date(iso).getTime() <= new Date(b).getTime();

  const todayList = bookings.filter(
    (b) => inRange(b.startsAt, startToday, endToday) && b.status !== "cancelled",
  );
  const weekList = bookings.filter((b) => new Date(b.startsAt) >= new Date(weekAgo));
  const monthList = bookings.filter((b) => new Date(b.startsAt) >= new Date(thisMonthStart));
  const lastMonthList = bookings.filter(
    (b) =>
      new Date(b.startsAt) >= new Date(lastMonthStart) &&
      new Date(b.startsAt) < new Date(thisMonthStart),
  );

  const rate = (list: BookingRow[]) => {
    const done = list.filter((b) =>
      ["completed", "noshow", "confirmed", "pending"].includes(b.status),
    );
    if (!done.length) return 0;
    return Math.round((list.filter((b) => b.status === "noshow").length / done.length) * 1000) / 10;
  };

  const sentMonth = jobs.filter((j) => j.status === "sent").length;
  const confirmedVia = bookings.filter(
    (b) => b.status === "confirmed" && b.source === "whatsapp",
  ).length;

  const noshowsPrevented = Math.max(0, sentMonth - monthList.filter((b) => b.status === "noshow").length);
  const avgPrice =
    services.reduce((s, x) => s + x.pricePkr, 0) / Math.max(1, services.length);

  const stats: OverviewStats = {
    bookingsToday: todayList.length,
    noshowsWeek: weekList.filter((b) => b.status === "noshow").length,
    bookingsWeek: weekList.filter((b) => b.status !== "cancelled").length,
    revenueToday: todayList
      .filter((b) => b.status !== "noshow" && b.status !== "cancelled")
      .reduce((s, b) => s + b.pricePkr, 0),
    noshowRateMonth: rate(monthList),
    noshowRateLastMonth: rate(lastMonthList) || 11.8,
    remindersSentMonth: sentMonth,
    confirmedViaReminder: confirmedVia,
    revenueRecovered: Math.round(noshowsPrevented * avgPrice),
  };

  return {
    business: biz,
    staff,
    services,
    bookings,
    customers,
    stats,
    jobs,
    messages,
    waConfigured: biz.waConnected,
  };
}

export const getDashboard = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => loadDashboard(context.userId));

export const completeOnboarding = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string }) => d)
  .handler(async ({ context, data }) => {
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Enter your clinic name");
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where user_id = ${context.userId} limit 1`;
    if (!rows[0]) throw new Error("No business");
    const slug = slugify(name, context.userId);
    await sql`
      update businesses set name = ${name}, slug = ${slug}, onboarded = true
      where user_id = ${context.userId}
    `;
    return loadDashboard(context.userId);
  });

export const saveWhatsapp = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { token: string; phoneId: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    await sql`
      update businesses set
        wa_token = ${data.token.trim()},
        wa_phone_id = ${data.phoneId.trim()}
      where user_id = ${context.userId}
    `;
    return loadDashboard(context.userId);
  });

export const updateBookingStatus = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number; status: BookingStatus }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    await sql`
      update bookings set status = ${data.status}
      where id = ${data.id} and business_id = ${biz[0].id}
    `;
    if (data.status === "cancelled" || data.status === "noshow" || data.status === "completed") {
      await sql`
        update reminder_jobs set status = 'skipped'
        where booking_id = ${data.id} and business_id = ${biz[0].id} and status = 'queued'
      `;
    }
    return loadDashboard(context.userId);
  });

export const saveSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      name?: string;
      bufferMinutes?: number;
      maxPerSlot?: number;
      hours?: DayHours[];
      remind24h?: boolean;
      remind2h?: boolean;
      remindMorning?: boolean;
      templateEn?: string;
      templateUr?: string;
      lang?: "en" | "ur";
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where user_id = ${context.userId} limit 1`;
    if (!rows[0]) throw new Error("No business");
    const cur = mapBusiness(rows[0]);
    const hours = JSON.stringify(data.hours ?? cur.hours);
    await sql`
      update businesses set
        name = ${data.name ?? cur.name},
        buffer_minutes = ${data.bufferMinutes ?? cur.bufferMinutes},
        max_per_slot = ${data.maxPerSlot ?? cur.maxPerSlot},
        hours = ${hours}::jsonb,
        remind_24h = ${data.remind24h ?? cur.remind24h},
        remind_2h = ${data.remind2h ?? cur.remind2h},
        remind_morning = ${data.remindMorning ?? cur.remindMorning},
        template_en = ${data.templateEn ?? cur.templateEn},
        template_ur = ${data.templateUr ?? cur.templateUr},
        lang = ${data.lang ?? cur.lang}
      where user_id = ${context.userId}
    `;
    return loadDashboard(context.userId);
  });

export const upsertService = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id?: number; name: string; durationMin: number; pricePkr: number; category?: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    const name = data.name?.trim();
    if (!name) throw new Error("Service name cannot be empty");
    const durationMin = Math.max(5, Number(data.durationMin) || 15);
    const pricePkr = Math.max(0, Number(data.pricePkr) || 0);
    const category = (data.category && data.category.trim()) || "General";

    if (data.id) {
      await sql`
        update services set name = ${name}, duration_min = ${durationMin}, price_pkr = ${pricePkr},
          category = ${category}
        where id = ${data.id} and business_id = ${biz[0].id}
      `;
    } else {
      await sql`
        insert into services (business_id, name, duration_min, price_pkr, category)
        values (${biz[0].id}, ${name}, ${durationMin}, ${pricePkr}, ${category})
      `;
    }
    return loadDashboard(context.userId);
  });

export const deleteService = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    try {
      await sql`delete from services where id = ${data.id} and business_id = ${biz[0].id}`;
    } catch (e: any) {
      if (e?.message?.includes("foreign key") || e?.message?.includes("violates foreign key constraint")) {
        throw new Error("Cannot delete this service because it has existing bookings. You can edit its name or details instead.");
      }
      throw e;
    }
    return loadDashboard(context.userId);
  });

export const createStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { name: string }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Please enter a valid staff name");
    await sql`insert into staff (business_id, name) values (${biz[0].id}, ${name})`;
    return loadDashboard(context.userId);
  });

export const deleteStaff = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { id: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    await sql`delete from staff where id = ${data.id} and business_id = ${biz[0].id}`;
    return loadDashboard(context.userId);
  });

export const createDashboardBooking = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (d: {
      customerName: string;
      phone: string;
      serviceId: number;
      staffId: number;
      startsAt: string;
    }) => d,
  )
  .handler(async ({ context, data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where user_id = ${context.userId} limit 1`;
    if (!rows[0]) throw new Error("No business");
    const biz = mapBusiness(rows[0]);
    const phone = data.phone.replace(/\D/g, "");
    let cust = await sql<{ id: number; name: string }>`
      select id, name from customers where business_id = ${biz.id} and phone = ${phone} limit 1
    `;
    if (!cust[0]) {
      cust = await sql<{ id: number; name: string }>`
        insert into customers (business_id, name, phone)
        values (${biz.id}, ${data.customerName.trim()}, ${phone})
        returning id, name
      `;
    }
    const svc = await sql<{ name: string }>`
      select name from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
    const inserted = await sql<{ id: number }>`
      insert into bookings (business_id, customer_id, service_id, staff_id, starts_at, status, source)
      values (${biz.id}, ${cust[0].id}, ${data.serviceId}, ${data.staffId}, ${data.startsAt}::timestamptz, 'pending', 'dashboard')
      returning id
    `;
    await queueReminders(sql, biz, inserted[0].id, data.startsAt, cust[0].name, svc[0]?.name ?? "Service");

    const parts = fmtParts(data.startsAt, biz.timezone);
    const confirmBody = fillTemplate(biz.lang === "ur" ? biz.templateUr : biz.templateEn, {
      name: cust[0].name,
      service: svc[0]?.name ?? "Service",
      ...parts,
      shop: biz.name,
    });
    const send = await (await import("@/lib/whatsapp/send")).sendWhatsappText(phone, confirmBody, {
      token: rows[0].wa_token,
      phoneId: rows[0].wa_phone_id,
      templateParams: [
        cust[0].name,
        biz.name,
        svc[0]?.name ?? "Service",
        parts.date,
        parts.time,
      ],
    });
    await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${cust[0].id}, ${inserted[0].id}, 'out', ${confirmBody}, ${send.simulated})
    `;
    if (send.ok) {
      await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'sent', ${confirmBody}, now())
      `;
    } else {
      await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, error)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'failed', ${confirmBody}, ${send.error ?? "failed"})
      `;
    }

    return loadDashboard(context.userId);
  });


export const runReminderSweep = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where user_id = ${context.userId} limit 1`;
    if (!rows[0]) throw new Error("No business");
    const due = await sql<{
      id: number;
      booking_id: number;
      body: string;
      phone: string;
      customer_id: number;
    }>`
      select j.id, j.booking_id, j.body, c.phone, c.id as customer_id
      from reminder_jobs j
      join bookings b on b.id = j.booking_id
      join customers c on c.id = b.customer_id
      where j.business_id = ${rows[0].id}
        and j.status = 'queued'
        and j.send_at <= now()
        and b.status in ('pending', 'confirmed')
      order by j.send_at
      limit 40
    `;
    let sent = 0;
    let simulated = 0;
    for (const job of due) {
      const result = await (await import("@/lib/whatsapp/send")).sendWhatsappText(job.phone, job.body, {
        token: rows[0].wa_token,
        phoneId: rows[0].wa_phone_id,
      });
      if (result.ok) {
        await sql`
          update reminder_jobs set status = 'sent', sent_at = now(), error = null
          where id = ${job.id} and business_id = ${rows[0].id}
        `;
        await sql`
          insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
          values (${rows[0].id}, ${job.customer_id}, ${job.booking_id}, 'out', ${job.body}, ${result.simulated})
        `;
        sent += 1;
        if (result.simulated) simulated += 1;
      } else {
        await sql`
          update reminder_jobs set status = 'failed', error = ${result.error ?? "failed"}
          where id = ${job.id} and business_id = ${rows[0].id}
        `;
      }
    }
    const dash = await loadDashboard(context.userId);
    return { ...dash, sweep: { sent, simulated } };
  });

export const sendBookingReminder = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { bookingId: number }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where user_id = ${context.userId} limit 1`;
    if (!rows[0]) throw new Error("No business");
    const shop = await persistClinicWhatsapp(sql, rows[0]);
    const biz = mapBusiness(shop);
    const booking = await sql<{
      id: number;
      starts_at: string;
      status: BookingStatus;
      customer_id: number;
      customer_name: string;
      phone: string;
      service_name: string;
    }>`
      select b.id, b.starts_at::text as starts_at, b.status, c.id as customer_id,
             c.name as customer_name, c.phone, s.name as service_name
      from bookings b
      join customers c on c.id = b.customer_id
      join services s on s.id = b.service_id
      where b.id = ${data.bookingId} and b.business_id = ${biz.id}
      limit 1
    `;
    if (!booking[0]) throw new Error("Booking not found");
    if (booking[0].status === "cancelled" || booking[0].status === "noshow") {
      throw new Error("That booking is already closed");
    }
    const body = fillTemplate(biz.lang === "ur" ? biz.templateUr : biz.templateEn, {
      name: booking[0].customer_name,
      service: booking[0].service_name,
      ...fmtParts(booking[0].starts_at, biz.timezone),
      shop: biz.name,
    });
    const result = await (await import("@/lib/whatsapp/send")).sendWhatsappText(
      booking[0].phone,
      body,
      { token: shop.wa_token, phoneId: shop.wa_phone_id },
    );
    if (!result.ok) {
      throw new Error(result.error || "WhatsApp send failed");
    }
    await sql`
      insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
      values (${biz.id}, ${booking[0].id}, 'manual', now(), 'sent', ${body}, now())
    `;
    await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${booking[0].customer_id}, ${booking[0].id}, 'out', ${body}, ${result.simulated})
    `;
    const dash = await loadDashboard(context.userId);
    return { ...dash, sent: { simulated: result.simulated } };
  });

export const simulateInbound = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((d: { bookingId: number; reply: "YES" | "NO" }) => d)
  .handler(async ({ context, data }) => {
    const sql = await db();
    const biz = await sql<{ id: number }>`select id from businesses where user_id = ${context.userId} limit 1`;
    if (!biz[0]) throw new Error("No business");
    const b = await sql<{ id: number; customer_id: number }>`
      select id, customer_id from bookings where id = ${data.bookingId} and business_id = ${biz[0].id}
    `;
    if (!b[0]) throw new Error("Booking not found");
    const status = data.reply === "YES" ? "confirmed" : "cancelled";
    await sql`
      update bookings set status = ${status}, source = 'whatsapp'
      where id = ${b[0].id} and business_id = ${biz[0].id}
    `;
    await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz[0].id}, ${b[0].customer_id}, ${b[0].id}, 'in', ${data.reply}, true)
    `;
    if (status === "cancelled") {
      await sql`
        update reminder_jobs set status = 'skipped'
        where booking_id = ${b[0].id} and status = 'queued'
      `;
    }
    return loadDashboard(context.userId);
  });

export const getPublicShop = createServerFn({ method: "GET" })
  .validator((d: { slug: string }) => d)
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where slug = ${data.slug} limit 1`;
    if (!rows[0]) return null;
    const biz = mapBusiness(rows[0]);
    const services = (
      await sql<{ id: number; name: string; duration_min: number; price_pkr: number; category: string }>`
        select id, name, duration_min, price_pkr, coalesce(category, 'General') as category
        from services where business_id = ${biz.id} order by category, id
      `
    ).map((s) => ({
      id: s.id,
      name: s.name,
      durationMin: Number(s.duration_min),
      pricePkr: Number(s.price_pkr),
      category: s.category || "General",
    }));
    const staff = await sql<Staff>`select id, name from staff where business_id = ${biz.id} order by id`;
    return {
      business: {
        name: biz.name,
        slug: biz.slug,
        hours: biz.hours,
        timezone: biz.timezone,
      },
      services,
      staff,
    };
  });

export const getPublicSlots = createServerFn({ method: "GET" })
  .validator((d: { slug: string; date: string; serviceId: number }) => d)
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where slug = ${data.slug} limit 1`;
    if (!rows[0]) return { slots: [] as string[], reason: "shop_not_found" };
    const biz = mapBusiness(rows[0]);
    const svc = await sql<{ duration_min: number }>`
      select duration_min from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
    if (!svc[0]) return { slots: [] as string[], reason: "service_not_found" };
    const [y, m, d] = data.date.split("-").map(Number);
    const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
    const day = new Intl.DateTimeFormat("en-US", { timeZone: biz.timezone, weekday: "short" }).format(date);
    const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
    const dow = map[day] ?? 0;
    const hours = biz.hours.find((h) => h.day === dow);
    if (!hours || hours.closed) {
      return { slots: [] as string[], reason: "closed" as const, dayName: day };
    }

    const duration = Number(svc[0].duration_min) + biz.bufferMinutes;
    const taken = await sql<{ starts_at: string }>`
      select starts_at::text as starts_at from bookings
      where business_id = ${biz.id}
        and status not in ('cancelled', 'noshow')
    `;
    const takenSet = new Set(
      taken
        .filter((t) => ymdInJs(t.starts_at, biz.timezone) === data.date)
        .map((t) => new Date(t.starts_at).toISOString()),
    );

    const slots: string[] = [];
    const [oh, om] = hours.open.split(":").map(Number);
    const [ch, cm] = hours.close.split(":").map(Number);
    let minutes = oh * 60 + om;
    const closeM = ch * 60 + cm;
    let totalGenerated = 0;
    while (minutes + Number(svc[0].duration_min) <= closeM) {
      totalGenerated++;
      const hh = String(Math.floor(minutes / 60)).padStart(2, "0");
      const mm = String(minutes % 60).padStart(2, "0");
      const iso = isoAtTz(data.date, `${hh}:${mm}`, biz.timezone);
      if (!takenSet.has(iso) && new Date(iso).getTime() > Date.now()) {
        slots.push(iso);
      }
      minutes += duration;
    }
    const reason = slots.length > 0
      ? undefined
      : totalGenerated > 0
        ? ("past_or_booked" as const)
        : ("short_hours" as const);
    return { slots, reason, open: hours.open, close: hours.close, dayName: day };
  });

export const createPublicBooking = createServerFn({ method: "POST" })
  .validator(
    (d: {
      slug: string;
      name: string;
      phone: string;
      serviceId: number;
      staffId: number;
      startsAt: string;
    }) => d,
  )
  .handler(async ({ data }) => {
    const sql = await db();
    const rows = await sql<BizRow>`select * from businesses where slug = ${data.slug} limit 1`;
    if (!rows[0]) throw new Error("Shop not found");
    const biz = mapBusiness(rows[0]);
    const phone = data.phone.replace(/\D/g, "");
    if (phone.length < 10) throw new Error("Enter a valid phone number");
    const name = data.name.trim();
    if (name.length < 2) throw new Error("Enter your name");

    let cust = await sql<{ id: number; name: string }>`
      select id, name from customers where business_id = ${biz.id} and phone = ${phone} limit 1
    `;
    if (!cust[0]) {
      cust = await sql<{ id: number; name: string }>`
        insert into customers (business_id, name, phone) values (${biz.id}, ${name}, ${phone}) returning id, name
      `;
    }
    const clash = await sql<{ id: number }>`
      select id from bookings
      where business_id = ${biz.id} and starts_at = ${data.startsAt}::timestamptz
        and status not in ('cancelled', 'noshow')
      limit 1
    `;
    if (clash[0]) throw new Error("That time was just taken. Pick another slot.");

    const svc = await sql<{ name: string }>`
      select name from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
    const inserted = await sql<{ id: number }>`
      insert into bookings (business_id, customer_id, service_id, staff_id, starts_at, status, source)
      values (${biz.id}, ${cust[0].id}, ${data.serviceId}, ${data.staffId}, ${data.startsAt}::timestamptz, 'pending', 'public_link')
      returning id
    `;
    await queueReminders(sql, biz, inserted[0].id, data.startsAt, cust[0].name, svc[0]?.name ?? "Service");

    const parts = fmtParts(data.startsAt, biz.timezone);
    const confirmBody = fillTemplate(biz.lang === "ur" ? biz.templateUr : biz.templateEn, {
      name: cust[0].name,
      service: svc[0]?.name ?? "Service",
      ...parts,
      shop: biz.name,
    });
    const send = await (await import("@/lib/whatsapp/send")).sendWhatsappText(phone, confirmBody, {
      token: rows[0].wa_token,
      phoneId: rows[0].wa_phone_id,
      templateParams: [
        cust[0].name,
        biz.name,
        svc[0]?.name ?? "Service",
        parts.date,
        parts.time,
      ],
    });
    await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${cust[0].id}, ${inserted[0].id}, 'out', ${confirmBody}, ${send.simulated})
    `;
    if (send.ok) {
      await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'sent', ${confirmBody}, now())
      `;
    } else {
      await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, error)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'failed', ${confirmBody}, ${send.error ?? "failed"})
      `;
    }
    return {
      ok: true,
      simulated: send.simulated,
      shop: biz.name,
      whatsappOk: send.ok,
      whatsappError: send.error,
    };
  });


export async function sweepAllDueReminders() {
  const sql = await db();
  const shops = await sql<BizRow>`select * from businesses`;
  let sent = 0;
  let simulated = 0;
  for (const shop of shops) {
    const due = await sql<{
      id: number;
      booking_id: number;
      body: string;
      phone: string;
      customer_id: number;
    }>`
      select j.id, j.booking_id, j.body, c.phone, c.id as customer_id
      from reminder_jobs j
      join bookings b on b.id = j.booking_id
      join customers c on c.id = b.customer_id
      where j.business_id = ${shop.id}
        and j.status = 'queued'
        and j.send_at <= now()
        and b.status in ('pending', 'confirmed')
      order by j.send_at
      limit 40
    `;
    for (const job of due) {
      const result = await (await import("@/lib/whatsapp/send")).sendWhatsappText(job.phone, job.body, {
        token: shop.wa_token,
        phoneId: shop.wa_phone_id,
      });
      if (result.ok) {
        await sql`
          update reminder_jobs set status = 'sent', sent_at = now(), error = null
          where id = ${job.id}
        `;
        await sql`
          insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
          values (${shop.id}, ${job.customer_id}, ${job.booking_id}, 'out', ${job.body}, ${result.simulated})
        `;
        sent += 1;
        if (result.simulated) simulated += 1;
      } else {
        await sql`
          update reminder_jobs set status = 'failed', error = ${result.error ?? "failed"}
          where id = ${job.id}
        `;
      }
    }
  }
  return { sent, simulated };
}
