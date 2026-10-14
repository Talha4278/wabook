import { createFileRoute } from "@tanstack/react-router";

type WaChange = {
  value?: {
    messages?: { from: string; text?: { body?: string }; type?: string }[];
  };
};

export const Route = createFileRoute("/api/whatsapp/webhook")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const { getWhatsappConfig } = await import("@/lib/whatsapp/config");
        const url = new URL(request.url);
        const mode = url.searchParams.get("hub.mode");
        const token = url.searchParams.get("hub.verify_token");
        const challenge = url.searchParams.get("hub.challenge");
        const { verifyToken } = getWhatsappConfig();
        if (mode === "subscribe" && token === verifyToken && challenge) {
          return new Response(challenge, { status: 200 });
        }
        return new Response("Forbidden", { status: 403 });
      },
      POST: async ({ request }) => {
        const { handleInboundWhatsapp } = await import("@/lib/booking/inbound");
        let payload: { entry?: { changes?: WaChange[] }[] } = {};
        try {
          payload = (await request.json()) as typeof payload;
        } catch {
          return new Response("ok", { status: 200 });
        }
        const messages =
          payload.entry?.flatMap((e) => e.changes ?? []).flatMap((c) => c.value?.messages ?? []) ??
          [];
        for (const msg of messages) {
          if (!msg?.from) continue;
          const body = msg.text?.body ?? "";
          if (!body) continue;
          try {
            await handleInboundWhatsapp(msg.from, body);
          } catch (err) {
            console.error("[whatsapp] inbound", err);
          }
        }
        return new Response("ok", { status: 200 });
      },
    },
  },
});
