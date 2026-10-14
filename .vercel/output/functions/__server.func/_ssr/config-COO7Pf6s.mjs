//#region node_modules/.nitro/vite/services/ssr/assets/config-COO7Pf6s.js
/** Server-only WhatsApp Cloud API. Token never goes to the browser. */
var CLINIC_TOKEN = "EAAWV2tFTZB8gBSrQZB08wptweFyWp9CcEUEjjZBIAVQZAbUKwN85pLZC4ZAKZBZB4fExIopewKDccPY9Yg6g8FBZA7kmZC9mGXzrvIDmGeV53FSEiooTXaDqssGoZADTEGWJf1sQPDp5LH7ojupigjM3wfwz7bxQ19jJXhlj3zBhT31paSSu5hC6gAyZCw7uGUAsqGBMBAZDZD";
var CLINIC_PHONE_ID = "1324830960717933";
function getWhatsappConfig(override) {
	const token = (process.env.WHATSAPP_TOKEN || CLINIC_TOKEN).trim();
	const phoneId = (process.env.WHATSAPP_PHONE_NUMBER_ID || CLINIC_PHONE_ID).trim();
	return {
		token,
		phoneId,
		verifyToken: process.env.WHATSAPP_VERIFY_TOKEN?.trim() || "wabook-verify",
		appSecret: process.env.WHATSAPP_APP_SECRET?.trim() || "",
		templateName: (process.env.WHATSAPP_TEMPLATE_NAME || "booking_notification").trim(),
		configured: Boolean(token && phoneId)
	};
}
//#endregion
export { getWhatsappConfig };
