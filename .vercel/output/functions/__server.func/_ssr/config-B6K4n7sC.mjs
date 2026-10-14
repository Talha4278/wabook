//#region node_modules/.nitro/vite/services/ssr/assets/config-B6K4n7sC.js
/** Server-only WhatsApp Cloud API. Token never goes to the browser. */
var CLINIC_TOKEN = "EAAWV2tFTZB8gBShL692zZCMeYm64dypn0zdaOV17V7Au2YnBlUM7MRG3b13ZCmJmDPeg3BFEZCR5g17ZASqOE3Q5iCJsFN069WXTiuHEjRXWUXnaimaVSu9RexmZCAwTHBt0YD91MFOhZAvJxxdSzZBPG0cCPlYZA9e8zJmZAB5qTwzZCYWefqcMYcxT0htWP4IuAZDZD";
var CLINIC_PHONE_ID = "1324830960717933";
function getWhatsappConfig(override) {
	const token = (process.env.WHATSAPP_TOKEN || CLINIC_TOKEN).trim();
	const phoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID || CLINIC_PHONE_ID).trim();
	return {
		token,
		phoneId,
		verifyToken: process.env.WHATSAPP_VERIFY_TOKEN?.trim() || "wabook-verify",
		appSecret: process.env.WHATSAPP_APP_SECRET?.trim() || "",
		templateName: process.env.WHATSAPP_TEMPLATE_NAME?.trim() || "",
		configured: Boolean(token && phoneId)
	};
}
//#endregion
export { getWhatsappConfig };
