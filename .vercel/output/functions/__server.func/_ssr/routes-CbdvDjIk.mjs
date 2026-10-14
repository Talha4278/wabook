import { o as __toESM } from "../_runtime.mjs";
import { _ as Navigate, y as require_jsx_runtime, z as require_react } from "../_libs/@tanstack/react-router+[...].mjs";
import { S as Bell, _ as Copy, b as Check, c as Send, d as MessageSquare, f as Menu, g as CreditCard, h as Link2, i as UserPlus, l as Plus, m as List, n as Users, o as Trash2, p as LoaderCircle, r as UserX, s as Stethoscope, t as X, u as Pencil, v as ChevronRight, x as CalendarDays, y as ChevronLeft } from "../_libs/lucide-react.mjs";
import { _ as updateBookingStatus, c as deleteStaff, f as runReminderSweep, h as simulateInbound, i as createDashboardBooking, l as getDashboard, m as sendBookingReminder, o as createStaff, p as saveSettings, r as completeOnboarding, s as deleteService, v as upsertService } from "./router-CpgPxsLM.mjs";
import { i as signOut, t as authClient } from "./client-DntVSK3C.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CbdvDjIk.js
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
* Stable fallback user, used ONLY when auth is disabled
* (`VITE_AUTH_ENABLED=false`, the shipped default). With auth on, the sandbox
* live preview does real sign-in via the baked preview client. Its id is
* `"dev-user"` — the SAME id `verify.server.ts` returns server-side — so per-user
* rows written in that mode belong to one consistent owner.
*/
var DEV_USER = {
	id: "dev-user",
	displayName: "Dev User",
	primaryEmail: "dev@example.com",
	profileImageUrl: null,
	isDevFallback: true
};
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
	const [isDevMode, setIsDevMode] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		setMounted(true);
		if (typeof window !== "undefined") {
			if (window.localStorage.getItem("wabook_dev_mode") === "false") setIsDevMode(false);
			else {
				window.localStorage.setItem("wabook_dev_mode", "true");
				setIsDevMode(true);
			}
		}
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
	if (isDevMode) return {
		user: DEV_USER,
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
		onSave: async (name) => {
			setBusy(true);
			try {
				setData(await completeOnboarding({ data: { name } }));
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
function ClinicSetup({ onSave, busy }) {
	const [name, setName] = (0, import_react.useState)("");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid min-h-screen place-items-center bg-bg px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			className: "w-full max-w-md space-y-5 rounded-2xl border border-border bg-surface p-6",
			onSubmit: (e) => {
				e.preventDefault();
				onSave(name);
			},
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-semibold uppercase tracking-wider text-accent",
					children: "WaBook"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold tracking-tight",
					children: "Name your clinic"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "This is what patients see on the booking link and in WhatsApp reminders. You can change it later."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "block text-sm",
					children: ["Clinic name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						autoFocus: true,
						required: true,
						minLength: 2,
						value: name,
						onChange: (e) => setName(e.target.value),
						placeholder: "e.g. Hashir Dental & Aesthetic Clinic",
						className: "mt-1.5 w-full rounded-md border border-border bg-elevated px-3 py-2.5 text-fg"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "submit",
					disabled: busy || name.trim().length < 2,
					className: "w-full rounded-md bg-accent py-2.5 text-sm font-semibold text-accent-fg disabled:opacity-50",
					children: busy ? "Saving…" : "Continue"
				})
			]
		})
	});
}
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dashboard, {});
}
//#endregion
export { Home as component };
