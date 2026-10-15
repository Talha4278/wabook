import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as createPublicBooking, d as getPublicSlots, n as Route$3, u as getPublicShop } from "./router-CGxfKhfK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._slug-DDa_VDy9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatTime12h(hm) {
	const [h, m] = hm.split(":").map(Number);
	const period = h >= 12 ? "PM" : "AM";
	return `${h % 12 === 0 ? 12 : h % 12}:${String(m).padStart(2, "0")} ${period}`;
}
function formatHoursSummary(hours) {
	if (!hours || hours.length === 0) return "Consultation hours by appointment";
	const dayNames = [
		"Sun",
		"Mon",
		"Tue",
		"Wed",
		"Thu",
		"Fri",
		"Sat"
	];
	const openDays = hours.filter((h) => !h.closed);
	if (openDays.length === 0) return "Temporarily closed";
	const first = openDays[0];
	const sameHours = openDays.every((h) => h.open === first.open && h.close === first.close);
	const timeSpan = sameHours ? `${formatTime12h(first.open)} – ${formatTime12h(first.close)}` : "";
	const closedSun = hours.find((h) => h.day === 0)?.closed;
	if ([
		1,
		2,
		3,
		4,
		5,
		6
	].every((d) => !hours.find((h) => h.day === d)?.closed) && closedSun && sameHours) return `Mon–Sat ${timeSpan} (Sun Closed)`;
	if (openDays.length === 7 && sameHours) return `Mon–Sun ${timeSpan}`;
	return `${openDays.map((h) => dayNames[h.day]).join(", ")} ${timeSpan}`.trim();
}
function getTodayYmd(tz) {
	return new Intl.DateTimeFormat("en-CA", {
		timeZone: tz,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).format(/* @__PURE__ */ new Date());
}
function getNextDayYmd(currentYmd) {
	const [y, m, d] = currentYmd.split("-").map(Number);
	const date = new Date(Date.UTC(y, (m || 1) - 1, d || 1));
	date.setUTCDate(date.getUTCDate() + 1);
	return date.toISOString().slice(0, 10);
}
function PublicBook() {
	const { slug } = Route$3.useParams();
	const [shop, setShop] = (0, import_react.useState)(void 0);
	const [serviceId, setServiceId] = (0, import_react.useState)(null);
	const [staffId, setStaffId] = (0, import_react.useState)(null);
	const [date, setDate] = (0, import_react.useState)(() => (/* @__PURE__ */ new Date()).toISOString().slice(0, 10));
	const [slotData, setSlotData] = (0, import_react.useState)({ slots: [] });
	const [startsAt, setStartsAt] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [done, setDone] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
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
					hour12: false
				}).format(/* @__PURE__ */ new Date());
				const dow = {
					Sun: 0,
					Mon: 1,
					Tue: 2,
					Wed: 3,
					Thu: 4,
					Fri: 5,
					Sat: 6
				}[new Intl.DateTimeFormat("en-US", {
					timeZone: tz,
					weekday: "short"
				}).format(/* @__PURE__ */ new Date())] ?? 0;
				const todayHours = s.business.hours?.find((h) => h.day === dow);
				if (!todayHours || todayHours.closed || todayHours.close && timeInTz >= todayHours.close) setDate(getNextDayYmd(todayYmd));
				else setDate(todayYmd);
			}
		});
	}, [slug]);
	(0, import_react.useEffect)(() => {
		if (!serviceId) return;
		getPublicSlots({ data: {
			slug,
			date,
			serviceId
		} }).then((r) => {
			setSlotData(r);
			setStartsAt("");
		});
	}, [
		slug,
		date,
		serviceId
	]);
	const categories = (0, import_react.useMemo)(() => {
		if (!shop?.services) return [];
		return Array.from(new Set(shop.services.map((s) => s.category || "General")));
	}, [shop?.services]);
	if (shop === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg text-muted",
		children: "Loading…"
	});
	if (!shop) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-fg",
			children: "This booking link is not active yet."
		})
	});
	if (done) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-6 text-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto mb-4 grid size-12 place-items-center rounded-full bg-accent/20 text-accent",
					children: "✓"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-semibold text-fg",
					children: "Appointment Requested"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [done.shop, " has successfully recorded your booking request."]
				}),
				done.whatsappError ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 p-3.5 text-left text-xs text-amber-200",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
						className: "block font-semibold text-amber-300",
						children: "WhatsApp Notification Note:"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1",
						children: done.whatsappError
					})]
				}) : done.simulated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-xs text-muted",
					children: "A WhatsApp confirmation notification has been recorded in the clinic system."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 rounded-xl border border-accent/30 bg-accent/10 p-3.5 text-left text-xs text-accent-fg",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-accent",
						children: "Confirmation dispatched to WhatsApp!"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-muted",
						children: [
							"Please check your WhatsApp and reply ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "YES" }),
							" to confirm your slot."
						]
					})]
				})
			]
		})
	});
	const svc = shop.services.find((s) => s.id === serviceId);
	const hoursSubtitle = formatHoursSummary(shop.business.hours);
	const tz = shop.business.timezone || "Asia/Karachi";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "min-h-screen bg-bg px-4 py-10 text-fg",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto w-full max-w-md",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs font-medium uppercase tracking-wider text-accent",
					children: "Book on WhatsApp"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-2 text-3xl font-semibold tracking-tight",
					children: shop.business.name
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [hoursSubtitle, ". We will message you on WhatsApp to confirm."]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "mt-8 space-y-4",
					onSubmit: async (e) => {
						e.preventDefault();
						if (!serviceId || !startsAt) return;
						const chosenStaffId = staffId || shop.staff[0]?.id || 0;
						setBusy(true);
						setError(null);
						try {
							const res = await createPublicBooking({ data: {
								slug,
								name,
								phone,
								serviceId,
								staffId: chosenStaffId,
								startsAt
							} });
							setDone({
								shop: res.shop,
								simulated: res.simulated,
								whatsappOk: res.whatsappOk,
								whatsappError: res.whatsappError
							});
						} catch (err) {
							setError(err instanceof Error ? err.message : "Could not complete booking");
						} finally {
							setBusy(false);
						}
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Select Treatment / Service"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg",
								value: serviceId ?? "",
								onChange: (e) => setServiceId(Number(e.target.value)),
								children: categories.map((cat) => {
									const items = shop.services.filter((s) => (s.category || "General") === cat);
									if (!items.length) return null;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("optgroup", {
										label: cat,
										children: items.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
											value: s.id,
											children: [
												s.name,
												" · Rs ",
												s.pricePkr.toLocaleString("en-PK"),
												" · ",
												s.durationMin,
												"m"
											]
										}, s.id))
									}, cat);
								})
							})]
						}),
						shop.staff.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Practitioner / Doctor"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg",
								value: staffId ?? "",
								onChange: (e) => setStaffId(Number(e.target.value)),
								children: shop.staff.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: s.id,
									children: s.name
								}, s.id))
							})]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "rounded-md border border-border bg-surface/50 p-2 text-xs text-muted",
							children: "General Practitioner assigned"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "date",
								className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg",
								value: date,
								onChange: (e) => setDate(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Available Time"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: slotData.slots.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "w-full rounded-lg border border-border bg-surface/70 p-3 text-sm text-muted",
								children: [slotData.reason === "closed" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"The clinic is ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: ["closed on ", slotData.dayName || "this day"] }),
									"."
								] }) : slotData.reason === "past_or_booked" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "All appointment slots for this date have either ended or are fully booked." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "No open slots available for this service on this date." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setDate(getNextDayYmd(date)),
									className: "mt-2.5 inline-flex items-center rounded bg-accent/20 px-3 py-1 text-xs font-medium text-accent hover:bg-accent/30",
									children: "Check next day →"
								})]
							}) : slotData.slots.map((iso) => {
								const label = new Intl.DateTimeFormat("en-GB", {
									hour: "numeric",
									minute: "2-digit",
									hour12: true,
									timeZone: tz
								}).format(new Date(iso));
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setStartsAt(iso),
									className: `rounded-md px-3 py-2 text-sm font-medium transition-colors ${startsAt === iso ? "bg-accent text-accent-fg" : "border border-border bg-surface hover:bg-elevated text-fg"}`,
									children: label
								}, iso);
							})
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "Your Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg",
								value: name,
								onChange: (e) => setName(e.target.value),
								placeholder: "e.g. Ali Ahmed"
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "block text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-muted",
								children: "WhatsApp Number"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								required: true,
								inputMode: "tel",
								className: "mt-1 w-full rounded-md border border-border bg-surface px-3 py-2.5 text-fg",
								value: phone,
								onChange: (e) => setPhone(e.target.value),
								placeholder: "03XXXXXXXXX"
							})]
						}),
						svc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-sm text-muted",
							children: [
								svc.name,
								" · Rs ",
								svc.pricePkr.toLocaleString("en-PK")
							]
						}) : null,
						error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-danger",
							children: error
						}) : null,
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							disabled: busy || !startsAt,
							className: "w-full rounded-md bg-accent py-3 text-sm font-semibold text-accent-fg disabled:opacity-50",
							children: busy ? "Booking…" : "Request appointment"
						})
					]
				})
			]
		})
	});
}
//#endregion
export { PublicBook as component };
