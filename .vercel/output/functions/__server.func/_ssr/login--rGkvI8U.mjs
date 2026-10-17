import { o as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as signIn, t as authClient } from "./client-DaPSa0yY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login--rGkvI8U.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Login() {
	const [error, setError] = (0, import_react.useState)(null);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const session = authClient.useSession();
	(0, import_react.useEffect)(() => {
		if (session.data?.user) window.location.href = "/";
	}, [session.data?.user]);
	const handleGoogleSignIn = async () => {
		setBusy(true);
		setError(null);
		try {
			await signIn("google", { callbackURL: "/" });
		} catch (err) {
			const message = err instanceof Error ? err.message : "Failed to sign in with Google. Please try again.";
			setError(message);
		} finally {
			setBusy(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		className: "grid min-h-screen place-items-center bg-bg px-5 py-10",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "w-full max-w-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/",
					className: "inline-flex items-center gap-1.5 text-xs text-muted hover:text-accent mb-6 transition-colors",
					children: "← Back to WaBook Overview & Pricing"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-6 flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid size-11 place-items-center rounded-xl bg-gradient-to-br from-accent to-emerald-600 text-accent-fg font-bold shadow-lg shadow-accent/20",
						children: "W"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-lg font-bold tracking-tight text-fg",
							children: "WaBook"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-accent-dim px-2 py-0.5 text-[10px] font-semibold text-accent border border-accent/20",
							children: "Pakistan 🇵🇰"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: "Clinic & Salon Portal"
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-5 rounded-xl border border-accent/30 bg-accent/10 p-3 text-xs text-fg space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-bold text-accent flex items-center gap-1",
						children: "🔥 7-Day Free Trial Active"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-muted leading-relaxed",
						children: [
							"Sign in to start your free 7-day trial and lock in the ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "50% Early Bird Discount" }),
							" (Rs 3,999/mo). No credit card required."
						]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-2xl font-bold tracking-tight text-fg",
					children: "Open your clinic desk"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1.5 text-xs text-muted leading-relaxed",
					children: "Manage your schedule, automated bilingual WhatsApp reminders, and custom booking link in 2 minutes."
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 rounded-md border border-warn/40 bg-warn/10 p-3 text-xs text-warn leading-relaxed",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: handleGoogleSignIn,
						className: "flex w-full items-center justify-center gap-3 rounded-xl border border-border bg-surface px-4 py-3 text-sm font-semibold text-fg transition-all hover:bg-elevated hover:border-accent/40 disabled:opacity-50 shadow-md cursor-pointer",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
							className: "size-4 shrink-0",
							viewBox: "0 0 24 24",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#4285F4",
									d: "M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#34A853",
									d: "M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#FBBC05",
									d: "M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.03 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
									fill: "#EA4335",
									d: "M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.94 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
								})
							]
						}), busy ? "Connecting to Google…" : "Continue with Google"]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 border-t border-border/80 pt-4 text-center text-[11px] text-muted space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "⚡ Setup takes under 2 minutes • No card needed" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Protected by Meta Official WhatsApp Cloud API" })]
				})
			]
		})
	});
}
//#endregion
export { Login as component };
