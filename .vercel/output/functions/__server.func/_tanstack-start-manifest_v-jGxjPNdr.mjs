//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-jGxjPNdr.js
var tsrStartManifest = () => ({ routes: {
	__root__: {
		filePath: "D:/whatsapp bot/src/routes/__root.tsx",
		children: [
			"/",
			"/login",
			"/book/$slug",
			"/api/auth/$",
			"/api/cron/reminders",
			"/api/whatsapp/webhook"
		],
		preloads: [
			"/assets/index-CcZ6XKbc.js",
			"/assets/react-SIfiwpqq.js",
			"/assets/preload-helper-COwB5Dwn.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-CcZ6XKbc.js"
		} }]
	},
	"/": {
		filePath: "D:/whatsapp bot/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-B_cs-tZy.js",
			"/assets/api-DdvWWMqe.js",
			"/assets/client-Du39pt7q.js"
		]
	},
	"/login": {
		filePath: "D:/whatsapp bot/src/routes/login.tsx",
		children: void 0,
		preloads: ["/assets/login-BBcbNNXA.js", "/assets/client-Du39pt7q.js"]
	},
	"/book/$slug": {
		filePath: "D:/whatsapp bot/src/routes/book.$slug.tsx",
		children: void 0,
		preloads: ["/assets/book._slug-eY4lhkL0.js", "/assets/api-DdvWWMqe.js"]
	}
} });
//#endregion
export { tsrStartManifest };
