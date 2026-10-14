//#region node_modules/.nitro/vite/services/ssr/assets/_tanstack-start-manifest_v-GMlwYyW5.js
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
			"/assets/index-C0Hc2h1J.js",
			"/assets/react-SIfiwpqq.js",
			"/assets/preload-helper-COwB5Dwn.js"
		],
		scripts: [{ attrs: {
			type: "module",
			async: !0,
			src: "/assets/index-C0Hc2h1J.js"
		} }]
	},
	"/": {
		filePath: "D:/whatsapp bot/src/routes/index.tsx",
		children: void 0,
		preloads: [
			"/assets/routes-CgDjl-9Q.js",
			"/assets/api-D8fifq19.js",
			"/assets/client-Ckp19iGw.js"
		]
	},
	"/login": {
		filePath: "D:/whatsapp bot/src/routes/login.tsx",
		children: void 0,
		preloads: ["/assets/login-DQ2ze9vC.js", "/assets/client-Ckp19iGw.js"]
	},
	"/book/$slug": {
		filePath: "D:/whatsapp bot/src/routes/book.$slug.tsx",
		children: void 0,
		preloads: ["/assets/book._slug-CwxxuUHQ.js", "/assets/api-D8fifq19.js"]
	}
} });
//#endregion
export { tsrStartManifest };
