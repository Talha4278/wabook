import { getWhatsappConfig } from "./config";

export type SendResult = { ok: boolean; simulated: boolean; error?: string };

function digits(phone: string) {
  return phone.replace(/\D/g, "");
}

function toE164(phone: string) {
  let d = digits(phone);
  if (d.startsWith("00")) d = d.slice(2);
  if (d.startsWith("9203") && d.length === 13) d = `92${d.slice(3)}`;
  if (d.startsWith("0") && d.length === 11) d = `92${d.slice(1)}`;
  if (d.startsWith("3") && d.length === 10) d = `92${d}`;
  return d;
}

function extractTemplateParamsFromBody(text: string): string[] | null {
  const match = text.match(
    /^Hi\s+(.+?)\s*\r?\nThis is\s+(.+?)\s+reminding you of your\s+(.+?)\s+on\s+(.+?)\s+at\s+([^.\n\r]+)/i,
  );
  if (match) {
    return [match[1].trim(), match[2].trim(), match[3].trim(), match[4].trim(), match[5].trim()];
  }
  return null;
}

export async function sendWhatsappText(
  toPhone: string,
  body: string,
  creds?: { token?: string; phoneId?: string; templateParams?: string[] },
): Promise<SendResult> {
  const { token, phoneId, configured, templateName } = getWhatsappConfig(creds);
  if (!configured) {
    return { ok: true, simulated: true };
  }
  const to = toE164(toPhone);
  if (to.length < 10) {
    return { ok: false, simulated: false, error: "Invalid phone number" };
  }

  // Meta WhatsApp Cloud API strictly forbids a business from messaging its own phone number
  if (to === "923344634278") {
    const errorMsg =
      "WhatsApp Cloud API cannot send messages to the clinic's own phone number (+92 334 4634278). Please test with another recipient phone number.";
    console.warn(`[WhatsApp] ${errorMsg}`);
    return {
      ok: false,
      simulated: false,
      error: errorMsg,
    };
  }

  const textPayload = {
    messaging_product: "whatsapp",
    to,
    type: "text",
    text: { preview_url: false, body },
  };

  const params = creds?.templateParams || extractTemplateParamsFromBody(body);
  const templatePayload = templateName
    ? {
        messaging_product: "whatsapp",
        to,
        type: "template",
        template: {
          name: templateName,
          language: { code: "en_US" },
          ...(params && params.length > 0
            ? {
                components: [
                  {
                    type: "body",
                    parameters: params.map((p) => ({
                      type: "text",
                      text: p,
                    })),
                  },
                ],
              }
            : {}),
        },
      }
    : null;

  const first = await graphSend(phoneId, token, textPayload);
  if (first.ok) return first;
  if (templatePayload) {
    const second = await graphSend(phoneId, token, templatePayload);
    if (second.ok) return second;
    // If the template failed due to language code mismatch (e.g. Meta registered it as "en" instead of "en_US"), retry with "en"
    if (second.error && second.error.toLowerCase().includes("language")) {
      const altPayload = {
        ...templatePayload,
        template: {
          ...templatePayload.template,
          language: { code: "en" },
        },
      };
      const third = await graphSend(phoneId, token, altPayload);
      if (third.ok) return third;
    }
    return { ok: false, simulated: false, error: second.error || first.error };
  }
  return first;
}

async function graphSend(
  phoneId: string,
  token: string,
  payload: unknown,
): Promise<SendResult> {
  try {
    const res = await fetch(`https://graph.facebook.com/v21.0/${phoneId}/messages`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const text = await res.text();
      let errMsg = text.slice(0, 280) || `HTTP ${res.status}`;
      try {
        const parsed = JSON.parse(text);
        if (parsed?.error?.message) {
          errMsg = parsed.error.message;
        }
      } catch {}
      console.error("[WhatsApp] Meta API send error:", errMsg);
      return {
        ok: false,
        simulated: false,
        error: errMsg,
      };
    }
    const to = (payload as { to?: string })?.to;
    console.log(`[WhatsApp] Message dispatched successfully to ${to}`);
    return { ok: true, simulated: false };
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Send failed";
    console.error("[WhatsApp] Network / unexpected error:", msg);
    return {
      ok: false,
      simulated: false,
      error: msg,
    };
  }
}

