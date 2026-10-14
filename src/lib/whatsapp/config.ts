/** Server-only WhatsApp Cloud API. Token never goes to the browser. */

const CLINIC_TOKEN =
  "EAAWV2tFTZB8gBSrQZB08wptweFyWp9CcEUEjjZBIAVQZAbUKwN85pLZC4ZAKZBZB4fExIopewKDccPY9Yg6g8FBZA7kmZC9mGXzrvIDmGeV53FSEiooTXaDqssGoZADTEGWJf1sQPDp5LH7ojupigjM3wfwz7bxQ19jJXhlj3zBhT31paSSu5hC6gAyZCw7uGUAsqGBMBAZDZD";
const CLINIC_PHONE_ID = "1324830960717933";

export function getWhatsappConfig(override?: { token?: string; phoneId?: string }) {
  const token = (process.env.WHATSAPP_TOKEN || CLINIC_TOKEN || override?.token || "").trim();
  const phoneId = (
    process.env.WHATSAPP_PHONE_NUMBER_ID ||
    CLINIC_PHONE_ID ||
    override?.phoneId ||
    ""
  ).trim();
  const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN?.trim() || "wabook-verify";
  const appSecret = process.env.WHATSAPP_APP_SECRET?.trim() || "";
  const templateName = (process.env.WHATSAPP_TEMPLATE_NAME || "booking_notification").trim();
  const configured = Boolean(token && phoneId);
  return { token, phoneId, verifyToken, appSecret, templateName, configured };
}
