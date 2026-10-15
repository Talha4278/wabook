import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/cron/reminders")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
      HEAD: handleHead,
    },
  },
});

let lastSweepTime = 0;
const THROTTLE_WINDOW_MS = 5000; // 5-second throttle against duplicate rapid bursts

async function handleHead() {
  return new Response(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

async function handle({ request }: { request: Request }) {
  const now = Date.now();

  // If called too rapidly (within 5 seconds), return 200 without hammering the database
  if (now - lastSweepTime < THROTTLE_WINDOW_MS) {
    return Response.json(
      {
        ok: true,
        throttled: true,
        timestamp: new Date().toISOString(),
        sent: 0,
        simulated: 0,
        message: "Sweep recently processed, waiting for next interval",
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  lastSweepTime = now;

  try {
    const { sweepAllDueReminders } = await import("@/lib/booking/api");
    const result = await sweepAllDueReminders();
    return Response.json(
      {
        ok: true,
        timestamp: new Date().toISOString(),
        ...result,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  } catch (err: unknown) {
    console.error("[CRON_REMINDERS_ERROR]", err);
    return Response.json(
      {
        ok: false,
        error: err instanceof Error ? err.message : "Internal sweep error",
        timestamp: new Date().toISOString(),
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }
}
