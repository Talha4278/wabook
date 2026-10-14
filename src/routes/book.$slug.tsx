import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { createPublicBooking, getPublicShop, getPublicSlots } from "@/lib/booking/api";
import type { DayHours } from "@/lib/booking/types";

export const Route = createFileRoute("/book/$slug")({ component: PublicBook });

function formatTime12h(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

function formatHoursSummary(hours?: DayHours[]): string {
  if (!hours || hours.length === 0) return "Consultation hours by appointment";
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const openDays = hours.filter((h) => !h.closed);
  if (openDays.length === 0) return "Temporarily closed";

  // Check if open days share the same hours
  const first = openDays[0];
  const sameHours = openDays.every((h) => h.open === first.open && h.close === first.close);
  const timeSpan = sameHours ? `${formatTime12h(first.open)} – ${formatTime12h(first.close)}` : "";

  // Check common Mon-Sat pattern
  const closedSun = hours.find((h) => h.day === 0)?.closed;
  const monToSatOpen = [1, 2, 3, 4, 5, 6].every((d) => !hours.find((h) => h.day === d)?.closed);
  if (monToSatOpen && closedSun && sameHours) {
    return `Mon–Sat ${timeSpan} (Sun Closed)`;
  }

  // All 7 days open
  if (openDays.length === 7 && sameHours) {
    return `Mon–Sun ${timeSpan}`;
  }

  const daysStr = openDays.map((h) => dayNames[h.day]).join(", ");
  return `${daysStr} ${timeSpan}`.trim();
}

function getTodayYmd(tz: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function getNextDayYmd(currentYmd: string) {
  const [y, m, d] = currentYmd.split("-").map(Number);
  const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
  date.setUTCDate(date.getUTCDate() + 1);
  return date.toISOString().slice(0, 10);
}

function PublicBook() {
  const { slug } = Route.useParams();
  const [shop, setShop] = useState<Awaited<ReturnType<typeof getPublicShop>> | undefined>(
    undefined,
  );
  const [serviceId, setServiceId] = useState<number | null>(null);
  const [staffId, setStaffId] = useState<number | null>(null);
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [slotData, setSlotData] = useState<{
    slots: string[];
    reason?: "closed" | "past_or_booked" | "short_hours" | "shop_not_found" | "service_not_found";
    open?: string;
    close?: string;
    dayName?: string;
  }>({ slots: [] });
  const [startsAt, setStartsAt] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [done, setDone] = useState<{
    shop: string;
    simulated: boolean;
    whatsappOk?: boolean;
    whatsappError?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    getPublicShop({ data: { slug } }).then((s) => {
      setShop(s);
      if (s?.services[0]) setServiceId(s.services[0].id);
      if (s?.staff[0]) setStaffId(s.staff[0].id);

      if (s?.business) {
        const tz = s.business.timezone || "Asia/Karachi";
        const todayYmd = getTodayYmd(tz);
        const timeInTz = new Intl.DateTimeFormat("en-GB", {
          timeZone: tz,
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }).format(new Date());

        const dayName = new Intl.DateTimeFormat("en-US", { timeZone: tz, weekday: "short" }).format(new Date());
        const map: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };
        const dow = map[dayName] ?? 0;
        const todayHours = s.business.hours?.find((h) => h.day === dow);

        // If today is closed or past closing hours in clinic timezone, advance initial date to tomorrow
        if (!todayHours || todayHours.closed || (todayHours.close && timeInTz >= todayHours.close)) {
          setDate(getNextDayYmd(todayYmd));
        } else {
          setDate(todayYmd);
        }
      }
    });
  }, [slug]);

  useEffect(() => {
    if (!serviceId) return;
    getPublicSlots({ data: { slug, date, serviceId } }).then((r) => {
      setSlotData(r);
      setStartsAt("");
    });
  }, [slug, date, serviceId]);

  const categories = useMemo(() => {
    if (!shop?.services) return [];
    return Array.from(new Set(shop.services.map((s) => s.category || "General")));
  }, [shop?.services]);

  if (shop === undefined) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg text-muted">Loading…</main>
    );
  }
  if (!shop) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <p className="text-fg">This booking link is not active yet.</p>
      </main>
    );
  }

  if (done) {
    return (
      <main className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <div className="max-w-md">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-accent/20 text-accent">
            ✓
          </div>
          <h1 className="text-2xl font-semibold text-fg">Appointment Requested</h1>
          <p className="mt-2 text-sm text-muted">
            {done.shop} has successfully recorded your booking request.
          </p>

          {done.whatsappError ? (
            <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs text-amber-200">
              <strong className="block font-semibold text-amber-300">WhatsApp Notification Note:</strong>
              <p className="mt-1">{done.whatsappError}</p>
            </div>
          ) : done.simulated ? (
            <p className="mt-3 text-xs text-muted">
              A WhatsApp confirmation notification has been recorded in the clinic system.
            </p>
          ) : (
            <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-left text-xs text-accent-fg">
              <p className="font-medium text-accent">Confirmation dispatched to WhatsApp!</p>
              <p className="mt-1 text-muted">Please check your WhatsApp and reply <strong>YES</strong> to confirm your slot.</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  const svc = shop.services.find((s) => s.id === serviceId);
  const hoursSubtitle = formatHoursSummary(shop.business.hours);
  const tz = shop.business.timezone || "Asia/Karachi";

  return (
    <main className="min-h-screen bg-bg px-4 py-10 text-fg">
      <div className="mx-auto w-full max-w-md">
        <p className="text-xs font-medium uppercase tracking-wider text-accent">Book on WhatsApp</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{shop.business.name}</h1>
        <p className="mt-2 text-sm text-muted">
          {hoursSubtitle}. We will message you on WhatsApp to confirm.
        </p>

        <form
          className="mt-8 space-y-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!serviceId || !startsAt) return;
            const chosenStaffId = staffId || shop.staff[0]?.id || 0;
            setBusy(true);
            setError(null);
            try {
              const res = await createPublicBooking({
                data: { slug, name, phone, serviceId, staffId: chosenStaffId, startsAt },
              });
              setDone({
                shop: res.shop,
                simulated: res.simulated,
                whatsappOk: res.whatsappOk,
                whatsappError: res.whatsappError,
              });
            } catch (err) {
              setError(err instanceof Error ? err.message : "Could not complete booking");
            } finally {
              setBusy(false);
            }
          }}
        >
          {/* Dynamic Service selection */}
          <label className="block text-sm">
            <span className="text-muted">Select Treatment / Service</span>
            <select
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg"
              value={serviceId ?? ""}
              onChange={(e) => setServiceId(Number(e.target.value))}
            >
              {categories.map((cat) => {
                const items = shop.services.filter((s) => (s.category || "General") === cat);
                if (!items.length) return null;
                return (
                  <optgroup key={cat} label={cat}>
                    {items.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name} · Rs {s.pricePkr.toLocaleString("en-PK")} · {s.durationMin}m
                      </option>
                    ))}
                  </optgroup>
                );
              })}
            </select>
          </label>

          {/* Dynamic Staff selection */}
          {shop.staff.length > 0 ? (
            <label className="block text-sm">
              <span className="text-muted">Practitioner / Doctor</span>
              <select
                className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg"
                value={staffId ?? ""}
                onChange={(e) => setStaffId(Number(e.target.value))}
              >
                {shop.staff.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </label>
          ) : (
            <div className="rounded-md border border-border bg-surface/50 p-2 text-xs text-muted">
              General Practitioner assigned
            </div>
          )}

          {/* Appointment Date */}
          <label className="block text-sm">
            <span className="text-muted">Date</span>
            <input
              type="date"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </label>

          {/* Appointment Time Slots */}
          <div>
            <p className="text-sm text-muted">Available Time</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {slotData.slots.length === 0 ? (
                <div className="w-full rounded-lg border border-border bg-surface/70 p-3 text-sm text-muted">
                  {slotData.reason === "closed" ? (
                    <p>The clinic is <strong>closed on {slotData.dayName || "this day"}</strong>.</p>
                  ) : slotData.reason === "past_or_booked" ? (
                    <p>All appointment slots for this date have either ended or are fully booked.</p>
                  ) : (
                    <p>No open slots available for this service on this date.</p>
                  )}
                  <button
                    type="button"
                    onClick={() => setDate(getNextDayYmd(date))}
                    className="mt-2.5 inline-flex items-center rounded bg-accent/20 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/30"
                  >
                    Check next day →
                  </button>
                </div>
              ) : (
                slotData.slots.map((iso) => {
                  const label = new Intl.DateTimeFormat("en-GB", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                    timeZone: tz,
                  }).format(new Date(iso));
                  const on = startsAt === iso;
                  return (
                    <button
                      key={iso}
                      type="button"
                      onClick={() => setStartsAt(iso)}
                      className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                        on
                          ? "bg-accent text-accent-fg"
                          : "border border-border bg-surface hover:bg-elevated text-fg"
                      }`}
                    >
                      {label}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Patient Details */}
          <label className="block text-sm">
            <span className="text-muted">Your Name</span>
            <input
              required
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Ali Ahmed"
            />
          </label>
          <label className="block text-sm">
            <span className="text-muted">WhatsApp Number</span>
            <input
              required
              inputMode="tel"
              className="mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="03XXXXXXXXX"
            />
          </label>

          {svc ? (
            <p className="text-sm text-muted">
              {svc.name} · Rs {svc.pricePkr.toLocaleString("en-PK")}
            </p>
          ) : null}

          {error ? <p className="text-sm text-danger">{error}</p> : null}

          <button
            type="submit"
            disabled={busy || !startsAt}
            className="w-full rounded-md bg-accent py-3 text-sm font-semibold text-accent-fg disabled:opacity-50"
          >
            {busy ? "Booking…" : "Request appointment"}
          </button>
        </form>
      </div>
    </main>
  );
}
