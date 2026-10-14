import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cron/reminders")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});

async function handle({ request }: { request: Request }) {
  const secret = process.env.CRON_SECRET?.trim();
  const auth = request.headers.get("authorization") || "";
  const url = new URL(request.url);
  const q = url.searchParams.get("secret") || "";
  if (secret && auth !== `Bearer ${secret}` && q !== secret) {
    return new Response("forbidden", { status: 403 });
  }
  const { sweepAllDueReminders } = await import("@/lib/booking/api");
  const result = await sweepAllDueReminders();
  return Response.json(result);
}
