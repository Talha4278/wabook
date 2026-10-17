import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime, v as Navigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronLeft, C as Flame, D as Clock, E as Copy, F as Building2, I as Bell, L as Award, M as Check, N as CheckCheck, O as CircleCheck, P as CalendarDays, R as ArrowRight, S as Link2, T as CreditCard, _ as MessageSquare, a as UserPlus, b as LoaderCircle, c as Trash2, d as ShieldCheck, f as Send, g as Pencil, h as Percent, i as UserX, j as ChevronDown, k as ChevronRight, l as Stethoscope, m as PhoneCall, n as X, p as Plus, r as Users, s as TrendingUp, t as Zap, u as Sparkles, v as Menu, w as ExternalLink, x as List, y as LogOut } from "../_libs/lucide-react.mjs";
import { _ as updateBookingStatus, c as deleteStaff, f as runReminderSweep, h as simulateInbound, i as createDashboardBooking, l as getDashboard, m as sendBookingReminder, o as createStaff, p as saveSettings, r as completeOnboarding, s as deleteService, v as upsertService } from "./router-rMwRF8UO.mjs";
import { i as signOut, t as authClient } from "./client-DaPSa0yY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CtpyEaT_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Client-readable marker for gate-materialized sessions ("Sign in with Grok"
* zero-click sessions minted by `gate-session.server.ts`). Signing out of a
* gate session is a no-op — the next request re-materializes it from
* `x-grok-identity` — so `UserButton` uses this to hide its sign-out control.
* `__Host-` prefixed like the other auth cookies: browsers reject a `__Host-`
* cookie carrying a `Domain`, so an untrusted sibling `*.grok.me` app cannot
* plant a parent-domain copy that the host-only clear could never expire.
* Client-safe: no server imports.
*/
var GATE_SESSION_MARKER_COOKIE = "__Host-grok_gate_session";
function hasGateSessionMarker() {
	if (typeof document === "undefined") return false;
	return document.cookie.split(";").some((pair) => pair.trim().startsWith(`${GATE_SESSION_MARKER_COOKIE}=`));
}
/**
* Current user + loading state. Same behavior in live preview and when deployed:
*   - Auth enabled -> the real signed-in user; `user` is `null` while
*                            the session resolves (`isPending: true`) and when
*                            signed out (`isPending: false`). Session comes from
*                            Better Auth `useSession()` → `/api/auth/get-session`
*                            (cookie when deployed; bearer in live preview).
*   - Auth disabled (`VITE_AUTH_ENABLED=false`) -> `DEV_USER`, never pending.
*
* Protect a route by waiting out `isPending` before acting on `user` —
* redirecting on `user: null` alone bounces signed-in visitors to sign-in on
* every hard reload:
*
*   import { RedirectToSignIn } from "@/lib/auth/gates";
*   const { user, isPending } = useCurrentUserState();
*   if (isPending) return null;              // still resolving — don't redirect yet
*   if (!user) return <RedirectToSignIn />;  // definitely signed out
*
* `authEnabled` is a module-level constant fixed at load, so the guarded hook
* call keeps a stable hook order across every render of a given component.
*/
function useCurrentUserState() {
	const [mounted, setMounted] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		if (typeof window !== "undefined") try {
			window.localStorage.removeItem("wabook_dev_mode");
		} catch {}
	}, []);
	const session = authClient.useSession();
	if (!mounted) return {
		user: null,
		isPending: true
	};
	const realUser = session.data?.user;
	if (realUser) return {
		user: {
			id: realUser.id,
			displayName: realUser.name ?? null,
			primaryEmail: realUser.email ?? null,
			profileImageUrl: realUser.image ?? null,
			isDevFallback: false
		},
		isPending: false
	};
	return {
		user: null,
		isPending: session.isPending
	};
}
/**
* Convenience view of `useCurrentUserState().user` for display (e.g.
* `user?.displayName ?? "Guest"`). NOTE: `null` means *loading OR signed out* —
* for redirects/guards use `useCurrentUserState()` and check `isPending`.
*/
function useCurrentUser() {
	return useCurrentUserState().user;
}
var subscribeToNothing = () => () => {};
var noGateSessionOnServer = () => false;
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* With auth on, visitors are signed out until they authenticate — in the sandbox
* live preview too, which does real sign-in. The shared dev user appears only
* when auth is disabled (`VITE_AUTH_ENABLED=false`, the shipped default).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
/**
* Minimal signed-in identity chip + sign-out. Restyle freely (see the
* `design-ui` skill). Sign-out is only shown when auth is enabled (the
* disabled-auth dev user has nothing to sign out of) and the session is not
* gate-materialized — behind the gate the next request signs the viewer
* straight back in, so a sign-out control there is a broken loop.
*/
function UserButton() {
	const user = useCurrentUser();
	const [signingOut, setSigningOut] = (0, import_react.useState)(false);
	const gateSession = (0, import_react.useSyncExternalStore)(subscribeToNothing, hasGateSessionMarker, noGateSessionOnServer);
	if (!user) return null;
	const label = user.displayName ?? user.primaryEmail ?? "Account";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [
			user.profileImageUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: user.profileImageUrl,
				alt: "",
				className: "h-8 w-8 rounded-full object-cover"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "grid h-8 w-8 place-items-center rounded-full bg-black/10 text-sm font-medium dark:bg-white/20",
				children: label.charAt(0).toUpperCase()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-sm font-medium",
				children: label
			}),
			!gateSession && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				disabled: signingOut,
				onClick: () => {
					setSigningOut(true);
					signOut().catch(() => setSigningOut(false));
				},
				className: "cursor-pointer text-sm underline-offset-4 opacity-70 hover:underline disabled:cursor-wait disabled:no-underline",
				children: signingOut ? "Signing out…" : "Sign out"
			})
		]
	});
}
var NAV = [
	{
		id: "overview",
		label: "Today",
		icon: CalendarDays
	},
	{
		id: "calendar",
		label: "Calendar",
		icon: CalendarDays
	},
	{
		id: "bookings",
		label: "Bookings",
		icon: List
	},
	{
		id: "noshow",
		label: "No-shows",
		icon: UserX
	},
	{
		id: "services",
		label: "Services",
		icon: Stethoscope
	},
	{
		id: "reminders",
		label: "Reminders",
		icon: Bell
	},
	{
		id: "link",
		label: "Booking link",
		icon: Link2
	},
	{
		id: "billing",
		label: "Billing",
		icon: CreditCard
	}
];
function money(n) {
	return `Rs ${n.toLocaleString("en-PK")}`;
}
function badge(status) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-2 py-0.5 text-xs font-medium ${{
			confirmed: "bg-accent-dim text-accent",
			pending: "bg-elevated text-warn",
			noshow: "bg-elevated text-danger",
			completed: "bg-elevated text-info",
			cancelled: "bg-elevated text-muted"
		}[status]}`,
		children: {
			confirmed: "Confirmed",
			pending: "Pending",
			noshow: "No-show",
			completed: "Done",
			cancelled: "Cancelled"
		}[status]
	});
}
function fmtTime(iso, tz) {
	return new Intl.DateTimeFormat("en-GB", {
		timeZone: tz,
		hour: "numeric",
		minute: "2-digit",
		hour12: true
	}).format(new Date(iso));
}
function fmtDate(iso, tz) {
	return new Intl.DateTimeFormat("en-GB", {
		timeZone: tz,
		weekday: "short",
		day: "numeric",
		month: "short"
	}).format(new Date(iso));
}
function ymdInTz(d, tz) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(d);
}
function publicBookUrl(slug) {
	if (typeof window === "undefined") return `/book/${slug}`;
	return `${window.location.origin}/book/${slug}`;
}
function Dashboard() {
	const { user, isPending } = useCurrentUserState();
	const [page, setPage] = (0, import_react.useState)("overview");
	const [data, setData] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [menuOpen, setMenuOpen] = (0, import_react.useState)(false);
	const [selected, setSelected] = (0, import_react.useState)(null);
	function flash(msg) {
		setToast(msg);
		setTimeout(() => setToast(null), 2400);
	}
	(0, import_react.useEffect)(() => {
		if (isPending || !user) return;
		let live = true;
		getDashboard().then((d) => {
			if (live) setData(d);
		}).catch((e) => {
			const msg = e instanceof Error ? e.message : "Could not load desk";
			if (msg === "Unauthorized") {
				window.location.href = "/login";
				return;
			}
			if (live) setError(msg);
		});
		const tick = window.setInterval(() => {
			runReminderSweep().then((d) => {
				if (live && d) setData(d);
			}).catch(() => void 0);
		}, 6e4);
		return () => {
			live = false;
			window.clearInterval(tick);
		};
	}, [isPending, user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-lg bg-elevated" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Loading desk"
		})]
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: error
		})
	});
	if (!data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-bg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted" })
	});
	if (!data.business.onboarded) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClinicSetup, {
		busy,
		onSave: async (payload) => {
			setBusy(true);
			try {
				setData(await completeOnboarding({ data: payload }));
			} catch (e) {
				setError(e instanceof Error ? e.message : "Could not save clinic");
			} finally {
				setBusy(false);
			}
		}
	});
	const tz = data.business.timezone;
	const todayYmd = ymdInTz(/* @__PURE__ */ new Date(), tz);
	const todayBookings = data.bookings.filter((b) => ymdInTz(new Date(b.startsAt), tz) === todayYmd && b.status !== "cancelled");
	async function act(fn) {
		setBusy(true);
		try {
			setData(await fn());
		} catch (e) {
			flash(e instanceof Error ? e.message : "Action failed");
		} finally {
			setBusy(false);
		}
	}
	const titles = {
		overview: ["Today", "Bookings, no-shows, and your public link"],
		calendar: ["Calendar", "Week view across staff"],
		bookings: ["Bookings", "Search customers and history"],
		noshow: ["No-show stats", "The number you show other owners"],
		services: ["Services & hours", "Duration, price, and availability"],
		reminders: ["WhatsApp reminders", "Timing, copy, and the send queue"],
		link: ["Booking link", "Paste this in Instagram and WhatsApp status"],
		billing: ["Billing", "Your WaBook subscription"]
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 flex-col border-r border-border bg-surface md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex h-14 items-center gap-2.5 px-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-8 place-items-center rounded-md bg-accent text-sm font-semibold text-accent-fg",
							children: "W"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold tracking-tight",
							children: "WaBook"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex-1 space-y-0.5 px-2 py-2",
						children: NAV.map((item) => {
							const Icon = item.icon;
							const on = page === item.id;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setPage(item.id),
								className: `flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors ${on ? "bg-accent-dim text-accent" : "text-muted hover:bg-elevated hover:text-fg"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), item.label]
							}, item.id);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "border-t border-border p-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "truncate px-1 text-sm font-medium",
							children: data.business.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-1 text-xs text-muted",
							children: "Pro plan"
						})]
					})
				]
			}),
			menuOpen ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "fixed inset-0 z-40 md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "absolute inset-0 bg-bg/70",
					type: "button",
					"aria-label": "Close menu",
					onClick: () => setMenuOpen(false)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "absolute inset-y-0 left-0 w-64 border-r border-border bg-surface p-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 flex items-center justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-semibold",
							children: "WaBook"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setMenuOpen(false),
							className: "p-2 text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
						})]
					}), NAV.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							setPage(item.id);
							setMenuOpen(false);
						},
						className: "block w-full rounded-md px-3 py-2.5 text-left text-sm text-fg hover:bg-elevated",
						children: item.label
					}, item.id))]
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "md:pl-56",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-bg/90 px-4 backdrop-blur",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "rounded-md p-2 text-muted md:hidden",
							onClick: () => setMenuOpen(true),
							"aria-label": "Menu",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-sm font-semibold leading-tight",
							children: titles[page][0]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "hidden text-xs text-muted sm:block",
							children: titles[page][1]
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden max-w-32 truncate text-xs text-muted sm:inline",
							children: user?.displayName
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserButton, {})]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "mx-auto max-w-6xl space-y-5 p-4 pb-24 sm:p-6",
					children: [
						page === "overview" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Overview, {
							data,
							today: todayBookings,
							tz,
							busy,
							onStatus: (id, status) => act(() => updateBookingStatus({ data: {
								id,
								status
							} })),
							onCopy: () => {
								navigator.clipboard.writeText(publicBookUrl(data.business.slug));
								flash("Link copied");
							},
							onOpenLink: () => setPage("link"),
							onSelect: setSelected,
							onRemind: (id) => act(async () => {
								const res = await sendBookingReminder({ data: { bookingId: id } });
								flash(res.sent.simulated ? "Saved in log (WhatsApp still simulated)" : "Reminder sent on WhatsApp");
								return res;
							})
						}) : null,
						page === "calendar" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarView, {
							data,
							tz,
							onSelect: setSelected
						}) : null,
						page === "bookings" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookingsView, {
							data,
							tz,
							onSelect: setSelected,
							onCreate: (payload) => act(async () => {
								const res = await createDashboardBooking({ data: payload });
								flash("Appointment added! WhatsApp confirmation message dispatched.");
								return res;
							})
						}) : null,
						page === "noshow" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NoshowView, { data }) : null,
						page === "services" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ServicesView, {
							data,
							onSaveHours: (hours, buffer, max) => act(() => saveSettings({ data: {
								hours,
								bufferMinutes: buffer,
								maxPerSlot: max
							} })),
							onSaveService: (s) => act(async () => {
								const res = await upsertService({ data: s });
								flash(s.id ? `Updated service "${s.name}"` : `Added service "${s.name}"`);
								return res;
							}),
							onDeleteService: (id) => act(async () => {
								const res = await deleteService({ data: { id } });
								flash("Service deleted");
								return res;
							}),
							onAddStaff: (name) => act(() => createStaff({ data: { name } })),
							onDeleteStaff: (id) => act(() => deleteStaff({ data: { id } })),
							onSaveName: (name) => act(() => saveSettings({ data: { name } }))
						}) : null,
						page === "reminders" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RemindersView, {
							data,
							busy,
							onSave: (patch) => act(() => saveSettings({ data: patch })),
							onSweep: async () => {
								setBusy(true);
								try {
									const res = await runReminderSweep();
									setData(res);
									flash(res.waConfigured ? `Sent ${res.sweep.sent} reminders` : `Queued ${res.sweep.sent} simulated WhatsApp messages`);
								} catch (e) {
									flash(e instanceof Error ? e.message : "Sweep failed");
								} finally {
									setBusy(false);
								}
							},
							onSim: (bookingId, reply) => act(() => simulateInbound({ data: {
								bookingId,
								reply
							} }))
						}) : null,
						page === "link" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LinkView, {
							slug: data.business.slug,
							onCopy: () => {
								navigator.clipboard.writeText(publicBookUrl(data.business.slug));
								flash("Link copied");
							}
						}) : null,
						page === "billing" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BillingView, {}) : null
					]
				})]
			}),
			selected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 grid place-items-center bg-bg/70 p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-4 flex items-start justify-between",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-semibold",
								children: selected.customerName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: selected.customerPhone
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setSelected(null),
								className: "p-1 text-muted",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Service"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: selected.serviceName })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "When"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", { children: [
										fmtDate(selected.startsAt, tz),
										" · ",
										fmtTime(selected.startsAt, tz)
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Staff"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: selected.staffName })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-muted",
										children: "Status"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: badge(selected.status) })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-5 flex flex-wrap gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
								onClick: () => {
									act(() => updateBookingStatus({ data: {
										id: selected.id,
										status: "completed"
									} }));
									setSelected(null);
								},
								children: "Mark done"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "rounded-md border border-border px-3 py-2 text-sm",
								onClick: () => {
									act(() => updateBookingStatus({ data: {
										id: selected.id,
										status: "noshow"
									} }));
									setSelected(null);
								},
								children: "No-show"
							})]
						})
					]
				})
			}) : null,
			toast ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed bottom-5 right-5 z-50 rounded-lg border border-border bg-elevated px-4 py-2 text-sm shadow-lg",
				children: toast
			}) : null,
			busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "pointer-events-none fixed bottom-5 left-5 z-50",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-5 animate-spin text-muted" })
			}) : null
		]
	});
}
function Overview({ data, today, tz, busy, onStatus, onCopy, onOpenLink, onSelect, onRemind }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Bookings today",
						value: String(data.stats.bookingsToday),
						hint: `${today.filter((b) => b.status === "confirmed").length} confirmed`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "No-shows this week",
						value: `${data.stats.noshowsWeek} / ${data.stats.bookingsWeek}`,
						hint: "After reminders went live",
						accent: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
						label: "Est. revenue today",
						value: money(data.stats.revenueToday),
						hint: "Excludes no-shows"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 rounded-xl border border-accent/30 bg-accent-dim/40 p-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Public booking link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-0.5 font-mono text-sm text-accent",
					children: publicBookUrl(data.business.slug)
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onCopy,
						className: "inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpenLink,
						className: "rounded-md border border-border bg-surface px-3 py-2 text-sm",
						children: "QR code"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "overflow-hidden rounded-xl border border-border bg-surface",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "Today’s bookings"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-muted",
						children: "By time"
					})]
				}), today.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-8 text-sm text-muted",
					children: "No bookings yet today."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "divide-y divide-border",
					children: today.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "text-left",
							onClick: () => onSelect(b),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: b.customerName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs text-muted",
								children: [
									b.serviceName,
									" · ",
									b.staffName
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "tabular text-sm",
									children: fmtTime(b.startsAt, tz)
								}),
								badge(b.status),
								b.status === "pending" || b.status === "confirmed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									title: "Send reminder",
									className: "grid size-9 place-items-center rounded-md bg-accent text-accent-fg",
									onClick: () => onRemind(b.id),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" })
								}) : null,
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									title: "Done",
									className: "grid size-9 place-items-center rounded-md bg-elevated text-info",
									onClick: () => onStatus(b.id, "completed"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									title: "No-show",
									className: "grid size-9 place-items-center rounded-md bg-elevated text-danger",
									onClick: () => onStatus(b.id, "noshow"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserX, { className: "size-4" })
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									disabled: busy,
									title: "Cancel",
									className: "grid size-9 place-items-center rounded-md bg-elevated text-muted",
									onClick: () => onStatus(b.id, "cancelled"),
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" })
								})
							]
						})]
					}, b.id))
				})]
			})
		]
	});
}
function Stat({ label, value, hint, accent }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-xl border p-4 ${accent ? "border-danger/30 bg-surface" : "border-border bg-surface"}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-3xl font-semibold tabular tracking-tight",
				children: value
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted",
				children: hint
			})
		]
	});
}
function CalendarView({ data, tz, onSelect }) {
	const [offset, setOffset] = (0, import_react.useState)(0);
	const start = (0, import_react.useMemo)(() => {
		const d = /* @__PURE__ */ new Date();
		d.setDate(d.getDate() - (d.getDay() + 6) % 7 + offset * 7);
		d.setHours(0, 0, 0, 0);
		return d;
	}, [offset]);
	const days = Array.from({ length: 7 }, (_, i) => {
		const d = new Date(start);
		d.setDate(start.getDate() + i);
		return d;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md border border-border p-2",
					onClick: () => setOffset((o) => o - 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm font-medium",
					children: [
						fmtDate(days[0].toISOString(), tz),
						" – ",
						fmtDate(days[6].toISOString(), tz)
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-md border border-border p-2",
					onClick: () => setOffset((o) => o + 1),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 overflow-x-auto sm:grid-cols-4 lg:grid-cols-7",
			children: days.map((day) => {
				const key = ymdInTz(day, tz);
				const items = data.bookings.filter((b) => ymdInTz(new Date(b.startsAt), tz) === key && b.status !== "cancelled");
				const isToday = key === ymdInTz(/* @__PURE__ */ new Date(), tz);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `min-h-40 rounded-lg border p-2 ${isToday ? "border-accent/40 bg-accent-dim/30" : "border-border bg-surface"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mb-2 text-xs font-medium text-muted",
						children: day.toLocaleDateString("en-GB", {
							weekday: "short",
							day: "numeric"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-1.5",
						children: items.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => onSelect(b),
							className: "block w-full rounded-md bg-elevated px-2 py-1.5 text-left text-[11px]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block truncate font-medium",
								children: [
									fmtTime(b.startsAt, tz),
									" ",
									b.customerName.split(" ")[0]
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: b.serviceName
							})]
						}, b.id))
					})]
				}, key);
			})
		})]
	});
}
function BookingsView({ data, tz, onSelect, onCreate }) {
	const [q, setQ] = (0, import_react.useState)("");
	const [status, setStatus] = (0, import_react.useState)("all");
	const [form, setForm] = (0, import_react.useState)({
		customerName: "",
		phone: "",
		serviceId: data.services[0]?.id ?? 0,
		staffId: data.staff[0]?.id ?? 0,
		startsAt: ""
	});
	const filtered = data.bookings.filter((b) => {
		const hay = `${b.customerName} ${b.customerPhone} ${b.serviceName}`.toLowerCase();
		if (q && !hay.includes(q.toLowerCase())) return false;
		if (status !== "all" && b.status !== status) return false;
		return true;
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "grid gap-2 rounded-xl border border-border bg-surface p-4 sm:grid-cols-6",
				onSubmit: (e) => {
					e.preventDefault();
					if (!form.startsAt) return;
					onCreate({
						...form,
						startsAt: new Date(form.startsAt).toISOString()
					});
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Customer name",
						value: form.customerName,
						onChange: (e) => setForm({
							...form,
							customerName: e.target.value
						}),
						className: "rounded-md border border-border bg-elevated px-3 py-2 text-sm sm:col-span-2"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						placeholder: "Phone",
						value: form.phone,
						onChange: (e) => setForm({
							...form,
							phone: e.target.value
						}),
						className: "rounded-md border border-border bg-elevated px-3 py-2 text-sm"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: form.serviceId,
						onChange: (e) => setForm({
							...form,
							serviceId: Number(e.target.value)
						}),
						className: "rounded-md border border-border bg-elevated px-3 py-2 text-sm",
						children: data.services.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: form.staffId,
						onChange: (e) => setForm({
							...form,
							staffId: Number(e.target.value)
						}),
						className: "rounded-md border border-border bg-elevated px-3 py-2 text-sm",
						children: data.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s.id,
							children: s.name
						}, s.id))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							type: "datetime-local",
							value: form.startsAt,
							onChange: (e) => setForm({
								...form,
								startsAt: e.target.value
							}),
							className: "flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
							children: "Add"
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					placeholder: "Search name or phone",
					value: q,
					onChange: (e) => setQ(e.target.value),
					className: "min-w-48 flex-1 rounded-md border border-border bg-surface px-3 py-2 text-sm"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					value: status,
					onChange: (e) => setStatus(e.target.value),
					className: "rounded-md border border-border bg-surface px-3 py-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "all",
							children: "All status"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "confirmed",
							children: "Confirmed"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "pending",
							children: "Pending"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "noshow",
							children: "No-show"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "completed",
							children: "Done"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto rounded-xl border border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full min-w-[720px] text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-xs text-muted",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Customer"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "When"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Staff"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Status"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "No-shows"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: filtered.map((b) => {
						const c = data.customers.find((x) => x.id === b.customerId);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border/70",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "button",
										className: "text-left",
										onClick: () => onSelect(b),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-medium",
											children: b.customerName
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: b.customerPhone
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: b.serviceName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
									className: "px-4 py-3",
									children: [
										fmtDate(b.startsAt, tz),
										" ",
										fmtTime(b.startsAt, tz)
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted",
									children: b.staffName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: badge(b.status)
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: c && c.noshows > 2 ? "font-medium text-danger" : "text-muted",
										children: [
											c?.visits ?? 0,
											" / ",
											c?.noshows ?? 0
										]
									})
								})
							]
						}, b.id);
					}) })]
				})
			})
		]
	});
}
function NoshowView({ data }) {
	const offenders = [...data.customers].sort((a, b) => b.noshows - a.noshows).slice(0, 5);
	const confirmRate = data.stats.remindersSentMonth === 0 ? 0 : Math.round(data.stats.confirmedViaReminder / Math.max(1, data.stats.remindersSentMonth) * 100);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "No-show rate this month",
					value: `${data.stats.noshowRateMonth}%`,
					hint: `Last month ${data.stats.noshowRateLastMonth}%`
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Reminders sent",
					value: String(data.stats.remindersSentMonth),
					hint: "This month"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Confirmed via reminder",
					value: `${confirmRate}%`,
					hint: "Of reminded bookings"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stat, {
					label: "Est. revenue recovered",
					value: money(data.stats.revenueRecovered),
					hint: "From prevented no-shows"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface p-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mb-3 text-sm font-semibold",
				children: "Repeat no-shows"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "space-y-2",
				children: offenders.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between rounded-lg bg-elevated px-3 py-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: c.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: c.phone
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-danger",
							children: c.noshows
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-muted",
							children: [
								" / ",
								c.visits,
								" visits"
							]
						})]
					})]
				}, c.id))
			})]
		})]
	});
}
function ServicesView({ data, onSaveHours, onSaveService, onDeleteService, onAddStaff, onDeleteStaff, onSaveName }) {
	const days = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	const [hours, setHours] = (0, import_react.useState)(data.business.hours);
	const [buffer, setBuffer] = (0, import_react.useState)(data.business.bufferMinutes);
	const [max, setMax] = (0, import_react.useState)(data.business.maxPerSlot);
	const [clinicName, setClinicName] = (0, import_react.useState)(data.business.name);
	const [staffName, setStaffName] = (0, import_react.useState)("");
	const [draft, setDraft] = (0, import_react.useState)({
		name: "",
		durationMin: 30,
		pricePkr: 1e3,
		category: "Dental"
	});
	const [editingId, setEditingId] = (0, import_react.useState)(null);
	const [editDraft, setEditDraft] = (0, import_react.useState)(null);
	const groups = [
		"Dental",
		"Aesthetic",
		"General"
	].filter((g) => data.services.some((s) => (s.category || "General") === g));
	const extra = [...new Set(data.services.map((s) => s.category || "General"))].filter((g) => ![
		"Dental",
		"Aesthetic",
		"General"
	].includes(g));
	function startEdit(s) {
		setEditingId(s.id);
		setEditDraft({
			id: s.id,
			name: s.name,
			durationMin: s.durationMin,
			pricePkr: s.pricePkr,
			category: s.category || "General"
		});
	}
	function cancelEdit() {
		setEditingId(null);
		setEditDraft(null);
	}
	function saveEdit(e) {
		e.preventDefault();
		if (!editDraft || !editDraft.name.trim()) return;
		onSaveService({
			id: editDraft.id,
			name: editDraft.name.trim(),
			durationMin: Number(editDraft.durationMin) || 15,
			pricePkr: Number(editDraft.pricePkr) || 0,
			category: editDraft.category.trim() || "General"
		});
		setEditingId(null);
		setEditDraft(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-2 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-end",
				onSubmit: (e) => {
					e.preventDefault();
					onSaveName(clinicName.trim());
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex-1 text-sm",
					children: ["Clinic name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						required: true,
						value: clinicName,
						onChange: (e) => setClinicName(e.target.value),
						className: "mt-1 w-full rounded-md border border-border bg-elevated px-3 py-2 text-fg"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					className: "rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg",
					children: "Save name"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Staff & Practitioners"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Add or remove clinic practitioners. These appear directly in the public booking form and appointment calendar."
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3",
						children: [data.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2 rounded-lg border border-border bg-elevated px-3 py-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "truncate text-sm font-medium",
									children: s.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] text-muted",
									children: "Doctor / Staff"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onDeleteStaff(s.id),
								className: "rounded p-1.5 text-muted hover:bg-surface hover:text-danger",
								title: "Remove staff member",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
							})]
						}, s.id)), data.staff.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "col-span-full py-2 text-xs text-muted",
							children: "No staff members yet. Add doctors or practitioners below to allow patients to book with them."
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "flex flex-wrap items-center gap-2",
						onSubmit: (e) => {
							e.preventDefault();
							if (!staffName.trim()) return;
							onAddStaff(staffName.trim());
							setStaffName("");
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							placeholder: "e.g. Dr. Ayesha Siddiqui (BDS)",
							value: staffName,
							onChange: (e) => setStaffName(e.target.value),
							className: "min-w-[200px] flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "inline-flex items-center gap-1.5 rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-fg",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserPlus, { className: "size-4" }), " Add practitioner"]
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-between",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-base font-semibold",
							children: "Services & Treatments"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Click the pencil icon on any service to edit its name, duration, price, or category."
						})] })
					}),
					[...groups, ...extra].map((g) => {
						const list = data.services.filter((s) => (s.category || "General") === g);
						if (list.length === 0) return null;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: [
									g,
									" (",
									list.length,
									")"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3",
								children: list.map((s) => {
									if (editingId === s.id && editDraft) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
										onSubmit: saveEdit,
										className: "flex flex-col justify-between rounded-xl border-2 border-accent bg-elevated/70 p-4 shadow-md space-y-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between border-b border-border/80 pb-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-accent",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3" }), " Edit Service"]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: cancelEdit,
													className: "rounded p-1 text-muted hover:bg-surface hover:text-fg transition-colors",
													title: "Cancel edit",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-2.5",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "mb-1 block text-[11px] font-medium text-muted",
														children: "Service Name"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														required: true,
														type: "text",
														value: editDraft.name,
														onChange: (e) => setEditDraft({
															...editDraft,
															name: e.target.value
														}),
														placeholder: "Service name",
														className: "w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm font-medium text-fg focus:border-accent focus:outline-none",
														autoFocus: true
													})] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-2 gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "mb-1 block text-[11px] font-medium text-muted",
															children: "Duration (min)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															required: true,
															type: "number",
															min: 5,
															step: 5,
															value: editDraft.durationMin,
															onChange: (e) => setEditDraft({
																...editDraft,
																durationMin: Number(e.target.value)
															}),
															className: "w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:outline-none"
														})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
															className: "mb-1 block text-[11px] font-medium text-muted",
															children: "Price (PKR)"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															required: true,
															type: "number",
															min: 0,
															step: 100,
															value: editDraft.pricePkr,
															onChange: (e) => setEditDraft({
																...editDraft,
																pricePkr: Number(e.target.value)
															}),
															className: "w-full rounded-md border border-border bg-surface px-2.5 py-1.5 text-sm text-fg focus:border-accent focus:outline-none"
														})] })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
														className: "mb-1 block text-[11px] font-medium text-muted",
														children: "Category"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex gap-1.5",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
															value: [
																"Dental",
																"Aesthetic",
																"General"
															].includes(editDraft.category) ? editDraft.category : "__custom__",
															onChange: (e) => {
																if (e.target.value === "__custom__") setEditDraft({
																	...editDraft,
																	category: ""
																});
																else setEditDraft({
																	...editDraft,
																	category: e.target.value
																});
															},
															className: "rounded-md border border-border bg-surface px-2 py-1.5 text-xs text-fg focus:border-accent focus:outline-none",
															children: [
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "Dental",
																	children: "Dental"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "Aesthetic",
																	children: "Aesthetic"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "General",
																	children: "General"
																}),
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "__custom__",
																	children: "Custom category..."
																})
															]
														}), ![
															"Dental",
															"Aesthetic",
															"General"
														].includes(editDraft.category) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
															required: true,
															placeholder: "Category name",
															value: editDraft.category,
															onChange: (e) => setEditDraft({
																...editDraft,
																category: e.target.value
															}),
															className: "flex-1 min-w-0 rounded-md border border-border bg-surface px-2 py-1 text-xs text-fg focus:border-accent focus:outline-none"
														})]
													})] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-end gap-2 pt-2 border-t border-border/80",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: cancelEdit,
													className: "rounded-md border border-border px-2.5 py-1.5 text-xs font-medium text-muted hover:bg-surface hover:text-fg transition-colors",
													children: "Cancel"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "submit",
													className: "inline-flex items-center gap-1.5 rounded-md bg-accent px-3 py-1.5 text-xs font-medium text-accent-fg hover:opacity-90 transition-opacity",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-3.5" }), " Save changes"]
												})]
											})
										]
									}, s.id);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "group relative flex flex-col justify-between rounded-xl border border-border bg-surface p-4 transition-all hover:border-accent/40 hover:shadow-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-start justify-between gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-medium text-fg leading-snug",
												children: s.name
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-0.5 shrink-0 opacity-80 group-hover:opacity-100 transition-opacity",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => startEdit(s),
													className: "rounded p-1.5 text-muted hover:bg-elevated hover:text-accent transition-colors",
													title: `Edit ${s.name}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, { className: "size-3.5" })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => {
														if (confirm(`Are you sure you want to delete "${s.name}"?`)) onDeleteService(s.id);
													},
													className: "rounded p-1.5 text-muted hover:bg-elevated hover:text-danger transition-colors",
													title: "Delete service",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
												})]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-2 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded bg-elevated px-2 py-0.5 text-xs text-muted",
												children: [s.durationMin, " min"]
											}), s.category && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-elevated/70 px-2 py-0.5 text-[11px] text-muted",
												children: s.category
											})]
										})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 text-sm font-semibold text-accent",
											children: money(s.pricePkr)
										})]
									}, s.id);
								})
							})]
						}, g);
					}),
					data.services.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-4 text-center text-sm text-muted",
						children: "No services configured yet. Add your first service below."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-semibold",
						children: "Add New Service"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Add a new service or procedure to your clinic's offerings."
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "flex flex-wrap items-center gap-2.5",
					onSubmit: (e) => {
						e.preventDefault();
						if (!draft.name.trim()) return;
						onSaveService({
							name: draft.name.trim(),
							durationMin: Number(draft.durationMin) || 15,
							pricePkr: Number(draft.pricePkr) || 0,
							category: draft.category.trim() || "General"
						});
						setDraft({
							name: "",
							durationMin: 30,
							pricePkr: 1e3,
							category: "Dental"
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							required: true,
							placeholder: "Service name (e.g. Scaling & Polishing)",
							value: draft.name,
							onChange: (e) => setDraft({
								...draft,
								name: e.target.value
							}),
							className: "min-w-[200px] flex-1 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 5,
								step: 5,
								value: draft.durationMin,
								onChange: (e) => setDraft({
									...draft,
									durationMin: Number(e.target.value)
								}),
								className: "w-28 rounded-md border border-border bg-elevated px-3 py-2 pr-10 text-sm text-fg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted",
								children: "min"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: 0,
								step: 100,
								value: draft.pricePkr,
								onChange: (e) => setDraft({
									...draft,
									pricePkr: Number(e.target.value)
								}),
								className: "w-32 rounded-md border border-border bg-elevated px-3 py-2 pr-10 text-sm text-fg"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-muted",
								children: "PKR"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
								value: [
									"Dental",
									"Aesthetic",
									"General"
								].includes(draft.category) ? draft.category : "__custom__",
								onChange: (e) => {
									if (e.target.value === "__custom__") setDraft({
										...draft,
										category: ""
									});
									else setDraft({
										...draft,
										category: e.target.value
									});
								},
								className: "rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Dental",
										children: "Dental"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "Aesthetic",
										children: "Aesthetic"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "General",
										children: "General"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: "__custom__",
										children: "Custom category..."
									})
								]
							}), ![
								"Dental",
								"Aesthetic",
								"General"
							].includes(draft.category) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								placeholder: "Category name",
								value: draft.category,
								onChange: (e) => setDraft({
									...draft,
									category: e.target.value
								}),
								className: "w-36 rounded-md border border-border bg-elevated px-3 py-2 text-sm text-fg"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "submit",
							className: "inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg hover:opacity-90 transition-opacity",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add service"]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mb-3 text-sm font-semibold",
						children: "Working hours"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex w-28 items-center gap-2 text-sm",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: !h.closed,
										onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
											...x,
											closed: !e.target.checked
										} : x))
									}), days[h.day]]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "time",
									disabled: h.closed,
									value: h.open,
									onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
										...x,
										open: e.target.value
									} : x)),
									className: "rounded-md border border-border bg-elevated px-2 py-1.5 text-sm disabled:opacity-40"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted",
									children: "to"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "time",
									disabled: h.closed,
									value: h.close,
									onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
										...x,
										close: e.target.value
									} : x)),
									className: "rounded-md border border-border bg-elevated px-2 py-1.5 text-sm disabled:opacity-40"
								})
							]
						}, h.day))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: [
									"Buffer",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: buffer,
										onChange: (e) => setBuffer(Number(e.target.value)),
										className: "ml-2 w-20 rounded-md border border-border bg-elevated px-2 py-1 text-fg"
									}),
									"min"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm text-muted",
								children: ["Max / slot", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "number",
									value: max,
									onChange: (e) => setMax(Number(e.target.value)),
									className: "ml-2 w-16 rounded-md border border-border bg-elevated px-2 py-1 text-fg"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onSaveHours(hours, buffer, max),
								className: "rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
								children: "Save hours"
							})
						]
					})
				]
			})
		]
	});
}
function RemindersView({ data, busy, onSave, onSweep, onSim }) {
	const [en, setEn] = (0, import_react.useState)(data.business.templateEn);
	const [ur, setUr] = (0, import_react.useState)(data.business.templateUr);
	const [lang, setLang] = (0, import_react.useState)(data.business.lang);
	const pending = data.bookings.filter((b) => b.status === "pending");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-semibold",
						children: "WhatsApp Cloud API"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-sm text-muted",
						children: "WhatsApp is connected for this clinic. Tap send on a booking, or send all due reminders."
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: onSweep,
						className: "inline-flex items-center gap-2 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), "Send due reminders"]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 rounded-xl border border-border bg-surface p-4",
				children: [
					[
						"remind24h",
						"24 hours before",
						data.business.remind24h
					],
					[
						"remind2h",
						"2 hours before",
						data.business.remind2h
					],
					[
						"remindMorning",
						"Morning of appointment",
						data.business.remindMorning
					]
				].map(([key, label, on]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center justify-between rounded-lg bg-elevated px-3 py-3 text-sm",
					children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: on,
						onChange: (e) => onSave({ [key]: e.target.checked })
					})]
				}, key))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-3 flex gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLang("en"),
							className: `rounded-md px-3 py-1.5 text-xs font-medium ${lang === "en" ? "bg-accent text-accent-fg" : "bg-elevated text-muted"}`,
							children: "English"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => setLang("ur"),
							className: `rounded-md px-3 py-1.5 text-xs font-medium ${lang === "ur" ? "bg-accent text-accent-fg" : "bg-elevated text-muted"}`,
							children: "اردو"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
						rows: 7,
						value: lang === "en" ? en : ur,
						onChange: (e) => lang === "en" ? setEn(e.target.value) : setUr(e.target.value),
						className: "w-full rounded-lg border border-border bg-elevated px-3 py-2 font-mono text-sm",
						dir: lang === "ur" ? "rtl" : "ltr"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted",
						children: "Variables: {{name}} {{service}} {{date}} {{time}} {{shop}}"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => onSave({
							templateEn: en,
							templateUr: ur,
							lang
						}),
						className: "mt-3 rounded-md bg-accent px-3 py-2 text-sm font-medium text-accent-fg",
						children: "Save template"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 text-sm font-semibold",
					children: "Simulate customer reply"
				}), pending.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No pending bookings."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "space-y-2",
					children: pending.slice(0, 6).map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex flex-wrap items-center justify-between gap-2 rounded-lg bg-elevated px-3 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-sm",
							children: [
								b.customerName,
								" · ",
								b.serviceName
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onSim(b.id, "YES"),
								className: "rounded-md bg-accent px-2 py-1 text-xs font-medium text-accent-fg",
								children: "YES"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => onSim(b.id, "NO"),
								className: "rounded-md border border-border px-2 py-1 text-xs",
								children: "NO"
							})]
						})]
					}, b.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-surface p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
					className: "mb-3 inline-flex items-center gap-2 text-sm font-semibold",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-4" }), " Message log"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "max-h-72 space-y-2 overflow-y-auto",
					children: data.messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
						className: "text-sm text-muted",
						children: "Run a sweep to generate the first messages."
					}) : data.messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-lg bg-elevated px-3 py-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-between text-xs text-muted",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								m.direction === "out" ? "Out" : "In",
								" · ",
								m.customerName ?? "Unknown",
								m.simulated ? " · simulated" : ""
							] })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 whitespace-pre-wrap text-fg/90",
							children: m.body
						})]
					}, m.id))
				})]
			})
		]
	});
}
function LinkView({ slug, onCopy }) {
	const url = publicBookUrl(slug);
	const qr = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&bgcolor=0b0e0c&color=2bd576&data=${encodeURIComponent(url)}`;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg space-y-6 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted",
				children: "Share this everywhere — Instagram bio, WhatsApp status, reception desk."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-accent/30 bg-surface p-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "break-all font-mono text-lg text-accent",
					children: url
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: onCopy,
						className: "inline-flex items-center gap-2 rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-4" }), " Copy link"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: qr,
						download: "wabook-qr.png",
						className: "rounded-md border border-border px-4 py-2 text-sm",
						children: "Download QR"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
				src: qr,
				alt: "Booking QR code",
				className: "mx-auto rounded-xl border border-border bg-bg p-3",
				width: 240,
				height: 240
			})
		]
	});
}
function BillingView() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-4 lg:grid-cols-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-surface p-5 lg:col-span-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "Current plan"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-2xl font-semibold",
					children: "Pro · Rs 2,999 / month"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Renews 14 Oct 2026"
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-xl border border-border bg-elevated p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Business"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xl font-semibold",
					children: "Rs 4,999 / mo"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-1 text-sm text-muted",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Unlimited staff" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Priority WhatsApp queue" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Custom domain" })
					]
				})
			]
		})]
	});
}
var TIMEZONES = [
	{
		value: "Asia/Karachi",
		label: "Pakistan Standard Time (PKT, UTC+5)"
	},
	{
		value: "Asia/Dubai",
		label: "Gulf Standard Time (GST, UTC+4)"
	},
	{
		value: "Asia/Riyadh",
		label: "Arabia Standard Time (AST, UTC+3)"
	},
	{
		value: "Europe/London",
		label: "London / UK (GMT/BST, UTC+0/+1)"
	},
	{
		value: "America/New_York",
		label: "US Eastern Time (EST/EDT, UTC-5/-4)"
	},
	{
		value: "America/Chicago",
		label: "US Central Time (CST/CDT, UTC-6/-5)"
	},
	{
		value: "America/Los_Angeles",
		label: "US Pacific Time (PST/PDT, UTC-8/-7)"
	},
	{
		value: "Asia/Kolkata",
		label: "India Standard Time (IST, UTC+5:30)"
	},
	{
		value: "Asia/Dhaka",
		label: "Bangladesh Time (BST, UTC+6)"
	}
];
var INITIAL_HOURS = [
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
	},
	{
		day: 0,
		closed: true,
		open: "09:00",
		close: "17:00"
	}
];
var DAY_LABELS = {
	1: "Mon",
	2: "Tue",
	3: "Wed",
	4: "Thu",
	5: "Fri",
	6: "Sat",
	0: "Sun"
};
var SUGGESTED_SERVICES = [
	{
		name: "General Consultation",
		durationMin: 30,
		pricePkr: 2e3,
		category: "Consultation"
	},
	{
		name: "Follow-up Visit",
		durationMin: 15,
		pricePkr: 1e3,
		category: "Consultation"
	},
	{
		name: "Comprehensive Checkup",
		durationMin: 45,
		pricePkr: 3500,
		category: "General"
	}
];
function ClinicSetup({ onSave, busy }) {
	const [step, setStep] = (0, import_react.useState)(1);
	const [name, setName] = (0, import_react.useState)("");
	const [timezone, setTimezone] = (0, import_react.useState)("Asia/Karachi");
	const [bufferMinutes, setBufferMinutes] = (0, import_react.useState)(15);
	const [hours, setHours] = (0, import_react.useState)(INITIAL_HOURS);
	const [staffList, setStaffList] = (0, import_react.useState)([]);
	const [staffDraft, setStaffDraft] = (0, import_react.useState)("");
	const [servicesList, setServicesList] = (0, import_react.useState)([]);
	const [serviceDraft, setServiceDraft] = (0, import_react.useState)({
		name: "",
		durationMin: 30,
		pricePkr: 2e3,
		category: "General"
	});
	const [validationError, setValidationError] = (0, import_react.useState)(null);
	const applySchedulePreset = (open, close, sunClosed = true) => {
		setHours((prev) => prev.map((h) => ({
			...h,
			open,
			close,
			closed: h.day === 0 ? sunClosed : false
		})));
	};
	const handleAddStaff = () => {
		const trimmed = staffDraft.trim();
		if (!trimmed) return;
		if (staffList.some((s) => s.toLowerCase() === trimmed.toLowerCase())) {
			setValidationError("Practitioner already added.");
			return;
		}
		setStaffList([...staffList, trimmed]);
		setStaffDraft("");
		setValidationError(null);
	};
	const handleRemoveStaff = (idx) => {
		setStaffList(staffList.filter((_, i) => i !== idx));
	};
	const handleAddService = (item) => {
		const s = item || serviceDraft;
		const sName = s.name.trim();
		if (!sName) {
			setValidationError("Please enter a service name.");
			return;
		}
		setServicesList([...servicesList, {
			name: sName,
			durationMin: Number(s.durationMin) || 15,
			pricePkr: Number(s.pricePkr) || 0,
			category: s.category?.trim() || "General"
		}]);
		if (!item) setServiceDraft({
			name: "",
			durationMin: 30,
			pricePkr: 2e3,
			category: serviceDraft.category
		});
		setValidationError(null);
	};
	const handleRemoveService = (idx) => {
		setServicesList(servicesList.filter((_, i) => i !== idx));
	};
	const handleNextFromStep1 = (e) => {
		e.preventDefault();
		if (name.trim().length < 2) {
			setValidationError("Please enter a clinic name (at least 2 characters).");
			return;
		}
		setValidationError(null);
		setStep(2);
	};
	const handleNextFromStep2 = () => {
		if (hours.filter((h) => !h.closed).length === 0) {
			setValidationError("Please keep at least one day open for appointments.");
			return;
		}
		setValidationError(null);
		setStep(3);
	};
	const handleNextFromStep3 = () => {
		if (staffList.length === 0) {
			setValidationError("Please add at least one practitioner or doctor.");
			return;
		}
		setValidationError(null);
		setStep(4);
	};
	const handleFinish = async () => {
		if (servicesList.length === 0) {
			setValidationError("Please add at least one service before launching.");
			return;
		}
		setValidationError(null);
		await onSave({
			name: name.trim(),
			timezone,
			bufferMinutes,
			hours,
			staff: staffList,
			services: servicesList
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "min-h-screen bg-bg px-4 py-8 sm:px-6",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-2xl",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid size-9 place-items-center rounded-lg bg-accent text-accent-fg font-semibold",
							children: "W"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-semibold text-fg tracking-tight",
							children: "WaBook"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted",
							children: "Clinic Onboarding"
						})] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => void signOut(),
						className: "flex items-center gap-1.5 rounded-md border border-border px-3 py-1.5 text-xs text-muted transition-colors hover:bg-elevated hover:text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), " Sign out"]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-6 rounded-xl border border-border bg-surface p-4",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-4 gap-2 text-center text-xs font-medium",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(1),
								className: `flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${step === 1 ? "bg-accent-dim text-accent font-semibold" : name.trim().length >= 2 ? "text-fg hover:bg-elevated" : "text-muted"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "1. Profile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "1"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: name.trim().length < 2,
								onClick: () => setStep(2),
								className: `flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${step === 2 ? "bg-accent-dim text-accent font-semibold" : step > 2 ? "text-fg hover:bg-elevated" : "text-muted disabled:opacity-40"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "2. Hours"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "2"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: step < 3 && name.trim().length < 2,
								onClick: () => {
									if (name.trim().length >= 2) setStep(3);
								},
								className: `flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${step === 3 ? "bg-accent-dim text-accent font-semibold" : staffList.length > 0 ? "text-fg hover:bg-elevated" : "text-muted disabled:opacity-40"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "3. Staff"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "3"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: staffList.length === 0,
								onClick: () => {
									if (staffList.length > 0) setStep(4);
								},
								className: `flex items-center justify-center gap-1.5 rounded-lg py-2 transition-colors ${step === 4 ? "bg-accent-dim text-accent font-semibold" : servicesList.length > 0 ? "text-fg hover:bg-elevated" : "text-muted disabled:opacity-40"}`,
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stethoscope, { className: "size-3.5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "hidden sm:inline",
										children: "4. Services"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "sm:hidden",
										children: "4"
									})
								]
							})
						]
					})
				}),
				validationError && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 rounded-md border border-warn/40 bg-warn/10 p-3 text-xs text-warn leading-relaxed flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: validationError }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setValidationError(null),
						className: "text-warn hover:opacity-75 ml-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-3.5" })
					})]
				}),
				step === 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleNextFromStep1,
					className: "rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-accent",
								children: "Step 1 of 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-bold tracking-tight text-fg",
								children: "Set up your clinic profile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Enter your practice name and timezone. Your booking link and automated WhatsApp messages will display this name."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-medium text-fg",
								children: ["Clinic / Practice name *", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									autoFocus: true,
									required: true,
									minLength: 2,
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "e.g. Apex Dental & Healthcare",
									className: "mt-1.5 w-full rounded-md border border-border bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "block text-sm font-medium text-fg",
								children: [
									"Clinic Timezone",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
										value: timezone,
										onChange: (e) => setTimezone(e.target.value),
										className: "mt-1.5 w-full rounded-md border border-border bg-elevated px-3 py-2.5 text-sm text-fg focus:border-accent focus:outline-none",
										children: TIMEZONES.map((tz) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: tz.value,
											children: tz.label
										}, tz.value))
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-muted",
										children: "Appointments and reminder sweeps operate according to this time."
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex justify-end pt-4 border-t border-border",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "submit",
								disabled: name.trim().length < 2,
								className: "flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50",
								children: ["Next: Working Hours ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
							})
						})
					]
				}),
				step === 2 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-accent",
								children: "Step 2 of 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-bold tracking-tight text-fg",
								children: "Configure working hours"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Specify when patients can book appointments. You can adjust individual days anytime later in settings."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted mb-2",
							children: "Quick schedule presets:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applySchedulePreset("09:00", "17:00", true),
									className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-fg hover:border-accent transition-colors",
									children: "9:00 AM – 5:00 PM (Mon–Sat)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applySchedulePreset("10:00", "19:00", true),
									className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-fg hover:border-accent transition-colors",
									children: "10:00 AM – 7:00 PM (Mon–Sat)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applySchedulePreset("17:00", "22:00", true),
									className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-fg hover:border-accent transition-colors",
									children: "5:00 PM – 10:00 PM (Evening)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => applySchedulePreset("09:00", "18:00", false),
									className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-fg hover:border-accent transition-colors",
									children: "All 7 Days Open"
								})
							]
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-2 rounded-xl border border-border bg-elevated/40 p-4",
							children: hours.map((h) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: `flex flex-wrap items-center justify-between gap-3 rounded-lg p-2 transition-colors ${h.closed ? "opacity-60 bg-surface/40" : "bg-surface"}`,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-3 cursor-pointer select-none",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "checkbox",
											checked: !h.closed,
											onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
												...x,
												closed: !e.target.checked
											} : x)),
											className: "size-4 rounded accent-accent cursor-pointer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-sm font-semibold text-fg w-20",
											children: DAY_LABELS[h.day]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted",
											children: h.closed ? "Closed" : "Open"
										})
									]
								}), !h.closed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "time",
											value: h.open,
											onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
												...x,
												open: e.target.value
											} : x)),
											className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs text-fg"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs text-muted",
											children: "to"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "time",
											value: h.close,
											onChange: (e) => setHours((prev) => prev.map((x) => x.day === h.day ? {
												...x,
												close: e.target.value
											} : x)),
											className: "rounded-md border border-border bg-elevated px-2.5 py-1 text-xs text-fg"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs text-muted italic",
									children: "No appointments on this day"
								})]
							}, h.day))
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-surface p-4 flex flex-wrap items-center justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium text-fg",
								children: "Appointment Buffer Time"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted",
								children: "Break / sanitization gap between patient slots"
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2",
								children: [
									5,
									10,
									15,
									20,
									30
								].map((min) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									onClick: () => setBufferMinutes(min),
									className: `rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${bufferMinutes === min ? "bg-accent text-accent-fg" : "border border-border bg-elevated text-fg hover:border-accent"}`,
									children: [min, "m"]
								}, min))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-4 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(1),
								className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-elevated hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleNextFromStep2,
								className: "flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90",
								children: ["Next: Practitioners ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
							})]
						})
					]
				}),
				step === 3 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-accent",
								children: "Step 3 of 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-bold tracking-tight text-fg",
								children: "Add clinic practitioners"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Add doctors, specialists, or consultants who take appointments at your clinic. Add at least one practitioner."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								autoFocus: true,
								placeholder: "e.g. Dr. Ayesha Ahmed or your name",
								value: staffDraft,
								onChange: (e) => setStaffDraft(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddStaff();
									}
								},
								className: "flex-1 rounded-md border border-border bg-elevated px-3 py-2.5 text-sm text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: handleAddStaff,
								disabled: !staffDraft.trim(),
								className: "inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add"]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: [
									"Added Practitioners (",
									staffList.length,
									")"
								]
							}), staffList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted",
								children: "No practitioners added yet. Type a name above and click \"Add\"."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
								children: staffList.map((doc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between gap-2 rounded-xl border border-border bg-elevated/70 px-3.5 py-2.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-2.5 min-w-0",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid size-7 shrink-0 place-items-center rounded-full bg-accent/20 text-xs font-bold text-accent",
											children: doc.charAt(0).toUpperCase()
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "truncate text-sm font-medium text-fg",
											children: doc
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleRemoveStaff(idx),
										className: "rounded p-1 text-muted transition-colors hover:bg-surface hover:text-danger",
										title: "Remove practitioner",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-4 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(2),
								className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-elevated hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: staffList.length === 0,
								onClick: handleNextFromStep3,
								className: "flex items-center gap-2 rounded-md bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50",
								children: ["Next: Services & Pricing ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
							})]
						})
					]
				}),
				step === 4 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-2xl border border-border bg-surface p-6 sm:p-8 space-y-6 shadow-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-accent",
								children: "Step 4 of 4"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "mt-1 text-2xl font-bold tracking-tight text-fg",
								children: "Define your services & pricing"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted",
								children: "Add the treatments, consultations, or procedures patients can book. Add at least one service."
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs font-medium text-muted mb-2",
							children: "Click to quick-add common templates:"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap gap-2",
							children: SUGGESTED_SERVICES.map((s, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => handleAddService(s),
								className: "inline-flex items-center gap-1.5 rounded-md border border-border bg-elevated px-2.5 py-1 text-xs font-medium text-fg hover:border-accent hover:text-accent transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3" }),
									" ",
									s.name,
									" (",
									s.durationMin,
									"m · ",
									money(s.pricePkr),
									")"
								]
							}, idx))
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-elevated/40 p-4 space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-semibold uppercase tracking-wider text-fg",
									children: "Add custom service"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "Service Name (e.g. Scaling & Polishing)",
										value: serviceDraft.name,
										onChange: (e) => setServiceDraft({
											...serviceDraft,
											name: e.target.value
										}),
										className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										placeholder: "Category (e.g. Consultation, Dental)",
										value: serviceDraft.category,
										onChange: (e) => setServiceDraft({
											...serviceDraft,
											category: e.target.value
										}),
										className: "rounded-md border border-border bg-surface px-3 py-2 text-sm text-fg placeholder:text-muted/60 focus:border-accent focus:outline-none"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap items-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted",
												children: "Duration:"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
												value: serviceDraft.durationMin,
												onChange: (e) => setServiceDraft({
													...serviceDraft,
													durationMin: Number(e.target.value)
												}),
												className: "rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-fg",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 15,
														children: "15 mins"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 30,
														children: "30 mins"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 45,
														children: "45 mins"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 60,
														children: "60 mins"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 90,
														children: "90 mins"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: 120,
														children: "120 mins"
													})
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-xs text-muted",
												children: "Fee (PKR):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "number",
												min: 0,
												step: 100,
												value: serviceDraft.pricePkr,
												onChange: (e) => setServiceDraft({
													...serviceDraft,
													pricePkr: Number(e.target.value)
												}),
												className: "w-24 rounded-md border border-border bg-surface px-2.5 py-1.5 text-xs text-fg"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											type: "button",
											onClick: () => handleAddService(),
											disabled: !serviceDraft.name.trim(),
											className: "ml-auto inline-flex items-center gap-1.5 rounded-md bg-accent px-4 py-1.5 text-xs font-semibold text-accent-fg hover:opacity-90 disabled:opacity-50",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-3.5" }), " Add Service"]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted",
								children: [
									"Configured Services (",
									servicesList.length,
									")"
								]
							}), servicesList.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "rounded-xl border border-dashed border-border p-6 text-center text-sm text-muted",
								children: "No services added yet. Use the quick-add buttons or fill out the form above."
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-1 gap-2.5 sm:grid-cols-2",
								children: servicesList.map((svc, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-2 rounded-xl border border-border bg-surface p-3.5 shadow-xs",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm font-semibold text-fg",
											children: svc.name
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-1 flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "rounded bg-elevated px-2 py-0.5 text-[11px] text-muted",
												children: [svc.durationMin, " min"]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded bg-elevated/70 px-2 py-0.5 text-[11px] text-muted",
												children: svc.category
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-2 text-xs font-bold text-accent",
											children: money(svc.pricePkr)
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => handleRemoveService(idx),
										className: "rounded p-1 text-muted transition-colors hover:bg-elevated hover:text-danger",
										title: "Delete service",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
									})]
								}, idx))
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between pt-4 border-t border-border",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: () => setStep(3),
								className: "flex items-center gap-1.5 rounded-md border border-border px-4 py-2 text-sm font-medium text-muted hover:bg-elevated hover:text-fg",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "size-4" }), " Back"]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								disabled: busy || servicesList.length === 0,
								onClick: handleFinish,
								className: "flex items-center gap-2 rounded-md bg-accent px-6 py-2.5 text-sm font-semibold text-accent-fg transition-opacity hover:opacity-90 disabled:opacity-50",
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-4 animate-spin" }), " Saving Clinic…"] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), " Finish Setup & Launch Desk"] })
							})]
						})
					]
				})
			]
		})
	});
}
function LandingPage({ user, onOpenDesk }) {
	const [billingPeriod, setBillingPeriod] = (0, import_react.useState)("monthly");
	const [openFaq, setOpenFaq] = (0, import_react.useState)(0);
	const [simLang, setSimLang] = (0, import_react.useState)("ur");
	const [simStatus, setSimStatus] = (0, import_react.useState)("pending");
	const [bizType, setBizType] = (0, import_react.useState)("dental");
	const [dailyBookings, setDailyBookings] = (0, import_react.useState)(20);
	const [ticketPrice, setTicketPrice] = (0, import_react.useState)(3500);
	const [noShowRate, setNoShowRate] = (0, import_react.useState)(25);
	const monthlyTotalSlots = dailyBookings * 26;
	const monthlyNoShows = Math.round(monthlyTotalSlots * noShowRate / 100);
	const monthlyLostPkr = monthlyNoShows * ticketPrice;
	const monthlySavedPkr = Math.round(monthlyLostPkr * .85);
	const subscriptionCost = 3999;
	const netProfitPkr = monthlySavedPkr - subscriptionCost;
	const roiMultiplier = Math.round(monthlySavedPkr / subscriptionCost * 10) / 10;
	const handleStartTrial = () => {
		window.location.href = "/login";
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-bg text-fg selection:bg-accent selection:text-accent-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-50 bg-gradient-to-r from-accent-dim via-surface to-accent-dim border-b border-accent/20 px-4 py-2.5 text-center text-xs md:text-sm font-medium text-fg",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-center gap-2 flex-wrap",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1 rounded-full bg-accent/20 px-2 py-0.5 text-xs font-semibold text-accent border border-accent/30",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-3.5 fill-accent" }), "Pakistan Launch Special"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "50% OFF Lifetime Early Bird Discount" }), " for the first 50 Clinics & Salons!"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: handleStartTrial,
							className: "ml-2 inline-flex items-center gap-1 underline underline-offset-4 hover:text-accent transition-colors font-semibold cursor-pointer",
							children: ["Claim 7-Day Free Trial ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-3.5" })]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 backdrop-blur-xl bg-bg/80 border-b border-border/80",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 h-16",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: "/",
							className: "flex items-center gap-3 group",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative grid size-10 place-items-center rounded-xl bg-gradient-to-br from-accent to-emerald-600 text-accent-fg font-bold shadow-lg shadow-accent/20 group-hover:scale-105 transition-transform",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xl",
									children: "W"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute -bottom-1 -right-1 size-3 rounded-full bg-emerald-400 border-2 border-bg" })]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-lg font-bold tracking-tight text-fg",
									children: "WaBook"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-semibold text-accent uppercase tracking-wider border border-accent/20",
									children: "Pakistan 🇵🇰"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted -mt-0.5",
								children: "WhatsApp Booking & Reminders"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden lg:flex items-center gap-6 text-sm font-medium text-muted",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how-it-works",
									className: "hover:text-fg transition-colors",
									children: "How It Works"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#demo",
									className: "hover:text-fg transition-colors",
									children: "WhatsApp Demo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#calculator",
									className: "hover:text-fg transition-colors",
									children: "ROI Calculator"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#features",
									className: "hover:text-fg transition-colors",
									children: "Features"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#pricing",
									className: "hover:text-fg transition-colors",
									children: "Pricing & Offers"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#faq",
									className: "hover:text-fg transition-colors",
									children: "FAQ"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex items-center gap-3",
							children: user ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: onOpenDesk || (() => window.location.href = "/"),
								className: "inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-accent-fg shadow-lg shadow-accent/20 hover:brightness-110 transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "My Clinic Desk" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "/login",
								className: "hidden sm:inline-flex items-center text-sm font-medium text-muted hover:text-fg transition-colors px-3 py-2",
								children: "Sign In"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleStartTrial,
								className: "inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2.5 text-xs sm:text-sm font-semibold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7-Day Free Trial" })]
							})] })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[650px] rounded-full bg-accent/10 blur-[140px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/3 right-10 size-[350px] rounded-full bg-emerald-500/5 blur-[100px] pointer-events-none" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mx-auto max-w-7xl px-4 sm:px-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid lg:grid-cols-12 gap-12 lg:gap-8 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-7 space-y-6 text-center lg:text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "inline-flex items-center gap-2 rounded-full border border-accent/30 bg-surface/90 px-3.5 py-1.5 text-xs font-medium text-accent shadow-sm backdrop-blur-md",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "flex size-2 rounded-full bg-accent animate-ping" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "#1 WhatsApp Appointment Engine in Pakistan" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-muted",
												children: "•"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-fg font-semibold",
												children: "Zero No-Shows"
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
										className: "text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-fg leading-[1.12]",
										children: [
											"Stop 85% of Client No-Shows with",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "bg-gradient-to-r from-accent via-emerald-400 to-teal-300 bg-clip-text text-transparent",
												children: "Automated WhatsApp"
											}),
											" ",
											"Reminders."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-base sm:text-lg md:text-xl text-muted leading-relaxed max-w-2xl mx-auto lg:mx-0",
										children: [
											"Built specifically for ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clinics, Aesthetic Doctors, Dental Centers & Salons in Pakistan" }),
											". Clients book online from your Instagram or Google link, receive automated WhatsApp reminders in",
											" ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-fg font-medium",
												children: "English & Roman Urdu"
											}),
											", and confirm with 1 tap."
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "rounded-2xl border border-accent/25 bg-gradient-to-br from-surface to-elevated p-4 sm:p-5 text-left shadow-xl",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "space-y-1",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "inline-block rounded-md bg-accent/20 px-2 py-0.5 text-xs font-bold text-accent",
															children: "7-DAY FREE TRIAL"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "text-xs text-muted",
															children: "No credit card required"
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-sm font-semibold text-fg",
														children: "Get 50% Lifetime Early Bird Discount — Rs 3,999/mo (was Rs 7,999)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs text-muted",
														children: "Setup takes 2 minutes. Includes automated reminders, custom link & staff calendar."
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
												onClick: handleStartTrial,
												className: "w-full sm:w-auto shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-6 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start Free Trial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
											})]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-2 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "No credit card needed" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2-minute instant setup" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Official Meta WhatsApp Cloud API" })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-1.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JazzCash, EasyPaisa & Raast" })]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-5 relative",
								id: "demo",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative mx-auto max-w-[380px] rounded-[36px] border-4 border-border/80 bg-surface shadow-2xl shadow-accent/10 p-4 overflow-hidden",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "mx-auto mb-3 h-4 w-28 rounded-full bg-border/60 flex items-center justify-center",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "size-2 rounded-full bg-border" })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-2xl bg-[#075e54] text-white p-3 shadow-md flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-2.5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "relative size-9 rounded-full bg-emerald-700 flex items-center justify-center font-bold text-sm",
													children: ["🏥", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "absolute bottom-0 right-0 size-2.5 rounded-full bg-emerald-300 border border-[#075e54]" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-semibold text-xs leading-none",
														children: "Apex Dental & Aesthetic"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3 text-sky-300" })]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-emerald-200 mt-0.5",
													children: "Official WhatsApp Business"
												})] })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-1.5",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => setSimLang(simLang === "ur" ? "en" : "ur"),
													className: "rounded-full bg-white/20 px-2 py-0.5 text-[10px] font-semibold hover:bg-white/30 transition-colors cursor-pointer",
													title: "Toggle Language",
													children: simLang === "ur" ? "Roman Urdu 🇵🇰" : "English 🇬🇧"
												})
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "my-3 space-y-2.5 min-h-[300px] text-[12px] leading-relaxed p-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "text-center",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "rounded-md bg-elevated px-2 py-0.5 text-[10px] text-muted",
														children: "Today • Automated Bot"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded-2xl rounded-tl-sm bg-[#1e2a24] border border-accent/20 p-3 shadow-sm text-fg",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
															className: "font-bold text-accent text-[11px] mb-1 flex items-center gap-1",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3" }), "APPOINTMENT REMINDER"]
														}),
														simLang === "ur" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																"Assalam-o-Alaikum ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sarah Khan" }),
																"!"
															] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "mt-1 text-muted",
																children: [
																	"Aapki appointment ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Teeth Whitening & Scaling" }),
																	" kal",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																		className: "text-fg",
																		children: "4:30 PM"
																	}),
																	" par scheduled hai with",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dr. Daniyal" }),
																	"."
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "my-2 rounded-lg bg-surface/80 p-2 border border-border text-[11px] space-y-0.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-muted",
																	children: [
																		"📍 ",
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Location:" }),
																		" Gulberg III, Lahore"
																	]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-muted",
																	children: [
																		"💵 ",
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Fee:" }),
																		" Rs 4,500"
																	]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-accent font-semibold text-[11px]",
																children: [
																	"👉 Confirm karne ke liye ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "YES" }),
																	" reply karein, ya cancel karne ke liye",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NO" }),
																	" likhein."
																]
															})
														] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
																"Dear ",
																/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Sarah Khan" }),
																","
															] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "mt-1 text-muted",
																children: [
																	"Your appointment for ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Teeth Whitening & Scaling" }),
																	" with",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Dr. Daniyal" }),
																	" is scheduled for tomorrow at",
																	" ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
																		className: "text-fg",
																		children: "4:30 PM"
																	}),
																	"."
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
																className: "my-2 rounded-lg bg-surface/80 p-2 border border-border text-[11px] space-y-0.5",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-muted",
																	children: [
																		"📍 ",
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Clinic:" }),
																		" Gulberg III, Lahore"
																	]
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																	className: "text-muted",
																	children: [
																		"💵 ",
																		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Service Fee:" }),
																		" Rs 4,500"
																	]
																})]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
																className: "text-accent font-semibold text-[11px]",
																children: [
																	"👉 Reply ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "YES" }),
																	" to confirm, or ",
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "NO" }),
																	" to cancel."
																]
															})
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "mt-1 block text-right text-[9px] text-muted",
															children: "10:00 AM • Delivered"
														})
													]
												}),
												simStatus !== "pending" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "flex justify-end",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "rounded-2xl rounded-tr-sm bg-[#054740] p-2.5 text-white max-w-[80%] shadow-sm",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
															className: "font-bold text-xs",
															children: simStatus === "confirmed" ? "YES" : "NO"
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "block text-right text-[9px] text-emerald-200 mt-0.5 flex items-center justify-end gap-0.5",
															children: ["10:02 AM ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckCheck, { className: "size-3 text-sky-300" })]
														})]
													})
												}),
												simStatus === "confirmed" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-2xl rounded-tl-sm bg-[#1e2a24] border border-accent/30 p-2.5 text-fg text-[11px]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-accent font-semibold",
														children: ["✅ ", simLang === "ur" ? "Zabardast! Aapki seat confirm ho chuki hai. Kal milte hain!" : "Thank you! Your appointment is 100% confirmed. See you tomorrow!"]
													})
												}),
												simStatus === "cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
													className: "rounded-2xl rounded-tl-sm bg-[#2a1e1e] border border-danger/30 p-2.5 text-fg text-[11px]",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-danger font-semibold",
														children: ["❌ ", simLang === "ur" ? "Aapki appointment cancel kardi gayi hai. Dobara book karne ke liye link par click karein." : "Your slot has been cancelled. Feel free to rebook anytime."]
													})
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-border pt-3 space-y-2",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-center text-muted font-medium",
													children: "Test the bot live! Click a button below:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-2",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSimStatus("confirmed"),
														className: `rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${simStatus === "confirmed" ? "bg-accent text-accent-fg shadow-md shadow-accent/20" : "bg-surface border border-accent/40 text-accent hover:bg-accent/10"}`,
														children: "Client Replies \"YES\" ✅"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSimStatus("cancelled"),
														className: `rounded-xl py-2 px-3 text-xs font-bold transition-all cursor-pointer ${simStatus === "cancelled" ? "bg-danger text-white shadow-md shadow-danger/20" : "bg-surface border border-danger/40 text-danger hover:bg-danger/10"}`,
														children: "Client Replies \"NO\" ❌"
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-[10px] text-muted px-1",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
														"Live Calendar Status:",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: simStatus === "confirmed" ? "text-accent" : simStatus === "cancelled" ? "text-danger" : "text-warn",
															children: simStatus.toUpperCase()
														})
													] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
														onClick: () => setSimStatus("pending"),
														className: "underline hover:text-fg cursor-pointer",
														children: "Reset Demo"
													})]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden sm:block absolute -bottom-6 -left-6 rounded-2xl border border-accent/30 bg-surface/90 p-4 shadow-xl backdrop-blur-md",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "grid size-10 place-items-center rounded-xl bg-accent/20 text-accent",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-5" })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xl font-extrabold text-accent",
											children: "85% Fewer"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-muted",
											children: "No-Shows within 1st week"
										})] })]
									})
								})]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 md:py-28",
				id: "how-it-works",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20",
								children: "Why Traditional Booking Fails in Pakistan"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-fg",
								children: "Manual WhatsApp & Phone Calls Are Costing You Lakhs Every Month."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted",
								children: "Pakistani clients don't check emails or pick up unknown numbers. They live on WhatsApp."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14 grid md:grid-cols-2 gap-8",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-danger/30 bg-surface/50 p-6 sm:p-8 space-y-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold uppercase tracking-wider text-danger flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), " The Old, Stressful Way"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: "Manual chaos"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-fg",
									children: "Calling Patients & Manual WhatsApp Coordination"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-3.5 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-danger shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Receptionist calls patients:" }), " 60% of patients are in meetings, driving, or ignore unknown calls."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-danger shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Numbers get banned:" }), " Copy-pasting 50 reminders from a personal phone triggers WhatsApp spam bans."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-danger shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Empty Doctor / Stylist Chairs:" }), " Patient forgets, doctor sits idle, and you lose Rs 10,000–50,000 in daily revenue."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4 text-danger shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Foreign Software in USD:" }), " Calendly or Fresha cost $50–$150/mo, don't send WhatsApp reminders in Roman Urdu, and reject local debit cards."] })]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-3xl border border-accent/40 bg-gradient-to-br from-surface to-elevated p-6 sm:p-8 space-y-5 shadow-xl relative overflow-hidden",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 right-0 size-32 bg-accent/10 rounded-full blur-2xl pointer-events-none" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs font-bold uppercase tracking-wider text-accent flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }), " The WaBook Automated System"]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent",
										children: "98% Open Rate"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "text-xl font-bold text-fg",
									children: "Automated WhatsApp Reminders via Official Meta Cloud API"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "space-y-3.5 text-sm text-muted",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1-Tap Public Booking Link:" }),
												" Put ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "wabook.cloud/book/your-clinic" }),
												" in your Instagram Bio and Google Maps profile."
											] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Automated Bilingual Reminders:" }), " Sent 24h & 2h before the appointment in clean English or friendly Roman Urdu."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Instant YES / NO Confirmation:" }), " Patient replies \"YES\" and your calendar turns green. If they reply \"NO\", the slot opens for walk-ins."] })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
											className: "flex items-start gap-2.5",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0 mt-0.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Pakistani Friendly:" }), " Affordable PKR pricing, JazzCash, EasyPaisa, Raast, and local WhatsApp support."] })]
										})
									]
								})
							]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-16 md:py-24 bg-surface/30 border-y border-border",
				id: "calculator",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent/10 px-3 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20",
								children: "Interactive ROI Calculator"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-fg",
								children: "How Much Money Is Your Business Losing to No-Shows?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm sm:text-base text-muted",
								children: "Slide the bars to match your clinic or salon numbers and see your direct monthly savings with WaBook."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-12 max-w-4xl mx-auto rounded-3xl border border-border bg-surface p-6 sm:p-10 shadow-2xl",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-xs font-semibold uppercase tracking-wider text-muted mb-3 block",
								children: "Select Your Business Type:"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 sm:grid-cols-4 gap-2.5",
								children: [
									{
										id: "dental",
										label: "Dental Clinic",
										fee: 3500
									},
									{
										id: "aesthetic",
										label: "Aesthetic / Skin",
										fee: 6e3
									},
									{
										id: "salon",
										label: "Salon & Spa",
										fee: 2500
									},
									{
										id: "consultant",
										label: "Doctor / Wellness",
										fee: 4e3
									}
								].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setBizType(item.id);
										setTicketPrice(item.fee);
									},
									className: `rounded-xl py-2.5 px-3 text-xs font-semibold transition-all cursor-pointer border ${bizType === item.id ? "bg-accent/20 border-accent text-accent shadow-sm" : "bg-elevated border-border text-muted hover:text-fg"}`,
									children: item.label
								}, item.id))
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid md:grid-cols-2 gap-8 items-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: "Daily Appointments Scheduled"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-fg",
													children: [dailyBookings, " clients/day"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 5,
												max: 60,
												step: 1,
												value: dailyBookings,
												onChange: (e) => setDailyBookings(Number(e.target.value)),
												className: "w-full accent-accent h-2 bg-elevated rounded-lg cursor-pointer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-[10px] text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5 / day" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "30 / day" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "60 / day" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: "Average Consultation / Service Fee"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-accent",
													children: ["Rs ", ticketPrice.toLocaleString("en-PK")]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 1e3,
												max: 25e3,
												step: 500,
												value: ticketPrice,
												onChange: (e) => setTicketPrice(Number(e.target.value)),
												className: "w-full accent-accent h-2 bg-elevated rounded-lg cursor-pointer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-[10px] text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rs 1,000" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rs 12,500" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Rs 25,000" })
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-sm",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-muted",
													children: "Estimated Current No-Show Rate"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-bold text-danger",
													children: [noShowRate, "%"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "range",
												min: 10,
												max: 50,
												step: 5,
												value: noShowRate,
												onChange: (e) => setNoShowRate(Number(e.target.value)),
												className: "w-full accent-danger h-2 bg-elevated rounded-lg cursor-pointer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-[10px] text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "10% (Low)" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "25% (Average in Pakistan)" }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "50% (High)" })
												]
											})
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-accent/40 bg-gradient-to-br from-elevated to-surface p-6 space-y-5 shadow-xl text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs uppercase tracking-wider text-muted font-medium",
											children: "Estimated Monthly Revenue Lost"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl sm:text-3xl font-extrabold text-danger line-through opacity-80 mt-1",
											children: ["Rs ", monthlyLostPkr.toLocaleString("en-PK")]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] text-muted mt-0.5",
											children: [
												"(",
												monthlyNoShows,
												" missed slots every month)"
											]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-t border-border/80 pt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-xs uppercase tracking-wider text-accent font-bold flex items-center justify-center gap-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-3.5" }), "Revenue Recovered with WaBook (85%)"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-3xl sm:text-4xl font-black text-accent mt-1",
											children: [
												"Rs ",
												monthlySavedPkr.toLocaleString("en-PK"),
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-sm font-medium text-fg",
													children: "/month"
												})
											]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl bg-surface p-3 text-xs space-y-1 border border-border",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-muted",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "WaBook Early Bird Fee:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "font-semibold text-fg",
													children: [
														"Rs ",
														subscriptionCost.toLocaleString("en-PK"),
														"/mo"
													]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-accent font-bold",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Net Monthly Profit Saved:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["+Rs ", netProfitPkr.toLocaleString("en-PK")] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex justify-between text-muted text-[11px] pt-1 border-t border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Expected ROI:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "text-accent font-bold",
													children: [roiMultiplier, "x Return on Investment"]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleStartTrial,
										className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/20 hover:brightness-110 transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Recover My Revenue — Free 7 Days" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									})
								]
							})]
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 md:py-28",
				id: "features",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center max-w-3xl mx-auto space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20",
								children: "Complete Feature Suite"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-fg",
								children: "Everything Your Clinic or Salon Needs to Run on Autopilot."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted",
								children: "Built from scratch for Pakistani healthcare providers, beauty salons, and appointment studios."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "Bilingual WhatsApp Reminders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: "Send professional messages in English or friendly Roman Urdu. Pakistani clients understand and respond immediately."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExternalLink, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "Instagram & Google Maps Link"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: [
											"Add ",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", { children: "wabook.cloud/book/your-clinic" }),
											" to your Instagram bio, Google Maps, and Facebook ads. Patients book 24/7."
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Zap, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "1-Tap YES / NO Confirmation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: "Patients reply \"YES\" to confirm or \"NO\" to cancel. Your dashboard calendar updates instantly without a single receptionist call."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "Multi-Doctor & Multi-Staff Rosters"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: "Manage multiple doctors, aesthetic practitioners, stylist chairs, and cabin hours with custom time buffers between appointments."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "Official Meta Cloud API"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: "100% compliant with WhatsApp terms. No third-party scrapers, zero risk of getting your phone number permanently banned."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-2xl border border-border bg-surface p-6 space-y-3 hover:border-accent/40 transition-colors",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "grid size-12 place-items-center rounded-xl bg-accent/10 text-accent",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Award, { className: "size-6" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-lg font-bold text-fg",
										children: "Zero App Download for Clients"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-sm text-muted leading-relaxed",
										children: "Clients do not need to download any app, create accounts, or remember passwords. Everything runs through their native WhatsApp."
									})
								]
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 md:py-28 relative",
				id: "pricing",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-center max-w-3xl mx-auto space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 rounded-full bg-accent/15 px-4 py-1.5 text-xs font-bold text-accent border border-accent/30",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Percent, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "LIMITED EARLY BIRD OFFER • 50% OFF LIFETIME" })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-fg",
									children: "Transparent Pakistani Pricing. No Hidden Surprises."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-base text-muted",
									children: [
										"Start with a ",
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "7-Day Free Trial" }),
										" today. Lock in 50% early bird discount forever. No credit card required."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-4 flex items-center justify-center gap-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `text-sm font-medium ${billingPeriod === "monthly" ? "text-fg" : "text-muted"}`,
											children: "Monthly Billing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => setBillingPeriod(billingPeriod === "monthly" ? "annual" : "monthly"),
											className: "relative inline-flex h-7 w-14 shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-elevated transition-colors duration-200 ease-in-out focus:outline-none",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `pointer-events-none inline-block size-6 transform rounded-full bg-accent shadow-lg ring-0 transition duration-200 ease-in-out ${billingPeriod === "annual" ? "translate-x-7" : "translate-x-0"}` })
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: `text-sm font-medium flex items-center gap-1.5 ${billingPeriod === "annual" ? "text-fg" : "text-muted"}`,
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Annual Billing" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent",
												children: "2 MONTHS FREE"
											})]
										})
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-14 grid lg:grid-cols-2 max-w-4xl mx-auto gap-8",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border border-border bg-surface p-8 space-y-6 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-xl font-bold text-fg",
												children: "Solo Clinic / Studio"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "rounded-full bg-elevated px-2.5 py-1 text-xs text-muted font-medium",
												children: "1 Doctor / Stylist"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-sm text-muted",
											children: "Perfect for individual doctors, dentists, single-chair salons, or private consultants."
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "pt-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-baseline gap-2",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sm text-muted line-through",
														children: ["Rs ", billingPeriod === "monthly" ? "7,999" : "79,990"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-3xl sm:text-4xl font-extrabold text-fg",
														children: ["Rs ", billingPeriod === "monthly" ? "3,999" : "39,990"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
														className: "text-sm text-muted font-medium",
														children: ["/", billingPeriod === "monthly" ? "month" : "year"]
													})
												]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "inline-block mt-1 text-xs font-semibold text-accent",
												children: "50% Early Bird Discount applied"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-border pt-5 space-y-3 text-sm text-muted",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "font-semibold text-xs uppercase tracking-wider text-fg",
													children: "What's included:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Unlimited Online Bookings" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Automated WhatsApp Reminders (24h & 2h)" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Bilingual: Roman Urdu & English templates" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custom public booking link for Instagram bio" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1-Tap YES / NO patient confirmation" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center gap-2.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "JazzCash & EasyPaisa invoice notes" })]
												})
											]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "pt-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleStartTrial,
										className: "w-full inline-flex items-center justify-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-5 py-3 text-sm font-bold text-accent hover:bg-accent hover:text-accent-fg transition-all cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start 7-Day Free Trial" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-center text-[11px] text-muted mt-2",
										children: "No credit card needed • Cancel anytime"
									})]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded-3xl border-2 border-accent bg-gradient-to-b from-surface via-surface to-elevated p-8 space-y-6 flex flex-col justify-between shadow-2xl relative",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-4 py-1 text-xs font-bold text-accent-fg shadow-md",
										children: "MOST POPULAR IN PAKISTAN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
													className: "text-xl font-bold text-fg",
													children: "Multi-Doctor & Salon Pro"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "rounded-full bg-accent/20 px-2.5 py-1 text-xs text-accent font-semibold",
													children: "Up to 10 Staff / Chairs"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-sm text-muted",
												children: "Designed for aesthetic centers, polyclinics, bridal salons, and multi-specialty practices."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "pt-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-baseline gap-2",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-sm text-muted line-through",
															children: ["Rs ", billingPeriod === "monthly" ? "14,999" : "149,990"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-3xl sm:text-4xl font-extrabold text-accent",
															children: ["Rs ", billingPeriod === "monthly" ? "7,499" : "74,990"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
															className: "text-sm text-muted font-medium",
															children: ["/", billingPeriod === "monthly" ? "month" : "year"]
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "inline-block mt-1 text-xs font-semibold text-accent",
													children: "50% Early Bird Discount applied"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border-t border-border pt-5 space-y-3 text-sm text-muted",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "font-semibold text-xs uppercase tracking-wider text-fg",
														children: "Everything in Solo, plus:"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Up to 10 Doctors / Stylists / Chairs" }) })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Separate working hours & buffer times per doctor" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Custom WhatsApp Business Phone ID integration" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Multi-service catalog & custom pricing" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Daily WhatsApp morning schedule to doctor's phone" })]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "flex items-center gap-2.5 text-fg",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4 text-accent shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Priority WhatsApp VIP Support from our Lahore team" })]
													})
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: handleStartTrial,
											className: "w-full inline-flex items-center justify-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-bold text-accent-fg shadow-lg shadow-accent/25 hover:brightness-110 hover:scale-[1.01] transition-all cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-4" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Start 7-Day Free Trial" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-center text-[11px] text-muted mt-2",
											children: "Instant 2-minute setup • Full feature access"
										})]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-12 max-w-2xl mx-auto rounded-2xl border border-border bg-surface p-4 text-center text-xs text-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-fg",
								children: "Supported Payment Methods:"
							}), " JazzCash, EasyPaisa, Raast Direct, Bank Transfer (Meezan, HBL, Alfalah), Visa & Mastercard."]
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "py-20 md:py-28 bg-surface/30 border-t border-border",
				id: "faq",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-4xl px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-center space-y-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "rounded-full bg-accent/10 px-3.5 py-1 text-xs font-bold text-accent uppercase tracking-wider border border-accent/20",
								children: "Got Questions?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-3xl sm:text-4xl font-extrabold tracking-tight text-fg",
								children: "Frequently Asked Questions."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-base text-muted",
								children: "Everything you need to know about setting up automated WhatsApp booking for your business in Pakistan."
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-12 space-y-4",
						children: [
							{
								q: "How does the 7-day free trial work?",
								a: "You get full, unrestricted access to all features (automated WhatsApp reminders, custom booking link, multi-staff calendar) for 7 days. You do not need to enter any credit card. If you love it, you can subscribe with JazzCash, EasyPaisa, or Bank Transfer. If not, you won't be charged anything."
							},
							{
								q: "What is the Early Bird Discount?",
								a: "To celebrate our Pakistan launch, the first 50 verified clinics and salons receive a permanent 50% discount for the lifetime of their account. For Solo it is Rs 3,999/mo (was Rs 7,999) and for Multi-Staff it is Rs 7,499/mo (was Rs 14,999)."
							},
							{
								q: "Do my clients or patients need to install any new app?",
								a: "No! That is the biggest benefit of WaBook. Clients simply tap your link from Instagram, WhatsApp, or Google Maps, choose their slot, and receive all reminders and confirmation prompts in their existing WhatsApp app."
							},
							{
								q: "Can reminders be sent in Roman Urdu?",
								a: "Yes! WaBook comes pre-configured with culturally tailored Roman Urdu templates (e.g. 'Aapki appointment kal 4:00 PM par scheduled hai. Confirm karne ke liye YES reply karein') as well as standard professional English. You can customize them anytime."
							},
							{
								q: "Is there any risk of my WhatsApp number being blocked?",
								a: "None. WaBook connects directly through Meta's Official WhatsApp Cloud API with pre-approved Meta utility templates. Unlike unauthorized desktop bots or scraping tools, your number is 100% compliant and protected."
							},
							{
								q: "How do I pay after the 7-day free trial?",
								a: "We accept JazzCash, EasyPaisa, Raast, Direct Online Bank Transfer (Meezan Bank, HBL, Bank Alfalah), and local Pakistani debit/credit cards."
							},
							{
								q: "How long does setup take?",
								a: "Literally 2 minutes. Sign in with Google, enter your clinic name, add your working hours and services (e.g., Teeth Scaling, Bridal Makeup, Consultation), and your custom booking link is immediately ready to share."
							}
						].map((faq, idx) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-2xl border border-border bg-surface overflow-hidden transition-all",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setOpenFaq(openFaq === idx ? null : idx),
								className: "w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold text-fg hover:text-accent transition-colors cursor-pointer",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: faq.q }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: `size-4 shrink-0 text-muted transition-transform duration-200 ${openFaq === idx ? "rotate-180 text-accent" : ""}` })]
							}), openFaq === idx && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "px-5 pb-5 text-sm text-muted leading-relaxed border-t border-border/50 pt-3",
								children: faq.a
							})]
						}, idx))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "py-20 md:py-28 relative overflow-hidden bg-gradient-to-b from-surface via-elevated to-bg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-[500px] rounded-full bg-accent/15 blur-[120px] pointer-events-none" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mx-auto max-w-5xl px-4 sm:px-6 text-center space-y-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 rounded-full bg-accent/20 px-4 py-1.5 text-xs font-bold text-accent border border-accent/40",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Only 13 Early Bird Discount Spots Remaining" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
							className: "text-3xl sm:text-5xl font-extrabold tracking-tight text-fg leading-tight",
							children: [
								"Stop Losing Thousands to Empty Slots.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-accent",
									children: "Get Your Clinic Live on WhatsApp Today."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-base sm:text-lg text-muted max-w-2xl mx-auto",
							children: "Join 150+ dental surgeons, aesthetic specialists, and premier salons across Pakistan saving 3+ hours every day and eliminating no-shows."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-4 flex flex-col sm:flex-row items-center justify-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: handleStartTrial,
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-accent px-8 py-4 text-base font-extrabold text-accent-fg shadow-xl shadow-accent/30 hover:brightness-110 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "size-5" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Claim 7-Day Free Trial" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-5" })
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
								href: "https://wa.me/923001234567?text=Hi%20WaBook%2C%20I%20want%20to%20learn%20more%20about%20the%20Early%20Bird%20Offer",
								target: "_blank",
								rel: "noopener noreferrer",
								className: "w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl border border-border bg-surface px-6 py-4 text-sm font-semibold text-fg hover:bg-elevated transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PhoneCall, { className: "size-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Chat with Founder on WhatsApp" })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted pt-2",
							children: "No credit card required • Instant 2-minute setup • Cancel anytime"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border bg-bg py-12 text-xs text-muted",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto max-w-7xl px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid size-8 place-items-center rounded-lg bg-accent text-accent-fg font-bold text-sm",
								children: "W"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-bold text-fg",
								children: "WaBook.cloud"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-[11px] text-muted",
								children: "Automated WhatsApp Booking for Pakistan 🇵🇰"
							})] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-center gap-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#how-it-works",
									className: "hover:text-fg transition-colors",
									children: "How It Works"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#demo",
									className: "hover:text-fg transition-colors",
									children: "WhatsApp Demo"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#calculator",
									className: "hover:text-fg transition-colors",
									children: "ROI Calculator"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#pricing",
									className: "hover:text-fg transition-colors",
									children: "Pricing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "#faq",
									className: "hover:text-fg transition-colors",
									children: "FAQ"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
									href: "/login",
									className: "hover:text-fg transition-colors",
									children: "Clinic Sign In"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-center md:text-right",
							children: [
								"© ",
								(/* @__PURE__ */ new Date()).getFullYear(),
								" WaBook. All rights reserved.",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"Made for Pakistani healthcare & beauty entrepreneurs."
							]
						})
					]
				})
			})
		]
	});
}
function Home() {
	const { user, isPending } = useCurrentUserState();
	const [view, setView] = (0, import_react.useState)("landing");
	(0, import_react.useEffect)(() => {
		if (typeof window !== "undefined") {
			const params = new URLSearchParams(window.location.search);
			if (params.get("view") === "landing") {
				setView("landing");
				return;
			}
			if (params.get("view") === "desk" && user) {
				setView("desk");
				return;
			}
		}
		if (user) setView("desk");
		else setView("landing");
	}, [user]);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-bg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-40 animate-pulse rounded-lg bg-elevated" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted",
			children: "Loading WaBook…"
		})]
	});
	if (view === "desk" && user) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-surface border-b border-border px-4 py-1.5 text-xs text-muted flex items-center justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Signed in as ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: user.displayName || user.primaryEmail || "Clinic Owner" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			onClick: () => setView("landing"),
			className: "text-accent hover:underline font-medium cursor-pointer",
			children: "Preview Public Landing Page & Pricing Offers →"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {})] });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingPage, {
		user,
		onOpenDesk: () => setView("desk")
	});
}
//#endregion
export { Home as component };
