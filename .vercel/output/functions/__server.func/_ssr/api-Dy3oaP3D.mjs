import { i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CcmIlKRu.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-Dy3oaP3D.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
/** Standard initial schedule template: Monday–Saturday 9:00 AM – 5:00 PM, Sunday closed. */
var DEFAULT_HOURS = [
	{
		day: 0,
		closed: true,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 1,
		closed: false,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 2,
		closed: false,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 3,
		closed: false,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 4,
		closed: false,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 5,
		closed: false,
		open: "09:00",
		close: "17:00"
	},
	{
		day: 6,
		closed: false,
		open: "09:00",
		close: "17:00"
	}
];
var DEFAULT_TEMPLATE_EN = `Hi {{name}}
This is {{shop}} reminding you of your {{service}} on {{date}} at {{time}}.

Reply YES to confirm or NO to cancel.`;
var DEFAULT_TEMPLATE_UR = `السلام علیکم {{name}}
{{shop}} سے یاد دہانی: آپ کی {{service}} {{date}} کو {{time}} بجے ہے۔

تصدیق کے لیے YES لکھیں، منسوخ کے لیے NO۔`;
async function db() {
	const { getSql } = await import("./db-0-UzWVIo.mjs").then((n) => n.t).then((n) => n.t);
	return getSql();
}
function parseHours(hours) {
	if (typeof hours === "string") try {
		return JSON.parse(hours);
	} catch {
		return DEFAULT_HOURS;
	}
	return hours?.length ? hours : DEFAULT_HOURS;
}
function mapBusiness(r) {
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
		waConnected: true
	};
}
function slugify(name, userId) {
	const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 24);
	const tail = userId.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toLowerCase();
	return `${base || "shop"}-${tail || "biz"}`;
}
function fillTemplate(tpl, vars) {
	return tpl.replaceAll("{{name}}", vars.name).replaceAll("{{service}}", vars.service).replaceAll("{{date}}", vars.date).replaceAll("{{time}}", vars.time).replaceAll("{{shop}}", vars.shop);
}
function fmtParts(iso, tz) {
	const d = new Date(iso);
	return {
		date: new Intl.DateTimeFormat("en-GB", {
			timeZone: tz,
			day: "2-digit",
			month: "short",
			year: "numeric"
		}).format(d),
		time: new Intl.DateTimeFormat("en-GB", {
			timeZone: tz,
			hour: "numeric",
			minute: "2-digit",
			hour12: true
		}).format(d)
	};
}
function ymdInJs(iso, tz) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(new Date(iso));
}
function isoAtTz(dateYmd, hm, tz) {
	const [h, m] = hm.split(":").map(Number);
	if (tz === "Asia/Karachi") return (/* @__PURE__ */ new Date(`${dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00+05:00`)).toISOString();
	return (/* @__PURE__ */ new Date(`${dateYmd}T${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:00Z`)).toISOString();
}
async function queueReminders(sql, biz, bookingId, startsAt, customerName, serviceName) {
	const { date, time } = fmtParts(startsAt, biz.timezone);
	const body = fillTemplate(biz.lang === "ur" ? biz.templateUr : biz.templateEn, {
		name: customerName,
		service: serviceName,
		date,
		time,
		shop: biz.name
	});
	const start = new Date(startsAt).getTime();
	const kinds = [{
		kind: "24h",
		at: /* @__PURE__ */ new Date(start - 864e5),
		on: biz.remind24h
	}, {
		kind: "2h",
		at: /* @__PURE__ */ new Date(start - 72e5),
		on: biz.remind2h
	}];
	if (biz.remindMorning) {
		const ymd = new Intl.DateTimeFormat("en-CA", {
			timeZone: biz.timezone,
			year: "numeric",
			month: "2-digit",
			day: "2-digit"
		}).format(new Date(startsAt));
		kinds.push({
			kind: "morning",
			at: new Date(isoAtTz(ymd, "08:00", biz.timezone)),
			on: true
		});
	}
	const now = Date.now();
	for (const k of kinds) {
		if (!k.on) continue;
		const sendAt = k.at.getTime() < now ? (/* @__PURE__ */ new Date()).toISOString() : k.at.toISOString();
		await sql`
      insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body)
      values (${biz.id}, ${bookingId}, ${k.kind}, ${sendAt}::timestamptz, 'queued', ${body})
    `;
	}
}
async function seedIfEmpty(sql, userId) {
	const existing = await sql`select * from businesses where user_id = ${userId} limit 1`;
	if (existing[0]) return existing[0];
	return (await sql`
    insert into businesses (
      user_id, name, slug, hours, template_en, template_ur, lang, onboarded
    ) values (
      ${userId}, ${"My Clinic"}, ${slugify("clinic", userId)}, ${JSON.stringify(DEFAULT_HOURS)}::jsonb, ${DEFAULT_TEMPLATE_EN}, ${DEFAULT_TEMPLATE_UR}, 'en', false
    )
    returning *
  `)[0];
}
async function persistClinicWhatsapp(sql, row) {
	const { getWhatsappConfig } = await import("./config-COO7Pf6s.mjs");
	const wa = getWhatsappConfig();
	if (row.wa_token === wa.token && row.wa_phone_id === wa.phoneId) return row;
	return (await sql`
    update businesses set wa_token = ${wa.token}, wa_phone_id = ${wa.phoneId}
    where id = ${row.id}
    returning *
  `)[0] ?? row;
}
async function loadDashboard(userId) {
	const sql = await db();
	const biz = mapBusiness(await persistClinicWhatsapp(sql, await seedIfEmpty(sql, userId)));
	const staff = await sql`
    select id, name from staff where business_id = ${biz.id} order by id
  `;
	const services = (await sql`
      select id, name, duration_min, price_pkr, coalesce(category, 'General') as category
      from services where business_id = ${biz.id}
      order by category, id
    `).map((s) => ({
		id: s.id,
		name: s.name,
		durationMin: Number(s.duration_min),
		pricePkr: Number(s.price_pkr),
		category: s.category || "General"
	}));
	const bookings = (await sql`
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
  `).map((b) => ({
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
		staffName: b.staff_name
	}));
	const customers = await sql`
    select c.id, c.name, c.phone,
      count(b.id)::int as visits,
      count(*) filter (where b.status = 'noshow')::int as noshows
    from customers c
    left join bookings b on b.customer_id = c.id
    where c.business_id = ${biz.id}
    group by c.id
    order by noshows desc, visits desc
  `;
	const jobs = (await sql`
      select id, booking_id, kind, send_at::text as send_at, status, body, sent_at::text as sent_at
      from reminder_jobs where business_id = ${biz.id}
      order by send_at desc
      limit 80
    `).map((j) => ({
		id: j.id,
		bookingId: j.booking_id,
		kind: j.kind,
		sendAt: j.send_at,
		status: j.status,
		body: j.body,
		sentAt: j.sent_at
	}));
	const messages = (await sql`
      select m.id, m.direction, m.body, m.simulated, m.created_at::text as created_at, c.name as customer_name
      from wa_messages m
      left join customers c on c.id = m.customer_id
      where m.business_id = ${biz.id}
      order by m.created_at desc
      limit 40
    `).map((m) => ({
		id: m.id,
		direction: m.direction,
		body: m.body,
		simulated: Boolean(m.simulated),
		createdAt: m.created_at,
		customerName: m.customer_name
	}));
	const now = /* @__PURE__ */ new Date();
	const karachiYmd = new Intl.DateTimeFormat("en-CA", {
		timeZone: biz.timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(now);
	const startToday = isoAtTz(karachiYmd, "00:00", biz.timezone);
	const endToday = isoAtTz(karachiYmd, "23:59", biz.timezone);
	const weekAgo = (/* @__PURE__ */ new Date(now.getTime() - 6048e5)).toISOString();
	const monthStart = `${karachiYmd.slice(0, 8)}01`;
	const lastMonthDate = /* @__PURE__ */ new Date(`${monthStart}T00:00:00+05:00`);
	lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
	const lastMonthStart = lastMonthDate.toISOString();
	const thisMonthStart = isoAtTz(`${monthStart}`, "00:00", biz.timezone);
	const inRange = (iso, a, b) => new Date(iso).getTime() >= new Date(a).getTime() && new Date(iso).getTime() <= new Date(b).getTime();
	const todayList = bookings.filter((b) => inRange(b.startsAt, startToday, endToday) && b.status !== "cancelled");
	const weekList = bookings.filter((b) => new Date(b.startsAt) >= new Date(weekAgo));
	const monthList = bookings.filter((b) => new Date(b.startsAt) >= new Date(thisMonthStart));
	const lastMonthList = bookings.filter((b) => new Date(b.startsAt) >= new Date(lastMonthStart) && new Date(b.startsAt) < new Date(thisMonthStart));
	const rate = (list) => {
		const done = list.filter((b) => [
			"completed",
			"noshow",
			"confirmed",
			"pending"
		].includes(b.status));
		if (!done.length) return 0;
		return Math.round(list.filter((b) => b.status === "noshow").length / done.length * 1e3) / 10;
	};
	const sentMonth = jobs.filter((j) => j.status === "sent").length;
	const confirmedVia = bookings.filter((b) => b.status === "confirmed" && b.source === "whatsapp").length;
	const noshowsPrevented = Math.max(0, sentMonth - monthList.filter((b) => b.status === "noshow").length);
	const avgPrice = services.reduce((s, x) => s + x.pricePkr, 0) / Math.max(1, services.length);
	return {
		business: biz,
		staff,
		services,
		bookings,
		customers,
		stats: {
			bookingsToday: todayList.length,
			noshowsWeek: weekList.filter((b) => b.status === "noshow").length,
			bookingsWeek: weekList.filter((b) => b.status !== "cancelled").length,
			revenueToday: todayList.filter((b) => b.status !== "noshow" && b.status !== "cancelled").reduce((s, b) => s + b.pricePkr, 0),
			noshowRateMonth: rate(monthList),
			noshowRateLastMonth: rate(lastMonthList) || 11.8,
			remindersSentMonth: sentMonth,
			confirmedViaReminder: confirmedVia,
			revenueRecovered: Math.round(noshowsPrevented * avgPrice)
		},
		jobs,
		messages,
		waConfigured: biz.waConnected
	};
}
var getDashboard_createServerFn_handler = createServerRpc({
	id: "a86639b5ea8524bc0f1eeb5d2447792499ed0681e0ba24c8d6b714ae30f9f07d",
	name: "getDashboard",
	filename: "src/lib/booking/api.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context }) => loadDashboard(context.userId));
var completeOnboarding_createServerFn_handler = createServerRpc({
	id: "905fb7fb8fbf1169e551462b82ac2167659f78882e043d9f536e73e552b5c3fb",
	name: "completeOnboarding",
	filename: "src/lib/booking/api.ts"
}, (opts) => completeOnboarding.__executeServer(opts));
var completeOnboarding = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(completeOnboarding_createServerFn_handler, async ({ context, data }) => {
	const name = data.name?.trim() || "";
	if (name.length < 2) throw new Error("Please enter your clinic name (at least 2 characters).");
	const staffNames = (data.staff || []).map((s) => typeof s === "string" ? s.trim() : "").filter((s) => s.length > 0);
	if (staffNames.length === 0) throw new Error("Please add at least one practitioner or staff member.");
	const services = (data.services || []).map((s) => ({
		name: s.name?.trim() || "",
		durationMin: Number(s.durationMin) || 30,
		pricePkr: Number(s.pricePkr) || 0,
		category: s.category?.trim() || "General"
	})).filter((s) => s.name.length > 0);
	if (services.length === 0) throw new Error("Please add at least one service.");
	const hours = data.hours && Array.isArray(data.hours) && data.hours.length > 0 ? data.hours : DEFAULT_HOURS;
	const tz = data.timezone?.trim() || "Asia/Karachi";
	const bufferMinutes = Number(data.bufferMinutes) || 15;
	const sql = await db();
	const rows = await sql`select * from businesses where user_id = ${context.userId} limit 1`;
	if (!rows[0]) throw new Error("No business found");
	const bizId = rows[0].id;
	await sql`
      update businesses set
        name = ${name},
        slug = ${slugify(name, context.userId)},
        timezone = ${tz},
        buffer_minutes = ${bufferMinutes},
        hours = ${JSON.stringify(hours)}::jsonb,
        onboarded = true
      where id = ${bizId}
    `;
	await sql`delete from staff where business_id = ${bizId}`;
	for (const sName of staffNames) await sql`insert into staff (business_id, name) values (${bizId}, ${sName})`;
	await sql`delete from services where business_id = ${bizId}`;
	for (const svc of services) await sql`
        insert into services (business_id, name, duration_min, price_pkr, category)
        values (${bizId}, ${svc.name}, ${svc.durationMin}, ${svc.pricePkr}, ${svc.category})
      `;
	return loadDashboard(context.userId);
});
var saveWhatsapp_createServerFn_handler = createServerRpc({
	id: "256340de9b8195b66b22505a3f1debcd5f9e2987f3d5856b7bbf7d4a207bc138",
	name: "saveWhatsapp",
	filename: "src/lib/booking/api.ts"
}, (opts) => saveWhatsapp.__executeServer(opts));
var saveWhatsapp = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveWhatsapp_createServerFn_handler, async ({ context, data }) => {
	await (await db())`
      update businesses set
        wa_token = ${data.token.trim()},
        wa_phone_id = ${data.phoneId.trim()}
      where user_id = ${context.userId}
    `;
	return loadDashboard(context.userId);
});
var updateBookingStatus_createServerFn_handler = createServerRpc({
	id: "e895f8d593e77aef871d1859d0f9e0b84c188f8c2e95336696ab1eee3094fedc",
	name: "updateBookingStatus",
	filename: "src/lib/booking/api.ts"
}, (opts) => updateBookingStatus.__executeServer(opts));
var updateBookingStatus = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(updateBookingStatus_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	await sql`
      update bookings set status = ${data.status}
      where id = ${data.id} and business_id = ${biz[0].id}
    `;
	if (data.status === "cancelled" || data.status === "noshow" || data.status === "completed") await sql`
        update reminder_jobs set status = 'skipped'
        where booking_id = ${data.id} and business_id = ${biz[0].id} and status = 'queued'
      `;
	return loadDashboard(context.userId);
});
var saveSettings_createServerFn_handler = createServerRpc({
	id: "39338aa23c2656e0d3a4db86e8a349d547e169a9cf198d8f849e93e92e87db0d",
	name: "saveSettings",
	filename: "src/lib/booking/api.ts"
}, (opts) => saveSettings.__executeServer(opts));
var saveSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(saveSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where user_id = ${context.userId} limit 1`;
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
var upsertService_createServerFn_handler = createServerRpc({
	id: "f36671d0077819e3d2a8c37d2208b4a485a74abf4f317af7f1b5d2de784fd5f0",
	name: "upsertService",
	filename: "src/lib/booking/api.ts"
}, (opts) => upsertService.__executeServer(opts));
var upsertService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(upsertService_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	const name = data.name?.trim();
	if (!name) throw new Error("Service name cannot be empty");
	const durationMin = Math.max(5, Number(data.durationMin) || 15);
	const pricePkr = Math.max(0, Number(data.pricePkr) || 0);
	const category = data.category && data.category.trim() || "General";
	if (data.id) await sql`
        update services set name = ${name}, duration_min = ${durationMin}, price_pkr = ${pricePkr},
          category = ${category}
        where id = ${data.id} and business_id = ${biz[0].id}
      `;
	else await sql`
        insert into services (business_id, name, duration_min, price_pkr, category)
        values (${biz[0].id}, ${name}, ${durationMin}, ${pricePkr}, ${category})
      `;
	return loadDashboard(context.userId);
});
var deleteService_createServerFn_handler = createServerRpc({
	id: "620e629c4e76a94f7435d8af3f27e0f4ba9e00c798870e35c10a41820285b4b2",
	name: "deleteService",
	filename: "src/lib/booking/api.ts"
}, (opts) => deleteService.__executeServer(opts));
var deleteService = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteService_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	try {
		await sql`delete from services where id = ${data.id} and business_id = ${biz[0].id}`;
	} catch (e) {
		if (e?.message?.includes("foreign key") || e?.message?.includes("violates foreign key constraint")) throw new Error("Cannot delete this service because it has existing bookings. You can edit its name or details instead.");
		throw e;
	}
	return loadDashboard(context.userId);
});
var createStaff_createServerFn_handler = createServerRpc({
	id: "b5d00e9a48fca3d70e3e0ed48747f54dd9c8b00b1c3fac7f6a266ec0940ecde1",
	name: "createStaff",
	filename: "src/lib/booking/api.ts"
}, (opts) => createStaff.__executeServer(opts));
var createStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createStaff_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	const name = data.name.trim();
	if (name.length < 2) throw new Error("Please enter a valid staff name");
	await sql`insert into staff (business_id, name) values (${biz[0].id}, ${name})`;
	return loadDashboard(context.userId);
});
var deleteStaff_createServerFn_handler = createServerRpc({
	id: "a4c00551ff12fc1ee4797dc421b0c4ec1f0db483755def9b78f5f13f4a4d00e5",
	name: "deleteStaff",
	filename: "src/lib/booking/api.ts"
}, (opts) => deleteStaff.__executeServer(opts));
var deleteStaff = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(deleteStaff_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	await sql`delete from staff where id = ${data.id} and business_id = ${biz[0].id}`;
	return loadDashboard(context.userId);
});
var createDashboardBooking_createServerFn_handler = createServerRpc({
	id: "b8f0d1c3d3f1d9d0e9ab4b4b3341bc39333fbf8c95e441d2bda821476a00447e",
	name: "createDashboardBooking",
	filename: "src/lib/booking/api.ts"
}, (opts) => createDashboardBooking.__executeServer(opts));
var createDashboardBooking = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(createDashboardBooking_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where user_id = ${context.userId} limit 1`;
	if (!rows[0]) throw new Error("No business");
	const biz = mapBusiness(rows[0]);
	const phone = data.phone.replace(/\D/g, "");
	let cust = await sql`
      select id, name from customers where business_id = ${biz.id} and phone = ${phone} limit 1
    `;
	if (!cust[0]) cust = await sql`
        insert into customers (business_id, name, phone)
        values (${biz.id}, ${data.customerName.trim()}, ${phone})
        returning id, name
      `;
	const svc = await sql`
      select name from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
	const inserted = await sql`
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
		shop: biz.name
	});
	const send = await (await import("./send-oXxmCk-B.mjs")).sendWhatsappText(phone, confirmBody, {
		token: rows[0].wa_token,
		phoneId: rows[0].wa_phone_id,
		templateParams: [
			cust[0].name,
			biz.name,
			svc[0]?.name ?? "Service",
			parts.date,
			parts.time
		]
	});
	await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${cust[0].id}, ${inserted[0].id}, 'out', ${confirmBody}, ${send.simulated})
    `;
	if (send.ok) await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'sent', ${confirmBody}, now())
      `;
	else await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, error)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'failed', ${confirmBody}, ${send.error ?? "failed"})
      `;
	return loadDashboard(context.userId);
});
var runReminderSweep_createServerFn_handler = createServerRpc({
	id: "80d6851dd4b07c494b01010ef47535d8aa0ee282b1a5c3057343c4302a50e605",
	name: "runReminderSweep",
	filename: "src/lib/booking/api.ts"
}, (opts) => runReminderSweep.__executeServer(opts));
var runReminderSweep = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(runReminderSweep_createServerFn_handler, async ({ context }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where user_id = ${context.userId} limit 1`;
	if (!rows[0]) throw new Error("No business");
	const due = await sql`
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
		const result = await (await import("./send-oXxmCk-B.mjs")).sendWhatsappText(job.phone, job.body, {
			token: rows[0].wa_token,
			phoneId: rows[0].wa_phone_id
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
		} else await sql`
          update reminder_jobs set status = 'failed', error = ${result.error ?? "failed"}
          where id = ${job.id} and business_id = ${rows[0].id}
        `;
	}
	return {
		...await loadDashboard(context.userId),
		sweep: {
			sent,
			simulated
		}
	};
});
var sendBookingReminder_createServerFn_handler = createServerRpc({
	id: "69b13543496e7e243f46577d1661eb7def3dab8f2a6267dd1ec09b4dece6131a",
	name: "sendBookingReminder",
	filename: "src/lib/booking/api.ts"
}, (opts) => sendBookingReminder.__executeServer(opts));
var sendBookingReminder = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(sendBookingReminder_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where user_id = ${context.userId} limit 1`;
	if (!rows[0]) throw new Error("No business");
	const shop = await persistClinicWhatsapp(sql, rows[0]);
	const biz = mapBusiness(shop);
	const booking = await sql`
      select b.id, b.starts_at::text as starts_at, b.status, c.id as customer_id,
             c.name as customer_name, c.phone, s.name as service_name
      from bookings b
      join customers c on c.id = b.customer_id
      join services s on s.id = b.service_id
      where b.id = ${data.bookingId} and b.business_id = ${biz.id}
      limit 1
    `;
	if (!booking[0]) throw new Error("Booking not found");
	if (booking[0].status === "cancelled" || booking[0].status === "noshow") throw new Error("That booking is already closed");
	const body = fillTemplate(biz.lang === "ur" ? biz.templateUr : biz.templateEn, {
		name: booking[0].customer_name,
		service: booking[0].service_name,
		...fmtParts(booking[0].starts_at, biz.timezone),
		shop: biz.name
	});
	const result = await (await import("./send-oXxmCk-B.mjs")).sendWhatsappText(booking[0].phone, body, {
		token: shop.wa_token,
		phoneId: shop.wa_phone_id
	});
	if (!result.ok) throw new Error(result.error || "WhatsApp send failed");
	await sql`
      insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
      values (${biz.id}, ${booking[0].id}, 'manual', now(), 'sent', ${body}, now())
    `;
	await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${booking[0].customer_id}, ${booking[0].id}, 'out', ${body}, ${result.simulated})
    `;
	return {
		...await loadDashboard(context.userId),
		sent: { simulated: result.simulated }
	};
});
var simulateInbound_createServerFn_handler = createServerRpc({
	id: "49070142af5e39b0c98049e1bd479874062d846c1a4b9d3338cf51bb9d3932f1",
	name: "simulateInbound",
	filename: "src/lib/booking/api.ts"
}, (opts) => simulateInbound.__executeServer(opts));
var simulateInbound = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((d) => d).handler(simulateInbound_createServerFn_handler, async ({ context, data }) => {
	const sql = await db();
	const biz = await sql`select id from businesses where user_id = ${context.userId} limit 1`;
	if (!biz[0]) throw new Error("No business");
	const b = await sql`
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
	if (status === "cancelled") await sql`
        update reminder_jobs set status = 'skipped'
        where booking_id = ${b[0].id} and status = 'queued'
      `;
	return loadDashboard(context.userId);
});
var getPublicShop_createServerFn_handler = createServerRpc({
	id: "d9ceac3c79e85f4840e39a8cab52a96ee32fc5dcddd2684bec74842bcd9827d8",
	name: "getPublicShop",
	filename: "src/lib/booking/api.ts"
}, (opts) => getPublicShop.__executeServer(opts));
var getPublicShop = createServerFn({ method: "GET" }).validator((d) => d).handler(getPublicShop_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where slug = ${data.slug} limit 1`;
	if (!rows[0]) return null;
	const biz = mapBusiness(rows[0]);
	const services = (await sql`
        select id, name, duration_min, price_pkr, coalesce(category, 'General') as category
        from services where business_id = ${biz.id} order by category, id
      `).map((s) => ({
		id: s.id,
		name: s.name,
		durationMin: Number(s.duration_min),
		pricePkr: Number(s.price_pkr),
		category: s.category || "General"
	}));
	const staff = await sql`select id, name from staff where business_id = ${biz.id} order by id`;
	return {
		business: {
			name: biz.name,
			slug: biz.slug,
			hours: biz.hours,
			timezone: biz.timezone
		},
		services,
		staff
	};
});
var getPublicSlots_createServerFn_handler = createServerRpc({
	id: "1ced372dd5aacd686ef5abbe685c07d2d030113387d10367f3495592a70b613f",
	name: "getPublicSlots",
	filename: "src/lib/booking/api.ts"
}, (opts) => getPublicSlots.__executeServer(opts));
var getPublicSlots = createServerFn({ method: "GET" }).validator((d) => d).handler(getPublicSlots_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where slug = ${data.slug} limit 1`;
	if (!rows[0]) return {
		slots: [],
		reason: "shop_not_found"
	};
	const biz = mapBusiness(rows[0]);
	const svc = await sql`
      select duration_min from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
	if (!svc[0]) return {
		slots: [],
		reason: "service_not_found"
	};
	const [y, m, d] = data.date.split("-").map(Number);
	const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1, 12, 0, 0));
	const day = new Intl.DateTimeFormat("en-US", {
		timeZone: biz.timezone,
		weekday: "short"
	}).format(date);
	const dow = {
		Sun: 0,
		Mon: 1,
		Tue: 2,
		Wed: 3,
		Thu: 4,
		Fri: 5,
		Sat: 6
	}[day] ?? 0;
	const hours = biz.hours.find((h) => h.day === dow);
	if (!hours || hours.closed) return {
		slots: [],
		reason: "closed",
		dayName: day
	};
	const duration = Number(svc[0].duration_min) + biz.bufferMinutes;
	const taken = await sql`
      select starts_at::text as starts_at from bookings
      where business_id = ${biz.id}
        and status not in ('cancelled', 'noshow')
    `;
	const takenSet = new Set(taken.filter((t) => ymdInJs(t.starts_at, biz.timezone) === data.date).map((t) => new Date(t.starts_at).toISOString()));
	const slots = [];
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
		if (!takenSet.has(iso) && new Date(iso).getTime() > Date.now()) slots.push(iso);
		minutes += duration;
	}
	return {
		slots,
		reason: slots.length > 0 ? void 0 : totalGenerated > 0 ? "past_or_booked" : "short_hours",
		open: hours.open,
		close: hours.close,
		dayName: day
	};
});
var createPublicBooking_createServerFn_handler = createServerRpc({
	id: "34981fb2e11c2bacfd84d7ed2373b8e7537b2010d80e7eaf4cbe37736ad39144",
	name: "createPublicBooking",
	filename: "src/lib/booking/api.ts"
}, (opts) => createPublicBooking.__executeServer(opts));
var createPublicBooking = createServerFn({ method: "POST" }).validator((d) => d).handler(createPublicBooking_createServerFn_handler, async ({ data }) => {
	const sql = await db();
	const rows = await sql`select * from businesses where slug = ${data.slug} limit 1`;
	if (!rows[0]) throw new Error("Shop not found");
	const biz = mapBusiness(rows[0]);
	const phone = data.phone.replace(/\D/g, "");
	if (phone.length < 10) throw new Error("Enter a valid phone number");
	const name = data.name.trim();
	if (name.length < 2) throw new Error("Enter your name");
	let cust = await sql`
      select id, name from customers where business_id = ${biz.id} and phone = ${phone} limit 1
    `;
	if (!cust[0]) cust = await sql`
        insert into customers (business_id, name, phone) values (${biz.id}, ${name}, ${phone}) returning id, name
      `;
	if ((await sql`
      select id from bookings
      where business_id = ${biz.id} and starts_at = ${data.startsAt}::timestamptz
        and status not in ('cancelled', 'noshow')
      limit 1
    `)[0]) throw new Error("That time was just taken. Pick another slot.");
	const svc = await sql`
      select name from services where id = ${data.serviceId} and business_id = ${biz.id}
    `;
	const inserted = await sql`
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
		shop: biz.name
	});
	const send = await (await import("./send-oXxmCk-B.mjs")).sendWhatsappText(phone, confirmBody, {
		token: rows[0].wa_token,
		phoneId: rows[0].wa_phone_id,
		templateParams: [
			cust[0].name,
			biz.name,
			svc[0]?.name ?? "Service",
			parts.date,
			parts.time
		]
	});
	await sql`
      insert into wa_messages (business_id, customer_id, booking_id, direction, body, simulated)
      values (${biz.id}, ${cust[0].id}, ${inserted[0].id}, 'out', ${confirmBody}, ${send.simulated})
    `;
	if (send.ok) await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, sent_at)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'sent', ${confirmBody}, now())
      `;
	else await sql`
        insert into reminder_jobs (business_id, booking_id, kind, send_at, status, body, error)
        values (${biz.id}, ${inserted[0].id}, 'confirm', now(), 'failed', ${confirmBody}, ${send.error ?? "failed"})
      `;
	return {
		ok: true,
		simulated: send.simulated,
		shop: biz.name,
		whatsappOk: send.ok,
		whatsappError: send.error
	};
});
//#endregion
export { completeOnboarding_createServerFn_handler, createDashboardBooking_createServerFn_handler, createPublicBooking_createServerFn_handler, createStaff_createServerFn_handler, deleteService_createServerFn_handler, deleteStaff_createServerFn_handler, getDashboard_createServerFn_handler, getPublicShop_createServerFn_handler, getPublicSlots_createServerFn_handler, runReminderSweep_createServerFn_handler, saveSettings_createServerFn_handler, saveWhatsapp_createServerFn_handler, sendBookingReminder_createServerFn_handler, simulateInbound_createServerFn_handler, updateBookingStatus_createServerFn_handler, upsertService_createServerFn_handler };
