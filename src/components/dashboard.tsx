import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  CalendarDays,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  CreditCard,
  Link2,
  List,
  Loader2,
  Menu,
  MessageSquare,
  Pencil,
  Plus,
  Send,
  Stethoscope,
  Trash2,
  UserPlus,
  Users,
  UserX,
  X,
} from "lucide-react";
import { RedirectToSignIn, UserButton } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  createDashboardBooking,
  getDashboard,
  runReminderSweep,
  saveSettings,
  simulateInbound,
  updateBookingStatus,
  completeOnboarding,
  upsertService,
  deleteService,
  createStaff,
  deleteStaff,
  sendBookingReminder,
} from "@/lib/booking/api";
import type {
  BookingRow,
  BookingStatus,
  DashboardPayload,
  DayHours,
  Service,
} from "@/lib/booking/types";

type Page =
  | "overview"
  | "calendar"
  | "bookings"
  | "noshow"
  | "services"
  | "reminders"
  | "link"
  | "billing";

const NAV: { id: Page; label: string; icon: typeof Bell }[] = [
  { id: "overview", label: "Today", icon: CalendarDays },
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "bookings", label: "Bookings", icon: List },
  { id: "noshow", label: "No-shows", icon: UserX },
  { id: "services", label: "Services", icon: Stethoscope },
  { id: "reminders", label: "Reminders", icon: Bell },
  { id: "link", label: "Booking link", icon: Link2 },
  { id: "billing", label: "Billing", icon: CreditCard },
];

function money(n: number) {
  return `Rs ${n.toLocaleString("en-PK")}`;
}

function badge(status: BookingStatus) {
  const map: Record<BookingStatus, string> = {
    confirmed: "bg-accent-dim text-accent",
    pending: "bg-elevated text-warn",
    noshow: "bg-elevated text-danger",
    completed: "bg-elevated text-info",
    cancelled: "bg-elevated text-muted",
  };
  const label: Record<BookingStatus, string> = {
    confirmed: "Confirmed",
    pending: "Pending",
    noshow: "No-show",
    completed: "Done",
    cancelled: "Cancelled",
  };
  return (
    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[status]}`}>
      {label[status]}
    </span>
  );
}

function fmtTime(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(new Date(iso));
}

function fmtDate(iso: string, tz: string) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: tz,
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(iso));
}

function ymdInTz(d: Date, tz: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: tz,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(d);
}

function publicBookUrl(slug: string) {
  if (typeof window === "undefined") return `/book/${slug}`;
  return `${window.location.origin}/book/${slug}`;
}

export function Dashboard() {
  const { user, isPending } = useCurrentUserState();
  const [page, setPage] = useState<Page>("overview");
  const [data, setData] = useState<DashboardPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selected, setSelected] = useState<BookingRow | null>(null);

  function flash(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  async function reload() {
    const d = await getDashboard();
    setData(d);
  }

  useEffect(() => {
    if (isPending || !user) return;
    let live = true;
    getDashboard()
      .then((d) => {
        if (live) setData(d);
      })
      .catch((e: unknown) => {
        const msg = e instanceof Error ? e.message : "Could not load desk";
        if (msg === "Unauthorized") {
          window.location.href = "/login";
          return;
        }
        if (live) setError(msg);
      });
    const tick = window.setInterval(() => {
      void runReminderSweep()
        .then((d) => {
          if (live && d) setData(d);
        })
        .catch(() => undefined);
    }, 60_000);
    return () => {
      live = false;
      window.clearInterval(tick);
    };
  }, [isPending, user]);

  if (isPending) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-bg">
        <div className="h-10 w-40 animate-pulse rounded-lg bg-elevated" />
        <p className="text-sm text-muted">Loading desk</p>
      </div>
    );
  }
  if (!user) return <RedirectToSignIn />;
  if (error) {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
        <p className="text-sm text-muted">{error}</p>
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <Loader2 className="size-6 animate-spin text-muted" />
      </div>
    );
  }

  if (!data.business.onboarded) {
    return (
      <ClinicSetup
        busy={busy}
        onSave={async (name) => {
          setBusy(true);
          try {
            setData(await completeOnboarding({ data: { name } }));
          } catch (e) {
            setError(e instanceof Error ? e.message : "Could not save clinic");
          } finally {
            setBusy(false);
          }
        }}
      />
    );
  }

  const tz = data.business.timezone;
  const todayYmd = ymdInTz(new Date(), tz);
  const todayBookings = data.bookings.filter(
    (b) => ymdInTz(new Date(b.startsAt), tz) === todayYmd && b.status !== "cancelled",
  );

  async function act(fn: () => Promise<DashboardPayload>) {
    setBusy(true);
    try {
      setData(await fn());
    } catch (e) {
      flash(e instanceof Error ? e.message : "Action failed");
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<Page, [string, string]> = {
    overview: ["Today", "Bookings, no-shows, and your public link"],
    calendar: ["Calendar", "Week view across staff"],
    bookings: ["Bookings", "Search customers and history"],
    noshow: ["No-show stats", "The number you show other owners"],
    services: ["Services & hours", "Duration, price, and availability"],
    reminders: ["WhatsApp reminders", "Timing, copy, and the send queue"],
    link: ["Booking link", "Paste this in Instagram and WhatsApp status"],
    billing: ["Billing", "Your WaBook subscription"],
  };

  return (
    <div className="min-h-screen bg-bg text-fg">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-14 items-center gap-2.5 px-4">
          <div className="grid size-8 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-fg">
            W
          </div>
          <span className="font-semibold tracking-tight">WaBook</span>
        </div>
        <nav className="flex-1 space-y-0.5 px-2 py-2">
          {NAV.map((item) => {
            const Icon = item.icon;
            const on = page === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setPage(item.id)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${
                  on ? "bg-accent-dim text-accent" : "text-muted hover:bg-elevated hover:text-fg"
                }`}
              >
                <Icon className="size-4" />
                {item.label}
              </button>
            );
          })}
        </nav>
        <div className="border-t border-border p-3">
          <p className="truncate px-1 text-sm font-medium">{data.business.name}</p>
          <p className="px-1 text-xs text-muted">Pro plan</p>
        </div>
      </aside>

      {menuOpen ? (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            className="absolute inset-0 bg-bg/70"
            type="button"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 border-r border-border bg-surface p-3">
            <div className="mb-4 flex items-center justify-between">
              <span className="font-semibold">WaBook</span>
              <button type="button" onClick={() => setMenuOpen(false)} className="p-2 text-muted">
                <X className="size-5" />
              </button>
            </div>
            {NAV.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setPage(item.id);
                  setMenuOpen(false);
                }}
                className="block w-full rounded-md px-3 py-2.5 text-left text-sm text-fg hover:bg-elevated"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="md:pl-56">
        <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="rounded-md p-2 text-muted md:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Menu"
            >
              <Menu className="size-5" />
            </button>
            <div>
              <h1 className="text-sm font-semibold leading-tight">{titles[page][0]}</h1>
              <p className="hidden text-xs text-muted sm:block">{titles[page][1]}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden max-w-32 truncate text-xs text-muted sm:inline">
              {user?.displayName}
            </span>
            <UserButton />
          </div>
        </header>

        <main className="mx-auto max-w-6xl space-y-5 p-4 pb-24 sm:p-6">
          {page === "overview" ? (
            <Overview
              data={data}
              today={todayBookings}
              tz={tz}
              busy={busy}
              onStatus={(id, status) => act(() => updateBookingStatus({ data: { id, status } }))}
              onCopy={() => {
                void navigator.clipboard.writeText(publicBookUrl(data.business.slug));
                flash("Link copied");
              }}
              onOpenLink={() => setPage("link")}
              onSelect={setSelected}
              onRemind={(id) =>
                act(async () => {
                  const res = await sendBookingReminder({ data: { bookingId: id } });
                  flash(res.sent.simulated ? "Saved in log (WhatsApp still simulated)" : "Reminder sent on WhatsApp");
                  return res;
                })
              }
            />
          ) : null}
          {page === "calendar" ? (
            <CalendarView data={data} tz={tz} onSelect={setSelected} />
          ) : null}
          {page === "bookings" ? (
            <BookingsView
              data={data}
              tz={tz}
              onSelect={setSelected}
              onCreate={(payload) =>
                act(async () => {
                  const res = await createDashboardBooking({ data: payload });
                  flash("Appointment added! WhatsApp confirmation message dispatched.");
                  return res;
                })
              }
            />
          ) : null}
          {page === "noshow" ? <NoshowView data={data} /> : null}
          {page === "services" ? (
            <ServicesView
              data={data}
              onSaveHours={(hours, buffer, max) =>
                act(() =>
                  saveSettings({
                    data: { hours, bufferMinutes: buffer, maxPerSlot: max },
                  }),
                )
              }
              onSaveService={(s) =>
                act(async () => {
                  const res = await upsertService({ data: s });
                  flash(s.id ? `Updated service "${s.name}"` : `Added service "${s.name}"`);
                  return res;
                })
              }
              onDeleteService={(id) =>
                act(async () => {
                  const res = await deleteService({ data: { id } });
                  flash("Service deleted");
                  return res;
                })
              }
              onAddStaff={(name) => act(() => createStaff({ data: { name } }))}
              onDeleteStaff={(id) => act(() => deleteStaff({ data: { id } }))}
              onSaveName={(name) => act(() => saveSettings({ data: { name } }))}
            />
          ) : null}
          {page === "reminders" ? (
            <RemindersView
              data={data}
              busy={busy}
              onSave={(patch) => act(() => saveSettings({ data: patch }))}
              onSweep={async () => {
                setBusy(true);
                try {
                  const res = await runReminderSweep();
                  setData(res);
                  flash(
                    res.waConfigured
                      ? `Sent ${res.sweep.sent} reminders`
                      : `Queued ${res.sweep.sent} simulated WhatsApp messages`,
                  );
                } catch (e) {
                  flash(e instanceof Error ? e.message : "Sweep failed");
                } finally {
                  setBusy(false);
                }
              }}
              onSim={(bookingId, reply) =>
                act(() => simulateInbound({ data: { bookingId, reply } }))
              }
            />
          ) : null}
          {page === "link" ? (
            <LinkView
              slug={data.business.slug}
              onCopy={() => {
                void navigator.clipboard.writeText(publicBookUrl(data.business.slug));
                flash("Link copied");
              }}
            />
          ) : null}
          {page === "billing" ? <BillingView /> : null}
        </main>
      </div>

      {selected ? (
        <div className="fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4">
          <div className="w-full max-w-md rounded-xl border border-border bg-surface p-5">
            <div className="mb-4 flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selected.customerName}</h2>
                <p className="text-sm text-muted">{selected.customerPhone}</p>
              </div>
              <button type="button" onClick={() => setSelected(null)} className="p-1 text-muted">
                <X className="size-5" />
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted">Service</dt>
                <dd>{selected.serviceName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">When</dt>
                <dd>
                  {fmtDate(selected.startsAt, tz)} · {fmtTime(selected.startsAt, tz)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Staff</dt>
                <dd>{selected.staffName}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Status</dt>
                <dd>{badge(selected.status)}</dd>
              </div>
            </dl>
            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
                onClick={() => {
                  void act(() =>
                    updateBookingStatus({ data: { id: selected.id, status: "completed" } }),
                  );
                  setSelected(null);
                }}
              >
                Mark done
              </button>
              <button
                type="button"
                className="rounded-md border border-border px-3 py-2 text-sm"
                onClick={() => {
                  void act(() =>
                    updateBookingStatus({ data: { id: selected.id, status: "noshow" } }),
                  );
                  setSelected(null);
                }}
              >
                No-show
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div className="fixed bottom-5 right-5 z-50 rounded-lg border border-border bg-elevated px-4 py-2 text-sm shadow-lg">
          {toast}
        </div>
      ) : null}
      {busy ? (
        <div className="pointer-events-none fixed bottom-5 left-5 z-50">
          <Loader2 className="size-5 animate-spin text-muted" />
        </div>
      ) : null}
    </div>
  );
}

function Overview({
  data,
  today,
  tz,
  busy,
  onStatus,
  onCopy,
  onOpenLink,
  onSelect,
  onRemind,
}: {
  data: DashboardPayload;
  today: BookingRow[];
  tz: string;
  busy: boolean;
  onStatus: (id: number, status: BookingStatus) => void;
  onCopy: () => void;
  onOpenLink: () => void;
  onSelect: (b: BookingRow) => void;
  onRemind: (id: number) => void;
}) {
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <Stat
          label="Bookings today"
          value={String(data.stats.bookingsToday)}
          hint={`${today.filter((b) => b.status === "confirmed").length} confirmed`}
        />
        <Stat
          label="No-shows this week"
          value={`${data.stats.noshowsWeek} / ${data.stats.bookingsWeek}`}
          hint="After reminders went live"
          accent
        />
        <Stat
          label="Est. revenue today"
          value={money(data.stats.revenueToday)}
          hint="Excludes no-shows"
        />
      </div>

      <div className="flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent-dim/40 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">Public booking link</p>
          <p className="mt-0.5 font-mono text-sm text-accent">{publicBookUrl(data.business.slug)}</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
          >
            <Copy className="size-4" /> Copy
          </button>
          <button
            type="button"
            onClick={onOpenLink}
            className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
          >
            QR code
          </button>
        </div>
      </div>

      <section className="overflow-hidden rounded-xl border border-border bg-surface">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold">Today’s bookings</h2>
          <span className="text-xs text-muted">By time</span>
        </div>
        {today.length === 0 ? (
          <p className="px-4 py-8 text-sm text-muted">No bookings yet today.</p>
        ) : (
          <ul className="divide-y divide-border">
            {today.map((b) => (
              <li key={b.id} className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
                <button type="button" className="text-left" onClick={() => onSelect(b)}>
                  <p className="font-medium">{b.customerName}</p>
                  <p className="text-xs text-muted">
                    {b.serviceName} · {b.staffName}
                  </p>
                </button>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="tabular text-sm">{fmtTime(b.startsAt, tz)}</span>
                  {badge(b.status)}
                  {b.status === "pending" || b.status === "confirmed" ? (
                    <button
                      type="button"
                      disabled={busy}
                      title="Send reminder"
                      className="grid size-9 place-items-center rounded-md bg-accent text-accent-fg"
                      onClick={() => onRemind(b.id)}
                    >
                      <Send className="size-4" />
                    </button>
                  ) : null}
                  <button
                    type="button"
                    disabled={busy}
                    title="Done"
                    className="grid size-9 place-items-center rounded-md bg-elevated text-info"
                    onClick={() => onStatus(b.id, "completed")}
                  >
                    <Check className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    title="No-show"
                    className="grid size-9 place-items-center rounded-md bg-elevated text-danger"
                    onClick={() => onStatus(b.id, "noshow")}
                  >
                    <UserX className="size-4" />
                  </button>
                  <button
                    type="button"
                    disabled={busy}
                    title="Cancel"
                    className="grid size-9 place-items-center rounded-md bg-elevated text-muted"
                    onClick={() => onStatus(b.id, "cancelled")}
                  >
                    <X className="size-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Stat({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border p-4 ${accent ? "border-danger/30 bg-surface" : "border-border bg-surface"}`}
    >
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular tracking-tight">{value}</p>
      <p className="mt-2 text-xs text-muted">{hint}</p>
    </div>
  );
}

function CalendarView({
  data,
  tz,
  onSelect,
}: {
  data: DashboardPayload;
  tz: string;
  onSelect: (b: BookingRow) => void;
}) {
  const [offset, setOffset] = useState(0);
  const start = useMemo(() => {
    const d = new Date();
    d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + offset * 7);
    d.setHours(0, 0, 0, 0);
    return d;
  }, [offset]);
  const days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <button type="button" className="rounded-md border border-border p-2" onClick={() => setOffset((o) => o - 1)}>
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-sm font-medium">
          {fmtDate(days[0].toISOString(), tz)} – {fmtDate(days[6].toISOString(), tz)}
        </p>
        <button type="button" className="rounded-md border border-border p-2" onClick={() => setOffset((o) => o + 1)}>
          <ChevronRight className="size-4" />
        </button>
      </div>
      <div className="grid grid-cols-2 gap-2 overflow-x-auto sm:grid-cols-4 lg:grid-cols-7">
        {days.map((day) => {
          const key = ymdInTz(day, tz);
          const items = data.bookings.filter(
            (b) => ymdInTz(new Date(b.startsAt), tz) === key && b.status !== "cancelled",
          );
          const isToday = key === ymdInTz(new Date(), tz);
          return (
            <div
              key={key}
              className={`min-h-40 rounded-lg border p-2 ${isToday ? "border-accent/40 bg-accent-dim/30" : "border-border bg-surface"}`}
            >
              <p className="mb-2 text-xs font-medium text-muted">
                {day.toLocaleDateString("en-GB", { weekday: "short", day: "numeric" })}
              </p>
              <div className="space-y-1.5">
                {items.map((b) => (
                  <button
                    key={b.id}
                    type="button"
                    onClick={() => onSelect(b)}
                    className="block w-full rounded-md bg-elevated px-2 py-1.5 text-left text-[11px]"
                  >
                    <span className="block truncate font-medium">
                      {fmtTime(b.startsAt, tz)} {b.customerName.split(" ")[0]}
                    </span>
                    <span className="text-muted">{b.serviceName}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BookingsView({
  data,
  tz,
  onSelect,
  onCreate,
}: {
  data: DashboardPayload;
  tz: string;
  onSelect: (b: BookingRow) => void;
  onCreate: (d: {
    customerName: string;
    phone: string;
    serviceId: number;
    staffId: number;
    startsAt: string;
  }) => void;
}) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [form, setForm] = useState({
    customerName: "",
    phone: "",
    serviceId: data.services[0]?.id ?? 0,
    staffId: data.staff[0]?.id ?? 0,
    startsAt: "",
  });
  const filtered = data.bookings.filter((b) => {
    const hay = `${b.customerName} ${b.customerPhone} ${b.serviceName}`.toLowerCase();
    if (q && !hay.includes(q.toLowerCase())) return false;
    if (status !== "all" && b.status !== status) return false;
    return true;
  });

  return (
    <div className="space-y-5">
      <form
        className="grid gap-2 rounded-xl border border-border bg-surface p-4 sm:grid-cols-6"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.startsAt) return;
          onCreate({ ...form, startsAt: new Date(form.startsAt).toISOString() });
        }}
      >
        <input
          required
          placeholder="Customer name"
          value={form.customerName}
          onChange={(e) => setForm({ ...form, customerName: e.target.value })}
          className="rounded-md border border-border bg-elevated px-3 py-2 text-sm sm:col-span-2"
        />
        <input
          required
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="rounded-md border border-border bg-elevated px-3 py-2 text-sm"
        />
        <select
          value={form.serviceId}
          onChange={(e) => setForm({ ...form, serviceId: Number(e.target.value) })}
          className="rounded-md border border-border bg-elevated px-3 py-2 text-sm"
        >
          {data.services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <select
          value={form.staffId}
          onChange={(e) => setForm({ ...form, staffId: Number(e.target.value) })}
          className="rounded-md border border-border bg-elevated px-3 py-2 text-sm"
        >
          {data.staff.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
        <div className="flex gap-2">
          <input
            required
            type="datetime-local"
            value={form.startsAt}
            onChange={(e) => setForm({ ...form, startsAt: e.target.value })}
            className="flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg">
            Add
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <input
          placeholder="Search name or phone"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          className="min-w-48 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
        />
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="rounded-md border border-border bg-surface px-3 py-2 text-sm"
        >
          <option value="all">All status</option>
          <option value="confirmed">Confirmed</option>
          <option value="pending">Pending</option>
          <option value="noshow">No-show</option>
          <option value="completed">Done</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border border-border bg-surface">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs text-muted">
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Service</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium">Staff</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">No-shows</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((b) => {
              const c = data.customers.find((x) => x.id === b.customerId);
              return (
                <tr key={b.id} className="border-b border-border/70">
                  <td className="px-4 py-3">
                    <button type="button" className="text-left" onClick={() => onSelect(b)}>
                      <p className="font-medium">{b.customerName}</p>
                      <p className="text-xs text-muted">{b.customerPhone}</p>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-muted">{b.serviceName}</td>
                  <td className="px-4 py-3">
                    {fmtDate(b.startsAt, tz)} {fmtTime(b.startsAt, tz)}
                  </td>
                  <td className="px-4 py-3 text-muted">{b.staffName}</td>
                  <td className="px-4 py-3">{badge(b.status)}</td>
                  <td className="px-4 py-3">
                    <span className={c && c.noshows > 2 ? "font-medium text-danger" : "text-muted"}>
                      {c?.visits ?? 0} / {c?.noshows ?? 0}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function NoshowView({ data }: { data: DashboardPayload }) {
  const offenders = [...data.customers].sort((a, b) => b.noshows - a.noshows).slice(0, 5);
  const confirmRate =
    data.stats.remindersSentMonth === 0
      ? 0
      : Math.round((data.stats.confirmedViaReminder / Math.max(1, data.stats.remindersSentMonth)) * 100);
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Stat
          label="No-show rate this month"
          value={`${data.stats.noshowRateMonth}%`}
          hint={`Last month ${data.stats.noshowRateLastMonth}%`}
        />
        <Stat label="Reminders sent" value={String(data.stats.remindersSentMonth)} hint="This month" />
        <Stat label="Confirmed via reminder" value={`${confirmRate}%`} hint="Of reminded bookings" />
        <Stat
          label="Est. revenue recovered"
          value={money(data.stats.revenueRecovered)}
          hint="From prevented no-shows"
        />
      </div>
      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Repeat no-shows</h2>
        <ul className="space-y-2">
          {offenders.map((c) => (
            <li key={c.id} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-2">
              <div>
                <p className="text-sm font-medium">{c.name}</p>
                <p className="text-xs text-muted">{c.phone}</p>
              </div>
              <p className="text-sm">
                <span className="text-danger">{c.noshows}</span>
                <span className="text-muted"> / {c.visits} visits</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function ServicesView({
  data,
  onSaveHours,
  onSaveService,
  onDeleteService,
  onAddStaff,
  onDeleteStaff,
  onSaveName,
}: {
  data: DashboardPayload;
  onSaveHours: (hours: DayHours[], buffer: number, max: number) => void;
  onSaveService: (s: { id?: number; name: string; durationMin: number; pricePkr: number; category?: string }) => void;
  onDeleteService: (id: number) => void;
  onAddStaff: (name: string) => void;
  onDeleteStaff: (id: number) => void;
  onSaveName: (name: string) => void;
}) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const [hours, setHours] = useState(data.business.hours);
  const [buffer, setBuffer] = useState(data.business.bufferMinutes);
  const [max, setMax] = useState(data.business.maxPerSlot);
  const [clinicName, setClinicName] = useState(data.business.name);
  const [staffName, setStaffName] = useState("");
  const [draft, setDraft] = useState({ name: "", durationMin: 30, pricePkr: 1000, category: "Dental" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState<{
    id: number;
    name: string;
    durationMin: number;
    pricePkr: number;
    category: string;
  } | null>(null);

  const groups = ["Dental", "Aesthetic", "General"].filter((g) =>
    data.services.some((s) => (s.category || "General") === g),
  );
  const extra = [...new Set(data.services.map((s) => s.category || "General"))].filter(
    (g) => !["Dental", "Aesthetic", "General"].includes(g),
  );

  function startEdit(s: Service) {
    setEditingId(s.id);
    setEditDraft({
      id: s.id,
      name: s.name,
      durationMin: s.durationMin,
      pricePkr: s.pricePkr,
      category: s.category || "General",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setEditDraft(null);
  }

  function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editDraft || !editDraft.name.trim()) return;
    onSaveService({
      id: editDraft.id,
      name: editDraft.name.trim(),
      durationMin: Number(editDraft.durationMin) || 15,
      pricePkr: Number(editDraft.pricePkr) || 0,
      category: editDraft.category.trim() || "General",
    });
    setEditingId(null);
    setEditDraft(null);
  }

  return (
    <div className="space-y-6">
      <form
        className="flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end"
        onSubmit={(e) => {
          e.preventDefault();
          onSaveName(clinicName.trim());
        }}
      >
        <label className="flex-1 text-sm">
          Clinic name
          <input
            required
            value={clinicName}
            onChange={(e) => setClinicName(e.target.value)}
            className="mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-fg"
          />
        </label>
        <button type="submit" className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg">
          Save name
        </button>
      </form>

      {/* Staff & Practitioners Section */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <Users className="size-5 text-accent" />
          <div>
            <h2 className="text-base font-semibold">Staff & Practitioners</h2>
            <p className="text-xs text-muted">
              Add or remove clinic practitioners. These appear directly in the public booking form and appointment calendar.
            </p>
          </div>
        </div>

        <div className="mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {data.staff.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between gap-2 rounded-lg border border-border bg-elevated px-3 py-2.5"
            >
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{s.name}</p>
                <p className="text-[11px] text-muted">Doctor / Staff</p>
              </div>
              <button
                type="button"
                onClick={() => onDeleteStaff(s.id)}
                className="rounded p-1.5 text-muted hover:bg-surface hover:text-danger"
                title="Remove staff member"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          {data.staff.length === 0 && (
            <p className="col-span-full py-2 text-xs text-muted">
              No staff members yet. Add doctors or practitioners below to allow patients to book with them.
            </p>
          )}
        </div>

        <form
          className="flex flex-wrap items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (!staffName.trim()) return;
            onAddStaff(staffName.trim());
            setStaffName("");
          }}
        >
          <input
            required
            placeholder="e.g. Dr. Ayesha Siddiqui (BDS)"
            value={staffName}
            onChange={(e) => setStaffName(e.target.value)}
            className="min-w-[200px] flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
          />
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-fg"
          >
            <UserPlus className="size-4" /> Add practitioner
          </button>
        </form>
      </section>

      {/* Services List with inline editing */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold">Services & Treatments</h2>
            <p className="text-xs text-muted">
              Click the pencil icon on any service to edit its name, duration, price, or category.
            </p>
          </div>
        </div>

        {[...groups, ...extra].map((g) => {
          const list = data.services.filter((s) => (s.category || "General") === g);
          if (list.length === 0) return null;
          return (
            <div key={g} className="space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
                {g} ({list.length})
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((s) => {
                  const isEditing = editingId === s.id && editDraft;
                  if (isEditing) {
                    return (
                      <form
                        key={s.id}
                        onSubmit={saveEdit}
                        className="flex flex-col justify-between rounded-xl border-2 border-accent bg-elevated/70 p-4 shadow-md space-y-3"
                      >
                        <div className="flex items-center justify-between border-b border-border/80 pb-2">
                          <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent">
                            <Pencil className="size-3" /> Edit Service
                          </span>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded p-1 text-muted hover:bg-surface hover:text-fg transition-colors"
                            title="Cancel edit"
                          >
                            <X className="size-3.5" />
                          </button>
                        </div>

                        <div className="space-y-2.5">
                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-muted">Service Name</label>
                            <input
                              required
                              type="text"
                              value={editDraft.name}
                              onChange={(e) => setEditDraft({ ...editDraft, name: e.target.value })}
                              placeholder="Service name"
                              className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-fg focus:border-accent focus:outline-none"
                              autoFocus
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-muted">Duration (min)</label>
                              <input
                                required
                                type="number"
                                min={5}
                                step={5}
                                value={editDraft.durationMin}
                                onChange={(e) => setEditDraft({ ...editDraft, durationMin: Number(e.target.value) })}
                                className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:outline-none"
                              />
                            </div>
                            <div>
                              <label className="mb-1 block text-[11px] font-medium text-muted">Price (PKR)</label>
                              <input
                                required
                                type="number"
                                min={0}
                                step={100}
                                value={editDraft.pricePkr}
                                onChange={(e) => setEditDraft({ ...editDraft, pricePkr: Number(e.target.value) })}
                                className="w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:outline-none"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="mb-1 block text-[11px] font-medium text-muted">Category</label>
                            <div className="flex gap-1.5">
                              <select
                                value={["Dental", "Aesthetic", "General"].includes(editDraft.category) ? editDraft.category : "__custom__"}
                                onChange={(e) => {
                                  if (e.target.value === "__custom__") {
                                    setEditDraft({ ...editDraft, category: "" });
                                  } else {
                                    setEditDraft({ ...editDraft, category: e.target.value });
                                  }
                                }}
                                className="rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-fg focus:border-accent focus:outline-none"
                              >
                                <option value="Dental">Dental</option>
                                <option value="Aesthetic">Aesthetic</option>
                                <option value="General">General</option>
                                <option value="__custom__">Custom category...</option>
                              </select>
                              {!["Dental", "Aesthetic", "General"].includes(editDraft.category) && (
                                <input
                                  required
                                  placeholder="Category name"
                                  value={editDraft.category}
                                  onChange={(e) => setEditDraft({ ...editDraft, category: e.target.value })}
                                  className="flex-1 min-w-0 rounded-md border border-border bg-surface px-2 py-1 text-xs text-fg focus:border-accent focus:outline-none"
                                />
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/80">
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-fg transition-colors"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90 transition-opacity"
                          >
                            <Check className="size-3.5" /> Save changes
                          </button>
                        </div>
                      </form>
                    );
                  }

                  return (
                    <div
                      key={s.id}
                      className="group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:shadow-sm"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <p className="font-medium text-fg leading-snug">{s.name}</p>
                          <div className="flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => startEdit(s)}
                              className="rounded p-1.5 text-muted hover:bg-elevated hover:text-accent transition-colors"
                              title={`Edit ${s.name}`}
                            >
                              <Pencil className="size-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${s.name}"?`)) {
                                  onDeleteService(s.id);
                                }
                              }}
                              className="rounded p-1.5 text-muted hover:bg-elevated hover:text-danger transition-colors"
                              title="Delete service"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded bg-elevated px-2 py-0.5 text-xs text-muted">
                            {s.durationMin} min
                          </span>
                          {s.category && (
                            <span className="rounded bg-elevated/70 px-2 py-0.5 text-[11px] text-muted">
                              {s.category}
                            </span>
                          )}
                        </div>
                      </div>
                      <p className="mt-3 text-sm font-semibold text-accent">{money(s.pricePkr)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}

        {data.services.length === 0 && (
          <p className="py-4 text-center text-sm text-muted">
            No services configured yet. Add your first service below.
          </p>
        )}
      </section>

      {/* Add New Service */}
      <section className="rounded-xl border border-border bg-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <Plus className="size-5 text-accent" />
          <div>
            <h2 className="text-base font-semibold">Add New Service</h2>
            <p className="text-xs text-muted">
              Add a new service or procedure to your clinic's offerings.
            </p>
          </div>
        </div>
        <form
          className="flex flex-wrap items-center gap-2.5"
          onSubmit={(e) => {
            e.preventDefault();
            if (!draft.name.trim()) return;
            onSaveService({
              name: draft.name.trim(),
              durationMin: Number(draft.durationMin) || 15,
              pricePkr: Number(draft.pricePkr) || 0,
              category: draft.category.trim() || "General",
            });
            setDraft({ name: "", durationMin: 30, pricePkr: 1000, category: "Dental" });
          }}
        >
          <input
            required
            placeholder="Service name (e.g. Scaling & Polishing)"
            value={draft.name}
            onChange={(e) => setDraft({ ...draft, name: e.target.value })}
            className="min-w-[200px] flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
          />
          <div className="relative">
            <input
              type="number"
              min={5}
              step={5}
              value={draft.durationMin}
              onChange={(e) => setDraft({ ...draft, durationMin: Number(e.target.value) })}
              className="w-28 rounded-md border border-border bg-elevated px-3 py-2 pr-10 text-sm text-fg"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">min</span>
          </div>
          <div className="relative">
            <input
              type="number"
              min={0}
              step={100}
              value={draft.pricePkr}
              onChange={(e) => setDraft({ ...draft, pricePkr: Number(e.target.value) })}
              className="w-32 rounded-md border border-border bg-elevated px-3 py-2 pr-10 text-sm text-fg"
            />
            <span className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted">PKR</span>
          </div>
          <div className="flex items-center gap-1.5">
            <select
              value={["Dental", "Aesthetic", "General"].includes(draft.category) ? draft.category : "__custom__"}
              onChange={(e) => {
                if (e.target.value === "__custom__") {
                  setDraft({ ...draft, category: "" });
                } else {
                  setDraft({ ...draft, category: e.target.value });
                }
              }}
              className="rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
            >
              <option value="Dental">Dental</option>
              <option value="Aesthetic">Aesthetic</option>
              <option value="General">General</option>
              <option value="__custom__">Custom category...</option>
            </select>
            {!["Dental", "Aesthetic", "General"].includes(draft.category) && (
              <input
                required
                placeholder="Category name"
                value={draft.category}
                onChange={(e) => setDraft({ ...draft, category: e.target.value })}
                className="w-36 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
              />
            )}
          </div>
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90 transition-opacity"
          >
            <Plus className="size-4" /> Add service
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Working hours</h2>
        <div className="space-y-2">
          {hours.map((h) => (
            <div key={h.day} className="flex flex-wrap items-center gap-3">
              <label className="flex w-28 items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={!h.closed}
                  onChange={(e) =>
                    setHours((prev) =>
                      prev.map((x) => (x.day === h.day ? { ...x, closed: !e.target.checked } : x)),
                    )
                  }
                />
                {days[h.day]}
              </label>
              <input
                type="time"
                disabled={h.closed}
                value={h.open}
                onChange={(e) =>
                  setHours((prev) => prev.map((x) => (x.day === h.day ? { ...x, open: e.target.value } : x)))
                }
                className="rounded-md border border-border bg-elevated px-2 py-1.5 text-sm disabled:opacity-40"
              />
              <span className="text-muted">to</span>
              <input
                type="time"
                disabled={h.closed}
                value={h.close}
                onChange={(e) =>
                  setHours((prev) => prev.map((x) => (x.day === h.day ? { ...x, close: e.target.value } : x)))
                }
                className="rounded-md border border-border bg-elevated px-2 py-1.5 text-sm disabled:opacity-40"
              />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-4">
          <label className="text-sm text-muted">
            Buffer
            <input
              type="number"
              value={buffer}
              onChange={(e) => setBuffer(Number(e.target.value))}
              className="ml-2 w-20 rounded-md border border-border bg-elevated px-2 py-1 text-fg"
            />
            min
          </label>
          <label className="text-sm text-muted">
            Max / slot
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(Number(e.target.value))}
              className="ml-2 w-16 rounded-md border border-border bg-elevated px-2 py-1 text-fg"
            />
          </label>
          <button
            type="button"
            onClick={() => onSaveHours(hours, buffer, max)}
            className="rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
          >
            Save hours
          </button>
        </div>
      </section>
    </div>
  );
}

function RemindersView({
  data,
  busy,
  onSave,
  onSweep,
  onSim,
}: {
  data: DashboardPayload;
  busy: boolean;
  onSave: (p: {
    remind24h?: boolean;
    remind2h?: boolean;
    remindMorning?: boolean;
    templateEn?: string;
    templateUr?: string;
    lang?: "en" | "ur";
  }) => void;
  onSweep: () => void;
  onSim: (bookingId: number, reply: "YES" | "NO") => void;
}) {
  const [en, setEn] = useState(data.business.templateEn);
  const [ur, setUr] = useState(data.business.templateUr);
  const [lang, setLang] = useState<"en" | "ur">(data.business.lang);
  const pending = data.bookings.filter((b) => b.status === "pending");

  return (
    <div className="space-y-5">
      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-semibold">WhatsApp Cloud API</h2>
            <p className="mt-1 text-sm text-muted">
              WhatsApp is connected for this clinic. Tap send on a booking, or send all due reminders.
            </p>
          </div>
          <button
            type="button"
            disabled={busy}
            onClick={onSweep}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
          >
            <Send className="size-4" />
            Send due reminders
          </button>
        </div>
      </div>

      <div className="space-y-2 rounded-xl border border-border bg-surface p-4">
        {(
          [
            ["remind24h", "24 hours before", data.business.remind24h],
            ["remind2h", "2 hours before", data.business.remind2h],
            ["remindMorning", "Morning of appointment", data.business.remindMorning],
          ] as const
        ).map(([key, label, on]) => (
          <label key={key} className="flex items-center justify-between rounded-lg bg-elevated px-3 py-3 text-sm">
            {label}
            <input
              type="checkbox"
              checked={on}
              onChange={(e) => onSave({ [key]: e.target.checked })}
            />
          </label>
        ))}
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="mb-3 flex gap-2">
          <button
            type="button"
            onClick={() => setLang("en")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${lang === "en" ? "bg-accent text-accent-fg" : "bg-elevated text-muted"}`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLang("ur")}
            className={`rounded-md px-3 py-1.5 text-xs font-medium ${lang === "ur" ? "bg-accent text-accent-fg" : "bg-elevated text-muted"}`}
          >
            اردو
          </button>
        </div>
        <textarea
          rows={7}
          value={lang === "en" ? en : ur}
          onChange={(e) => (lang === "en" ? setEn(e.target.value) : setUr(e.target.value))}
          className="w-full rounded-lg border border-border bg-elevated px-3 py-2 font-mono text-sm"
          dir={lang === "ur" ? "rtl" : "ltr"}
        />
        <p className="mt-2 text-xs text-muted">{"Variables: {{name}} {{service}} {{date}} {{time}} {{shop}}"}</p>
        <button
          type="button"
          onClick={() => onSave({ templateEn: en, templateUr: ur, lang })}
          className="mt-3 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg"
        >
          Save template
        </button>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 text-sm font-semibold">Simulate customer reply</h2>
        {pending.length === 0 ? (
          <p className="text-sm text-muted">No pending bookings.</p>
        ) : (
          <ul className="space-y-2">
            {pending.slice(0, 6).map((b) => (
              <li key={b.id} className="flex flex-wrap items-center justify-between gap-2 rounded-lg bg-elevated px-3 py-2">
                <span className="text-sm">
                  {b.customerName} · {b.serviceName}
                </span>
                <span className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => onSim(b.id, "YES")}
                    className="rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-fg"
                  >
                    YES
                  </button>
                  <button
                    type="button"
                    onClick={() => onSim(b.id, "NO")}
                    className="rounded-md border border-border px-2 py-1 text-xs"
                  >
                    NO
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <h2 className="mb-3 inline-flex items-center gap-2 text-sm font-semibold">
          <MessageSquare className="size-4" /> Message log
        </h2>
        <ul className="max-h-72 space-y-2 overflow-y-auto">
          {data.messages.length === 0 ? (
            <li className="text-sm text-muted">Run a sweep to generate the first messages.</li>
          ) : (
            data.messages.map((m) => (
              <li key={m.id} className="rounded-lg bg-elevated px-3 py-2 text-sm">
                <div className="flex justify-between text-xs text-muted">
                  <span>
                    {m.direction === "out" ? "Out" : "In"} · {m.customerName ?? "Unknown"}
                    {m.simulated ? " · simulated" : ""}
                  </span>
                </div>
                <p className="mt-1 whitespace-pre-wrap text-fg/90">{m.body}</p>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

function LinkView({ slug, onCopy }: { slug: string; onCopy: () => void }) {
  const url = publicBookUrl(slug);
  const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=0b0e0c&color=2bd576&data=${encodeURIComponent(url)}`;
  return (
    <div className="mx-auto max-w-lg space-y-6 text-center">
      <p className="text-sm text-muted">Share this everywhere — Instagram bio, WhatsApp status, reception desk.</p>
      <div className="rounded-xl border border-accent/30 bg-surface p-6">
        <p className="break-all font-mono text-lg text-accent">{url}</p>
        <div className="mt-4 flex justify-center gap-2">
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg"
          >
            <Copy className="size-4" /> Copy link
          </button>
          <a
            href={qr}
            download="wabook-qr.png"
            className="rounded-md border border-border px-4 py-2 text-sm"
          >
            Download QR
          </a>
        </div>
      </div>
      <img src={qr} alt="Booking QR code" className="mx-auto rounded-xl border border-border bg-bg p-3" width={240} height={240} />
    </div>
  );
}

function BillingView() {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <div className="rounded-xl border border-border bg-surface p-5 lg:col-span-2">
        <p className="text-sm text-muted">Current plan</p>
        <p className="mt-1 text-2xl font-semibold">Pro · Rs 2,999 / month</p>
        <p className="mt-2 text-sm text-muted">Renews 14 Oct 2026</p>
      </div>
      <div className="rounded-xl border border-border bg-elevated p-5">
        <p className="text-sm font-medium">Business</p>
        <p className="mt-1 text-xl font-semibold">Rs 4,999 / mo</p>
        <ul className="mt-3 space-y-1 text-sm text-muted">
          <li>Unlimited staff</li>
          <li>Priority WhatsApp queue</li>
          <li>Custom domain</li>
        </ul>
      </div>
    </div>
  );
}

function ClinicSetup({ onSave, busy }: { onSave: (name: string) => void; busy: boolean }) {
  const [name, setName] = useState("");
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-4">
      <form
        className="w-full max-w-md space-y-5 rounded-2xl border border-border bg-surface p-6"
        onSubmit={(e) => {
          e.preventDefault();
          onSave(name);
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider text-accent">WaBook</p>
        <h1 className="text-2xl font-semibold tracking-tight">Name your clinic</h1>
        <p className="text-sm text-muted">
          This is what patients see on the booking link and in WhatsApp reminders. You can change it later.
        </p>
        <label className="block text-sm">
          Clinic name
          <input
            autoFocus
            required
            minLength={2}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Hashir Dental & Aesthetic Clinic"
            className="mt-1.5 w-full rounded-md border border-border bg-elevated px-3 py-2.5 text-fg"
          />
        </label>
        <button
          type="submit"
          disabled={busy || name.trim().length < 2}
          className="w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-accent-fg disabled:opacity-50"
        >
          {busy ? "Saving…" : "Continue"}
        </button>
      </form>
    </div>
  );
}
